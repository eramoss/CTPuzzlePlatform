import { Injectable } from '@nestjs/common';
import { ItemsService } from 'src/items/items.service';
import { ScoreFunctionTestService } from 'src/score-function-test/score-function-test.service';
import { ItemResponse } from './item-response.entity';
import { Score } from './score.entity';

@Injectable()
export class ItemResponsesService {

    constructor(
        private scoreFnService: ScoreFunctionTestService,
        private itemsService: ItemsService) {
    }

    async calculateScoreFromItem(itemResponse: ItemResponse): Promise<Score> {
        let item = await this.itemsService.getById(itemResponse.testItem.item.id);
        let mechanic = item.mechanic
        let scoreFnTestResult = await this.scoreFnService.calculateScore({
            mechanic,
            item: `${item.itemDefinition}()`,
            response: itemResponse.response,
        })
        let score = JSON.parse(scoreFnTestResult.response) as Score
        itemResponse.score = score
        return score
    }
}
