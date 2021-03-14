import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import Participation from 'src/participation/participation.entity';
import { ParticipationService } from 'src/participation/participation.service';
import { TestService } from 'src/tests/tests.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Brackets, DeleteResult, Repository } from 'typeorm';
import { TestApplication } from './test-application.entity';
import { v4 as uuidv4 } from "uuid";
import { ConfigService } from '@nestjs/config';
import PreparedParticipation from 'src/participation/prepared-participation.dto';
import { Mechanic } from 'src/mechanics/mechanic.entity';

@Injectable()
export class TestApplicationsService {

    constructor(
        @InjectRepository(TestApplication)
        private testApplicationRepository: Repository<TestApplication>,
        private usersService: UsersService,
        private participationService: ParticipationService,
        private testService: TestService,
        private configService: ConfigService
    ) {
    }

    save(testApplication: TestApplication): Promise<TestApplication> {
        return this.testApplicationRepository.save(testApplication);
    }

    getById(id: number): Promise<TestApplication> {
        return this.testApplicationRepository.createQueryBuilder('test-application')
            .where({ id })
            .leftJoinAndSelect('test-application.test', 'test')
            .leftJoinAndSelect('test-application.participations', 'participation')
            .leftJoinAndSelect('participation.user', 'user')
            .leftJoinAndSelect('participation.itemResponses', 'itemResponse')
            .getOne();
    }

    async getByHash(hash: string): Promise<TestApplication> {
        const testApplication = await this.testApplicationRepository
            .createQueryBuilder('test-application')
            .leftJoinAndSelect('test-application.test', 'test')
            .leftJoinAndSelect('test.items', 'testItem')
            .leftJoinAndSelect('testItem.item', 'item')
            .where({ hash })
            .getOne();
        testApplication.test.sortItemsByOrder()
        return testApplication;
    }

    removeById(id: number): Promise<DeleteResult> {
        return this.testApplicationRepository.delete({ id })
    }

    async paginate(pageRequest: PageRequest): Promise<PageResponse<TestApplication>> {
        let where = pageRequest.filter
        const searchLike = { search: `%${pageRequest.search.toString()}%` };
        let data = await this.testApplicationRepository.createQueryBuilder('test-application')
            .leftJoinAndSelect('test-application.test', 'test')
            .skip(pageRequest.start)
            .take(pageRequest.limit)
            .where(where)
            .andWhere(new Brackets(qb => {
                qb.where("test-application.name like :search", searchLike)
                    .orWhere("test.name like :search", searchLike)
            }))
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
        const urlToSendResponses = `${apiUrl}/participations/public/respond/${participation.id}/<item_id>`
        const urlToSendProgress = `${apiUrl}/participations/public/save-progress`
        //const urlToSendUserData = `${apiUrl}/participations/public/save-progress`

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
                help: 'Envie as respostas em formato JSON e de acordo ' +
                    'com a classe de respostas definida na macânica de cada item.' +
                    'O valor \"responseClass"\ mostra um exemplo de classe de resposta',
                responseClass: responseClassDefinition
            },
            urlToSendProgress: {
                method: 'PUT',
                url: urlToSendProgress,
                help: "Ao acessar um item, chame essa url enviando um json no formato { id: id_da_participacao, lastVisitedItemId: id_do_ultimo_item_visitado } "
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
        participation.application.test.sortItemsByOrder();
        return participation;
    }
}
