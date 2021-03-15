import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemResponse } from 'src/item-responses/item-response.entity';
import { TestApplication } from 'src/test-applications/test-application.entity';
import { TestItem } from 'src/tests/test-item.entity';
import { User } from 'src/users/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import Participation from './participation.entity';

@Injectable()
export class ParticipationService {


    constructor(
        @InjectRepository(Participation) private participationRepository: Repository<Participation>,
        @InjectRepository(TestItem) private itemRepository: Repository<TestItem>
    ) { }

    async saveProgress(participation: Participation) {
        let id = participation.id;
        let part = await this.participationRepository.findOne({ id })
        if (part) {
            part.lastVisitedItemId = participation.lastVisitedItemId
            this.participationRepository.update({ id }, part)
        }
    }

    getById(id: number): Promise<Participation> {
        return this.participationRepository
            .createQueryBuilder('participation')
            .leftJoinAndSelect('participation.application', 'application')
            .leftJoinAndSelect('application.test', 'test')
            .leftJoinAndSelect('participation.user', 'user')
            .leftJoinAndSelect('participation.itemResponses', 'itemResponse')
            .leftJoinAndSelect('itemResponse.testItem', 'testItem')
            .leftJoinAndSelect('testItem.item', 'item')
            .where({ id })
            .getOne();
    }

    async saveResponse(participationId: number, itemId: number, response: any) {
        let item = await this.itemRepository.findOne({ id: itemId });
        let participation = await this.participationRepository.createQueryBuilder('participation')
            .leftJoinAndSelect('participation.itemResponses', 'itemResponse')
            .where({ id: participationId })
            .getOne();
        let itemResponse = new ItemResponse();
        itemResponse.testItem = item;
        itemResponse.response = response;
        participation.addResponse(itemResponse);
        this.participationRepository.save(participation);
    }

    save(participation: Participation): Promise<Participation> {
        return this.participationRepository.save(participation)
    }

    removeById(id: number): Promise<DeleteResult> {
        return this.participationRepository.delete({ id });
    }

    getNonFinishedParticipation(testApplication: TestApplication, user: User): Promise<Participation> {
        return this.participationRepository.createQueryBuilder('participation')
            .where({
                application: testApplication,
                user: user,
                finishedAt: null
            })
            .orderBy("participation.id", "DESC")
            .getOne()
    }
}
