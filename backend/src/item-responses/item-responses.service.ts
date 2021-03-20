import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemsService } from 'src/items/items.service';
import { ParticipationService } from 'src/participation/participation.service';
import { ScoreFunctionTestService } from 'src/score-function-test/score-function-test.service';
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

    async calculateScoreAndSave(itemResponse: ItemResponse): Promise<Score> {
        itemResponse.score = await this.calculateScore(itemResponse)
        this.itemResponseRepository.save(itemResponse);
        return itemResponse.score
    }

    
    removeById(itemResponseId: number):Promise<any> {
        return this.itemResponseRepository.softDelete({id:itemResponseId})
    }

    async calculateScore(itemResponse: ItemResponse): Promise<Score> {
        let score: Score;
        let text = ""

        try {

            let item = await this.itemsService.getById(itemResponse.testItem.item.id);
            let mechanic = item.mechanic

            const responseClassName = mechanic.getResponseClassName();
            const createResponseFromJson = `function(){
                return Object.assign(new ${responseClassName}(), ${itemResponse.response})
            }`;

            let scoreFunctionResult = await this.scoreFnService.calculateScore({
                mechanic,
                item: `${item.itemDefinition}()`,
                response: `${createResponseFromJson}()`,
            })
            text = scoreFunctionResult.response
            score = JSON.parse(scoreFunctionResult.response) as Score
        } catch (e) {
            score = new Score();
            score.max = -1
            score.score = -1
            score.message = text;
        }
        return score
    }
}
