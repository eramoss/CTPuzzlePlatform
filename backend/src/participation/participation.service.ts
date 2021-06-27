import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemResponse } from 'src/item-responses/item-response.entity';
import { ItemResponsesService } from 'src/item-responses/item-responses.service';
import { Score } from 'src/item-responses/score.entity';
import { TestApplication } from 'src/test-applications/test-application.entity';
import { TestItem } from 'src/tests/test-item.entity';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import Participation from './participation.entity';

@Injectable()
export class ParticipationService {


    constructor(
        @InjectRepository(Participation) private participationRepository: Repository<Participation>,
        @InjectRepository(TestItem) private testItemRepository: Repository<TestItem>,
        private itemResponseService: ItemResponsesService,
        private userService: UsersService,
    ) { }

    async countParticipations(groupId: number): Promise<number> {
        let count = await this.participationRepository
            .createQueryBuilder('participation')
            .innerJoin('participation.itemResponses', 'itemResponse')
            .leftJoinAndSelect("participation.application", 'application')
            .leftJoinAndSelect("application.test", 'test')
            .leftJoinAndSelect("test.researchGroup", 'researchGroup')
            .where('researchGroup.id = :id', { id: groupId })
            .getCount()
        return count;
    }

    async saveSource(participationId: number, source: string): Promise<UpdateResult> {
        return this.participationRepository.update({ id: participationId }, { source })
    }

    saveUserData(userHash: string, user: any): Promise<any> {
        return this.userService.saveData(userHash, user)
    }

    async countByTestApplication(application: TestApplication): Promise<number> {
        return this.participationRepository.createQueryBuilder("participation")
        .innerJoin('participation.itemResponses', 'itemResponse')
        .where("participation.application = :application", {application:application.id})
        .getCount()
    }

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

    async recalculateAllResponseEscores(itemResponses: ItemResponse[]): Promise<ItemResponse[]> {
        this.itemResponseService.calculateScores(itemResponses)
        return itemResponses;
    }

    getById(id: number): Promise<Participation> {
        return this.participationRepository
            .createQueryBuilder('participation')
            .leftJoinAndSelect('participation.application', 'application')
            .leftJoinAndSelect('application.test', 'test')
            .leftJoinAndSelect('participation.user', 'user')
            .innerJoinAndSelect('participation.itemResponses', 'itemResponse')
            .orderBy('itemResponse.createdAt', 'DESC')
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
            .leftJoinAndSelect('itemResponse.testItem', 'testItem')
            .where({ id: participationId })
            .getOne();


        let itemResponse = participation.itemResponses.find(itemResponse => itemResponse.testItem.id == testItem.id)
        if (!itemResponse) {
            itemResponse = new ItemResponse()
            participation.addResponse(itemResponse);
        }

        itemResponse.testItem = testItem;
        itemResponse.response = JSON.stringify(response);
        itemResponse.score = await this.itemResponseService.calculateScore(itemResponse);
        //participation.lastVisitedItemWasFinished = true;
        this.participationRepository.save(participation);
    }

    save(participation: Participation): Promise<Participation> {
        return this.participationRepository.save(participation)
    }

    softDeleteById(id: number): Promise<DeleteResult> {
        return this.participationRepository.softDelete({ id });
    }

    restore(id: number): Promise<any> {
        return this.participationRepository.restore({ id });
    }

    getNonFinishedParticipation(testApplication: TestApplication, controlGroupApplication: TestApplication, user: User): Promise<Participation> {
        let ids = [testApplication.id, controlGroupApplication?.id]
        return this.participationRepository
            .createQueryBuilder('participation')
            .leftJoinAndSelect('participation.itemResponses', 'itemResponse')
            .leftJoinAndSelect('itemResponse.testItem', 'testItem')
            .where({
                application: { id: In(ids) },
                user: user,
                finishedAt: null
            })
            .orderBy("participation.id", "DESC")
            .getOne()
    }
}
