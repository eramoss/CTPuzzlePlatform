import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import Participation from 'src/participation/participation.entity';
import { ParticipationService } from 'src/participation/participation.service';
import { TestService } from 'src/tests/tests.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Brackets, DeleteResult, Long, Repository, UpdateResult } from 'typeorm';
import { TestApplication } from './test-application.entity';
import { v4 as uuidv4 } from "uuid";
import { ConfigService } from '@nestjs/config';
import PreparedParticipation from 'src/participation/prepared-participation.dto';
import { Mechanic } from 'src/mechanics/mechanic.entity';
import { buildCsv, CsvColumnType, CsvData, CsvHeaderLabel } from 'src/util/download';
import { ItemResponse } from 'src/item-responses/item-response.entity';
import { TestItem } from 'src/tests/test-item.entity';
import { Item } from 'src/items/item.entity';
import { Test } from 'src/tests/test.entity';

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

    async recalculateAllApplicationParticipationScores(testApplicationId: number): Promise<ItemResponse[]> {
        let itemResponses = await this.getAllApplicationItemResponses(testApplicationId);
        return this.participationService.recalculateAllResponseEscores(itemResponses)
    }

    private async getAllApplicationItemResponses(testApplicationId: number) {
        const testApplication = await this.getById(testApplicationId);
        let itemResponses = new Array<ItemResponse>();
        testApplication.participations.forEach(p => {
            p.itemResponses.forEach(itemResponse => {
                itemResponses.push(itemResponse);
            });
        });
        return itemResponses;
    }

    findAll(): Promise<TestApplication[]> {
        return this.testApplicationRepository.createQueryBuilder('test-application')
            .orderBy('test-application.createdAt', 'DESC')
            .getMany()
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

    getPuplicApplicationsByMechanicName(name: string): Promise<TestApplication[]> {
        return this.testApplicationRepository.createQueryBuilder('test-application')
            .leftJoinAndSelect('test-application.test', 'test')
            .leftJoinAndSelect('test.items', 'testItem')
            .leftJoinAndSelect('testItem.item', 'item')
            .leftJoinAndSelect('item.mechanic', 'mechanic')
            .orderBy('test-application.createdAt', 'DESC')
            .where("test-application.visibility = 'PUBLIC'")
            .andWhere('upper(mechanic.name) like :name', { name: `%${name.toUpperCase()}%` })
            .getMany()
    }

    save(testApplication: TestApplication): Promise<TestApplication> {
        return this.testApplicationRepository.save(testApplication);
    }

    updateVisibility(testApplication: TestApplication): Promise<UpdateResult> {
        return this.testApplicationRepository.update({ id: testApplication.id }, {
            visibility: testApplication.visibility,
        });
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
            .leftJoinAndSelect('test-application.controlApplication', 'controlApplication')
            .innerJoinAndSelect('participation.itemResponses', 'itemResponse', `"itemResponse"."deletedAt" is null`)
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
        const { labels, rows } = await this.getCsvData(testApplicationId);
        return buildCsv(labels, rows)
    }

    async getCsvData(testApplicationId: number): Promise<CsvData> {
        const testApplication = await this.getById(testApplicationId);
        const rows: any[] = [];
        let responseKeys: string[] = [];
        let userKeys: string[] = [];
        let quizProperties: string[] = [];
        let scoreKeys: string[] = []
        const labels = [
            { label: 'data', value: 'data' },
            { label: 'usuario', value: 'usuario' },
            { label: 'fonte', value: 'fonte' },
            { label: 'participacao', value: 'participacao_id', },
            { label: 'observacoes', value: 'observacoes' },
            { label: 'item', value: 'item_id', },
            { label: 'order', value: 'item_order', },
            { label: 'tutorial', value: 'tutorial' },
        ] as CsvHeaderLabel[];

        testApplication.participations.forEach((participation: Participation) => {
            if (participation.user.data) {
                userKeys = Object.keys(participation.user.data);
                userKeys.reverse().forEach(key => {
                    if (!labels.some(l => l.label == key)) {
                        labels.splice(1, 0, { label: key, value: key });
                    }
                });
            }

            if (participation.userDataToRequest) {
                let quizKeys = participation.userDataToRequest.questions.map(q => q.name);
                quizKeys.reverse().forEach(key => {
                    if (!labels.some(l => l.label == key)) {
                        labels.splice(2, 0, { label: key, value: key });
                    }
                });
                if (quizKeys.length > quizProperties.length) {
                    quizProperties = quizKeys
                }
            }

        });

        testApplication.participations.map((participation: Participation) => {

            participation.itemResponses.forEach((itemResponse: ItemResponse) => {
                let row = {
                    data: itemResponse.createdAt.toLocaleString(),
                    usuario: participation.user.hash,
                    fonte: participation.source,
                    participacao_id: participation.id,
                    item_id: itemResponse.testItem.item.id,
                    item_order: itemResponse.testItem.order,
                    tutorial: itemResponse.testItem.item.isTutorial ? 'T' : 'F',
                    //resposta: itemResponse.response,
                    observacoes: participation.observations,
                    escore_max: itemResponse.score.max,
                    escore_obtido: itemResponse.score.score,
                };
                let responseJson = JSON.parse(itemResponse.response);
                let scoreJson = JSON.parse(itemResponse.score.json)
                if (!responseKeys.length) {
                    responseKeys = Object.keys(responseJson);
                }
                if (!scoreKeys.length) {
                    scoreKeys = Object.keys(scoreJson)
                }
                userKeys.forEach((key: string) => {
                    row[key] = participation.user.data[key];
                });
                responseKeys.forEach((key: string) => {
                    row[key] = responseJson[key];
                });
                scoreKeys.forEach((key: string) => {
                    row[key] = scoreJson[key];
                });
                quizProperties.forEach((key: string) => {
                    if (participation.userDataToRequest) {
                        row[key] = participation.userDataToRequest.questions.find(q => q.name == key)?.answer;
                    }
                });

                rows.push(row);
            });
        });

        responseKeys.forEach(prop => {
            labels.push({ label: prop, value: prop });
        });
        scoreKeys.forEach(prop => {
            labels.push({ label: prop, value: prop });
        });
        [
            { label: 'escore_max', value: 'escore_max' },
            { label: 'escore_obtido', value: 'escore_obtido' },
        ].forEach(item => labels.push(item));

        ///^\d*([,.]){0,1}\d+$/.test('12,12')
        let regexMatchNumbers = /^\d*[,.]?\d+$/
        labels.forEach(label => {
            let type: CsvColumnType = "number"
            let rowIndex = 0
            let reachedEnd = false

            looping_to_check_if_data_rows_are_numbers:
            while (type == "number" && !reachedEnd) {
                let row = rows[rowIndex]
                if (row == undefined) {
                    reachedEnd = true
                    continue looping_to_check_if_data_rows_are_numbers
                }
                if (row != undefined) {
                    let cellValue = row[label.value]
                    let match = regexMatchNumbers.test(cellValue)
                    if (match) {
                        rowIndex++
                        continue looping_to_check_if_data_rows_are_numbers
                    }
                    type = "string"
                }
            }
            label.type = type
        })

        let csvData = new CsvData()
        csvData.labels = labels
        csvData.rows = rows
        return csvData
    }

    async getByHash(hash: string): Promise<TestApplication> {
        const testApplication = await this.testApplicationRepository
            .createQueryBuilder('test-application')
            .leftJoinAndSelect('test-application.test', 'test')
            .leftJoinAndSelect('test-application.controlApplication', 'controlApplication')
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
        const searchLike = { search: `%${pageRequest.search.toString().toUpperCase()}%` };
        let data = await this.testApplicationRepository.createQueryBuilder('test-application')
            .leftJoinAndSelect('test-application.test', 'test')
            .leftJoinAndSelect('test-application.controlApplication', 'controlApplication')
            .skip(pageRequest.start)
            .take(pageRequest.limit)
            .where(where)
            .andWhere(new Brackets(qb => {
                qb.where("upper(test-application.name) like :search", searchLike)
                    .orWhere("upper(test.name) like :search", searchLike)
            }))
            .andWhere(pageRequest.andWhere)
            .orderBy("test-application.id", "DESC")
            .getMany();
        await Promise.all(data.map(async (application) => {
            const count = await this.participationService.countByTestApplication(application);
            application.countParticipations = count
        }))
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
            console.warn('The puzzle forgot to replace the user token with a random unique id value!!')
        }

        const participation = await this.participateInTheTest(applicationHash, user)
        const apiUrl = this.configService.get('API_URL');
        const siteUrl = this.configService.get('SITE_URL')
        const urlToSendResponses = `${apiUrl}/participations/public/respond/${participation.id}/<item_id>`
        const urlToSendProgress = `${apiUrl}/participations/public/save-progress`
        const urlToSendSource = `${apiUrl}/participations/public/save-source/${participation.id}`
        const urlToSendUserData = `${apiUrl}/participations/public/save-user/${userHash}`

        let responseClassDefinition = ''
        try {
            let testItem = participation.application.test.items[0]
            let mechanic: Mechanic = await this.testService.getMechanicFromTestItem(testItem);
            responseClassDefinition = mechanic.responseClassDefinition
        } catch (error) {
            console.error('Não foi possível obter a classe de resposta para mostrar como exemplo. ', error);
        }

        let lastVisitedItemId = participation.lastVisitedItemId;

        if (participation.lastVisitedItemWasFinished) {
            let nextItem = this.getUndoneItem(participation);
            if (nextItem) {
                lastVisitedItemId = nextItem.id;
            }
            if (!nextItem) {
                lastVisitedItemId = -1;
            }
        }

        let preparedParticipation = {
            participationId: participation.id,
            lastVisitedItemId: lastVisitedItemId,
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
            urlToSendSource: {
                method: 'PUT',
                url: urlToSendSource,
                help: `Envie uma string com a informação de onde o usuário veio. Exemplo (document.referrer)
            curl -X PUT --header 'Content-Type: application/json' -d '{"testApplication": ${participation.id}, "source": "facebook"}' ${urlToSendSource}`
            },
            urlToEndOfTestQuiz: {
                url: `${siteUrl}/quiz/${participation.id}`
            }
        } as PreparedParticipation

        return preparedParticipation;
    }

    getUndoneItem(participation: Participation): TestItem {
        const test = Object.assign(new Test(), participation.test)
        const itemWithResponsesIds = participation.itemResponses.map(itemResponse => itemResponse.testItem.id);
        const itemsWithoutResponses = test.items.filter(testItem => itemWithResponsesIds.indexOf(testItem.id) == -1);
        const nextItem = itemsWithoutResponses[0]
        return nextItem
    }

    async participateInTheTest(testApplicationHash: string, user: User): Promise<Participation> {

        if (!user.password)
            user.password = user.hash
        if (!user.name)
            user.name = user.hash
        if (!user.email)
            user.email = user.hash + '@mail.com'

        let testApplication: TestApplication = await this.getByHash(testApplicationHash);
        let controlGroupApplication = testApplication.controlApplication
        if (controlGroupApplication) {
            controlGroupApplication = await this.getByHash(controlGroupApplication.hash)
        }

        const savedUser = await this.usersService.saveOrGetByHash(user);
        if (!savedUser.researchGroup) {
            this.usersService.setResearchGroup(savedUser, testApplication.test.researchGroup);
        }

        let participation = await this.participationService.getNonFinishedParticipation(testApplication, controlGroupApplication, savedUser);
        if (!participation) {
            participation = new Participation();
            if (controlGroupApplication) {
                if (Math.random() > 0.5) {
                    participation.usesControlGroup = true
                }
            }
        }

        if (participation.usesControlGroup) {
            testApplication = controlGroupApplication
        }

        let testJson = await this.testService.generateJson(testApplication.test.id)
        participation.test = testJson
        participation.user = savedUser;
        participation.application = testApplication;
        participation = await this.participationService.save(participation);

        let itemsToPlay = []
        let items = testApplication.test.items;
        if (participation.lastVisitedItemId) {
            let lastVisitedItem = items.find(testItem => testItem.id === participation.lastVisitedItemId)
            let index = items.indexOf(lastVisitedItem)
            itemsToPlay = items.slice(index)
        }
        if (itemsToPlay.length) {
            testApplication.test.items = itemsToPlay
        }
        return participation;
    }
}
