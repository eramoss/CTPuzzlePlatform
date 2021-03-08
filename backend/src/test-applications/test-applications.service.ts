import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import Participation from 'src/participation/participation.entity';
import { ParticipationService } from 'src/participation/participation.service';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { DeleteResult, Repository } from 'typeorm';
import { TestApplication } from './test-application.entity';

@Injectable()
export class TestApplicationsService {

    constructor(
        @InjectRepository(TestApplication) private testApplicationRepository: Repository<TestApplication>,
        private usersService: UsersService,
        private participationService: ParticipationService
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
        let data = await this.testApplicationRepository.createQueryBuilder('test-application')
            .leftJoinAndSelect('test-application.test', 'test')
            .skip(pageRequest.start)
            .take(pageRequest.limit)
            .where(where)
            .getMany();
        return new PageResponse(data);
    }

    async participateInTheTest(testApplicationHash: string, user: User): Promise<Participation> {
        user.password = user.hash
        user.email = user.hash + '@mail.com'
        const testApplication: TestApplication = await this.getByHash(testApplicationHash);
        const savedUser = await this.usersService.saveOrGetByHash(user);

        let participation = await this.participationService.getNonFinishedParticipation(testApplication, savedUser);
        if (!participation) {
            participation = new Participation();
            participation.user = savedUser;
            participation.application = testApplication;
            participation = await this.participationService.save(participation);
        }
        participation.application = testApplication
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
