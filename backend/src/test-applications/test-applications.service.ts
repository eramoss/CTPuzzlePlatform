import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import Participation from 'src/participation/participation.entity';
import { ParticipationService } from 'src/participation/participation.service';
import { TestService } from 'src/tests/tests.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Brackets, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TestApplication, TestApplicationVisibility } from './test-application.entity';
import { v4 as uuidv4 } from "uuid";
import { ConfigService } from '@nestjs/config';
import PreparedParticipation from 'src/participation/prepared-participation.dto';
import { Mechanic } from 'src/mechanics/mechanic.entity';
import { buildCsv } from 'src/util/download';
import { ItemResponse } from 'src/item-responses/item-response.entity';

@Injectable()
export class TestApplicationsService {

    constructor(
        @InjectRepository(TestApplication)
        private testApplicationRepository: Repository<TestApplication>,
        @InjectRepository(ItemResponse)
        private itemResponseRepository: Repository<ItemResponse>,
        private usersService: UsersService,
        private participationService: ParticipationService,
        private testService: TestService,
        private configService: ConfigService,
    ) {
    }

    getPuplicApplications(): Promise<TestApplication[]> {
        return this.testApplicationRepository.createQueryBuilder('test-application')
            .leftJoinAndSelect('test-application.test', 'test')
            .leftJoinAndSelect('test.items', 'testItem')
            .leftJoinAndSelect('testItem.item', 'item')
            .orderBy('test-application.createdAt', 'DESC')
            .where("test-application.visibility = 'PUBLIC'")
            .getMany()
    }

    save(testApplication: TestApplication): Promise<TestApplication> {
        return this.testApplicationRepository.save(testApplication);
    }

    async getLastResponse(applicationId: number): Promise<ItemResponse> {
        let itemResponse = await this.itemResponseRepository.createQueryBuilder('itemResponse')
            .leftJoinAndSelect('itemResponse.participation', 'participation')
            .leftJoinAndSelect('participation.user', 'user')
            .leftJoinAndSelect('participation.application', 'testApplication')
            .where('testApplication.id = :id', { id: applicationId })
            .andWhere("itemResponse.deletedAt is null")
            .orderBy("itemResponse.createdAt", "DESC")
            .getOne();
        return itemResponse
    }

    getById(id: number): Promise<TestApplication> {
        return this.testApplicationRepository.createQueryBuilder('test-application')
            .where({ id })
            .leftJoinAndSelect('test-application.test', 'test')
            .leftJoinAndSelect('test-application.participations', 'participation', `"participation"."deletedAt" is null`)
            .leftJoinAndSelect('participation.itemResponses', 'itemResponse', `"itemResponse"."deletedAt" is null`)
            .leftJoinAndSelect('itemResponse.testItem', 'testItem')
            .leftJoinAndSelect('itemResponse.score', 'score')
            .leftJoinAndSelect('testItem.item', 'item')
            .leftJoinAndSelect('participation.user', 'user')
            .orderBy("itemResponse.createdAt", "DESC")
            .orderBy("participation.createdAt", "DESC")
            .withDeleted()
            .getOne();
    }

    async generateCsvFromItemResponses(testApplicationId: number): Promise<string> {
        const testApplication = await this.getById(testApplicationId);
        const rows: any[] = []
        let responseProperties: string[] = []
        let userProperties: string[] = []
        let quizProperties: string[] = []
        const labels = [
            { label: 'data', value: 'data' },
            { label: 'usuario', value: 'usuario' },
            { label: 'participacao', value: 'participacao_id' },
            { label: 'observacoes', value: 'observacoes' },
            { label: 'item', value: 'item_id' },
            //{ label: 'resposta', value: 'resposta' },
        ]


        testApplication.participations.forEach((participation: Participation) => {
            if (participation.user.data) {
                userProperties = Object.keys(participation.user.data)
                userProperties.reverse().forEach(prop => {
                    if (!labels.some(l => l.label == prop)) {
                        labels.splice(1, 0, { label: prop, value: prop })
                    }
                });
            }

            if (participation.userDataToRequest) {
                quizProperties = participation.userDataToRequest.questions.map(q => q.name)
                quizProperties.reverse().forEach(prop => {
                    if (!labels.some(l => l.label == prop)) {
                        labels.splice(2, 0, { label: prop, value: prop })
                    }
                })
            }

        })

        testApplication.participations.map((participation: Participation) => {

            participation.itemResponses.forEach((itemResponse: ItemResponse) => {
                let row = {
                    data: itemResponse.createdAt.toLocaleString(),
                    usuario: participation.user.hash,
                    participacao_id: participation.id,
                    item_id: itemResponse.testItem.item.id,
                    //resposta: itemResponse.response,
                    observacoes: participation.observations,
                    escore_max: itemResponse.score.max,
                    escore_obtido: itemResponse.score.score,
                }
                let responseJson = JSON.parse(itemResponse.response);
                if (!responseProperties.length) {
                    responseProperties = Object.keys(responseJson)
                }
                userProperties.forEach((key: string) => {
                    row[key] = participation.user.data[key]
                })
                responseProperties.forEach((key: string) => {
                    row[key] = responseJson[key]
                })
                quizProperties.forEach((key: string) => {
                    if (participation.userDataToRequest) {
                        row[key] = participation.userDataToRequest.questions.find(q => q.name == key).answer
                    }
                })
                rows.push(row);
            })
        })

        responseProperties.forEach(prop => {
            labels.push({ label: prop, value: prop })
        });
        [
            { label: 'escore_max', value: 'escore_max' },
            { label: 'escore_obtido', value: 'escore_obtido' },
        ].forEach(item => labels.push(item))

        return buildCsv(labels, rows)
    }

