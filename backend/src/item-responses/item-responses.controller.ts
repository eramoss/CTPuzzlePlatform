import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import ScoreFunctionTestResult from 'score-function-test-result.dto';
import { ItemsService } from 'src/items/items.service';
import { ScoreFunctionTestService } from 'src/score-function-test/score-function-test.service';
import { ItemResponse } from './item-response.entity';
import { ItemResponsesService } from './item-responses.service';
import { Score } from './score.entity';

@Controller('item-responses')
export class ItemResponsesController {

    constructor(private itemResponseService: ItemResponsesService) { }

    @Post('calculateScoreFromItem')
    async calculateScoreFromItem(@Body() itemResponse: ItemResponse): Promise<Score> {
        return this.itemResponseService.calculateScoreFromItem(itemResponse)
    }

}
