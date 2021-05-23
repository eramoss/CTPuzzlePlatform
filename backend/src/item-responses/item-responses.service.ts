import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemsService } from 'src/items/items.service';
import { Mechanic } from 'src/mechanics/mechanic.entity';
import { ScoreFunctionTestService } from 'src/score-function-test/score-function-test.service';
import { TestItem } from 'src/tests/test-item.entity';
import { Repository } from 'typeorm';
import { ItemResponse } from './item-response.entity';
import { Score } from './score.entity';

@Injectable()
export class ItemResponsesService {

    constructor(
        @InjectRepository(ItemResponse)
        private itemResponseRepository: Repository<ItemResponse>,
        private scoreFnService: ScoreFunctionTestService,
        private itemsService: ItemsService) {
    }

    async countByItem(item: TestItem): Promise<number> {
        let count = await this.itemResponseRepository
            .createQueryBuilder(`itemResponse`)
            .where({ testItem: item })
            .getCount()
        return count;
    }

    async getTotal(researchGroupId: number): Promise<number> {
        let count = await this.itemResponseRepository
            .createQueryBuilder('item-response')
            .leftJoinAndSelect("item-response.participation", 'participation')
            .leftJoinAndSelect("participation.application", 'application')
            .leftJoinAndSelect("application.test", 'test')
            .leftJoinAndSelect("test.researchGroup", 'researchGroup')
            .where('researchGroup.id = :id', { id: researchGroupId })
            .andWhere('participation."deletedAt" is null')
            .getCount()
        return count;
    }

    async getAvgScorePercent(researchGroupId: number): Promise<number> {
        let itemResponses = await this.itemResponseRepository
            .createQueryBuilder('item-response')
            .leftJoinAndSelect("item-response.participation", 'participation')
            .leftJoinAndSelect("participation.application", 'application')
            .leftJoinAndSelect("application.test", 'test')
            .leftJoinAndSelect('item-response.score', 'score')
            .leftJoinAndSelect("test.researchGroup", 'researchGroup')
            .where('researchGroup.id = :id', { id: researchGroupId })
            .andWhere('participation."deletedAt" is null')
            .getMany()
        let totalScore = itemResponses.map(itemResponse => itemResponse.score.score)
            .reduce((left, right) => left + right)
        let totalMax = itemResponses.map(itemResponse => itemResponse.score.max)
            .reduce((left, right) => left + right)
        return Math.ceil((totalScore / totalMax) * 100);
    }

    async calculateScoreAndSave(itemResponse: ItemResponse): Promise<Score> {
        itemResponse.score = await this.calculateScore(itemResponse)
        this.itemResponseRepository.save(itemResponse);
        return itemResponse.score
    }

    softDelete(itemResponseId: number): Promise<any> {
        return this.itemResponseRepository.softDelete({ id: itemResponseId })
    }

    restore(itemResponseId: number): Promise<any> {
        return this.itemResponseRepository.restore({ id: itemResponseId })
    }

    async calculateScore(itemResponse: ItemResponse): Promise<Score> {
        let score: Score = new Score();
        try {

            let item = await this.itemsService.getById(itemResponse.testItem.item.id);
            let mechanic = item.mechanic
            let fnInstantiateResponse = this.getFunctionToInstantiateJsonResponse(mechanic, itemResponse);
            if (fnInstantiateResponse) {
                let scoreFunctionResult = await this.scoreFnService.calculateScore({
                    mechanic,
                    item: `${item.itemDefinition}()`,
                    response: `${fnInstantiateResponse}()`,
                })
                score = scoreFunctionResult.toScore()
            }
        } catch (e) {
            score.max = -1
            score.score = -1
        }
        return score
    }

    async calculateScores(itemResponses: ItemResponse[]) {
        let items = await Promise.all(itemResponses.map(async itemResponse => {
            let item = await this.itemsService.getById(itemResponse.testItem.item.id)
            return {
                mechanic: item.mechanic,
                itemResponse: itemResponse,
                response: this.getFunctionToInstantiateJsonResponse(item.mechanic, itemResponse)
            }
        }))

        let itemResponsesWithCalculatedScores = await this.scoreFnService.calculateScores(items)
        this.itemResponseRepository.save(itemResponsesWithCalculatedScores)
    }

    getFunctionToInstantiateJsonResponse(mechanic: Mechanic, itemResponse: ItemResponse): string {
        let responseClassName = mechanic.getDeclaredClassesNames().filter(className => className.startsWith('R'))[0];
        return `function(){
            return Object.assign(new ${responseClassName}(), ${itemResponse.response})
        }`
    }
}