    async getByHash(hash: string): Promise<TestApplication> {
        const testApplication = await this.testApplicationRepository
            .createQueryBuilder('test-application')
            .leftJoinAndSelect('test-application.test', 'test')
            .leftJoinAndSelect('test.researchGroup', 'researchGroup')
            .leftJoinAndSelect('test.items', 'testItem')
            .orderBy('testItem.order', 'ASC')
            .leftJoinAndSelect('testItem.item', 'item')
            .where({ hash })
            .getOne();
        return testApplication;
    }

    softDeleteById(id: number): Promise<DeleteResult> {
        return this.testApplicationRepository.softDelete({ id })
    }

    restore(id: number): Promise<UpdateResult> {
        return this.testApplicationRepository.restore({ id })
    }

    async paginate(pageRequest: PageRequest): Promise<PageResponse<TestApplication>> {
        let where = pageRequest.filter
        const searchLike = { search: `%${pageRequest.search.toString()}%` };
        let data = await this.testApplicationRepository.createQueryBuilder('test-application')
            .leftJoinAndSelect('test-application.test', 'test')
            .leftJoinAndSelect('test-application.participations', 'participation')
            .skip(pageRequest.start)
            .take(pageRequest.limit)
            .where(where)
            .andWhere(new Brackets(qb => {
                qb.where("test-application.name like :search", searchLike)
                    .orWhere("test.name like :search", searchLike)
            }))
            .andWhere('participation."deletedAt" is null')
            .andWhere(pageRequest.andWhere)
            .orderBy("test-application.id", "DESC")
            .getMany();
        return new PageResponse(data);
    }

    async getApplicationData(
        applicationHash: string,
        userHash: string,
    ): Promise<PreparedParticipation> {
        let user = new User();
        user.hash = userHash;
        if (userHash == '<user_uuid>') {
            userHash = uuidv4().substring(0, 7);
        }
        const participation = await this.participateInTheTest(applicationHash, user)
        const apiUrl = this.configService.get('API_URL');
        const siteUrl = this.configService.get('SITE_URL')
        const urlToSendResponses = `${apiUrl}/participations/public/respond/${participation.id}/<item_id>`
        const urlToSendProgress = `${apiUrl}/participations/public/save-progress`
        const urlToSendUserData = `${apiUrl}/participations/public/save-user/${userHash}`

        let responseClassDefinition = ''
        try {
            let testItem = participation.application.test.items[0]
            let mechanic: Mechanic = await this.testService.getMechanicFromTestItem(testItem);
            responseClassDefinition = mechanic.responseClassDefinition
        } catch (error) {
            console.error('Não foi possível obter a classe de resposta para mostrar como exemplo. ', error);
        }

        let preparedParticipation = {
            participationId: participation.id,
            lastVisitedItemId: participation.lastVisitedItemId,
            test: participation.test,
            urlToSendResponses: {
                method: 'POST',
                url: urlToSendResponses,
                help: `Envie as respostas em formato JSON e de acordo 
com a classe de respostas definida na mecânica de cada item.
O valor \"responseClass"\ mostra um exemplo de classe de resposta`,
                responseClass: responseClassDefinition
            },
            urlToSendProgress: {
                method: 'PUT',
                url: urlToSendProgress,
                help: `Ao acessar um item,
chame essa url enviando um JSON no formato { id: id_da_participacao, lastVisitedItemId: id_do_ultimo_item_visitado }. Exemplo:
curl -X PUT --header 'Content-Type: application/json' -d '{"id": ${participation.id}, "lastVisitedItemId": ${participation.lastVisitedItemId}}' ${urlToSendProgress}`
            },
            urlToSendUserData: {
                method: 'POST',
                url: urlToSendUserData,
                help: `Envie um JSON com as informações do usuário. Exemplo:
curl -X POST --header 'Content-Type: application/json' -d '{"nome": "João", "idade": 10}' ${urlToSendUserData}`
            },
            urlToEndOfTestQuiz: {
                url: `${siteUrl}/end-of-test-quiz/${participation.id}`
            }
        } as PreparedParticipation

        return preparedParticipation;
    }

    private async participateInTheTest(testApplicationHash: string, user: User): Promise<Participation> {

        if (!user.password)
            user.password = user.hash
        if (!user.name)
            user.name = user.hash
        if (!user.email)
            user.email = user.hash + '@mail.com'

        const testApplication: TestApplication = await this.getByHash(testApplicationHash);

        const savedUser = await this.usersService.saveOrGetByHash(user);
        if (!savedUser.researchGroup) {
            this.usersService.setResearchGroup(savedUser, testApplication.test.researchGroup);
        }

        let participation = await this.participationService.getNonFinishedParticipation(testApplication, savedUser);
        let testJson = await this.testService.generateJson(testApplication.test.id)
        if (!participation) {
            participation = new Participation();
        }
        participation.test = testJson
        participation.user = savedUser;
        participation.application = testApplication;
        participation = await this.participationService.save(participation);

        let itemsToPlay = []
        let items = testApplication.test.items;
        if (participation.lastVisitedItemId) {
            let lastVisitedItem = items.find(testItem => testItem.item.id === participation.lastVisitedItemId)
            let index = items.indexOf(lastVisitedItem)
            itemsToPlay = items.slice(index)
        }
        if (itemsToPlay.length) {
            testApplication.test.items = itemsToPlay
        }
        return participation;
    }
}
