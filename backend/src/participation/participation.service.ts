import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemResponse } from 'src/item-responses/item-response.entity';
import { ItemResponsesService } from 'src/item-responses/item-responses.service';
import { Score } from 'src/item-responses/score.entity';
import { TestApplication } from 'src/test-applications/test-application.entity';
import { TestItem } from 'src/tests/test-item.entity';
import { User } from 'src/users/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import Participation from './participation.entity';

@Injectable()
export class ParticipationService {


    constructor(
        @InjectRepository(Participation) private participationRepository: Repository<Participation>,
        @InjectRepository(TestItem) private testItemRepository: Repository<TestItem>,
        private itemResponseService: ItemResponsesService
    ) { }

    async saveProgress(participation: Participation) {
        let id = participation.id;
        let part = await this.participationRepository.findOne({ id })
        if (part) {
            part.lastVisitedItemId = participation.lastVisitedItemId
            this.participationRepository.update({ id }, part)
        }
    }

    async recalculateAllResponseItems(participationId: number): Promise<any> {
        let participation = await this.getById(participationId)
        await Promise.all(participation.itemResponses.map(async itemResponse => {
            let score = await this.itemResponseService.calculateScore(itemResponse);
            itemResponse.score = score;
        }))
        return this.participationRepository.save(participation);
    }

    getById(id: number): Promise<Participation> {
        return this.participationRepository
            .createQueryBuilder('participation')
            .leftJoinAndSelect('participation.application', 'application')
            .leftJoinAndSelect('application.test', 'test')
            .leftJoinAndSelect('participation.user', 'user')
            .leftJoinAndSelect('participation.itemResponses', 'itemResponse', `"itemResponse"."deletedAt" is null`)
            .orderBy('itemResponse.id', 'ASC')
            .leftJoinAndSelect('itemResponse.testItem', 'testItem')
            .leftJoinAndSelect('itemResponse.score', 'score')
            .leftJoinAndSelect('testItem.item', 'item')
            .where({ id })
            .getOne();
    }

    async saveResponse(participationId: number, itemId: number, response: any) {
        let testItem = await this.testItemRepository.createQueryBuilder('testItem')
            .leftJoinAndSelect('testItem.item', 'item')
            .where({ id: itemId })
            .getOne();
        let participation = await this.participationRepository.createQueryBuilder('participation')
            .leftJoinAndSelect('participation.itemResponses', 'itemResponse')
            .where({ id: participationId })
            .getOne();
        let itemResponse = new ItemResponse();
        itemResponse.testItem = testItem;
        itemResponse.response = JSON.stringify(response);
        itemResponse.score = await this.itemResponseService.calculateScore(itemResponse);
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
