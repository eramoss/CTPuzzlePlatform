import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ItemResponse } from './item-response.entity';
import { ItemResponsesService } from './item-responses.service';
import { Score } from './score.entity';

@Controller('item-responses')
export class ItemResponsesController {

    constructor(private itemResponseService: ItemResponsesService) { }

    @Post('calculateScoreFromItem')
    async calculateScoreFromItem(@Body() itemResponse: ItemResponse): Promise<Score> {
        return this.itemResponseService.calculateScoreAndSave(itemResponse)
    }

    

}
