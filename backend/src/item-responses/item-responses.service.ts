import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeInterpreterService } from 'src/code-interpreter/code-interpreter.service';
import { ItemsService } from 'src/items/items.service';
import { Mechanic } from 'src/mechanics/mechanic.entity';
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
        private codeInterpreterService: CodeInterpreterService,
        private itemsService: ItemsService) {
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
        let score: Score;
        let text = ""

        try {

            let item = await this.itemsService.getById(itemResponse.testItem.item.id);
            let mechanic = item.mechanic
            let classThatCouldBeInstantiated = await this.getFunctionToInstantiateJsonResponse(mechanic, itemResponse);

            let scoreFunctionResult = await this.scoreFnService.calculateScore({
                mechanic,
                item: `${item.itemDefinition}()`,
                response: `${classThatCouldBeInstantiated}()`,
            })
            score = scoreFunctionResult.toScore()
        } catch (e) {
            score.max = -1
            score.score = -1
        }
        return score
    }

    async getFunctionToInstantiateJsonResponse(mechanic: Mechanic, itemResponse: ItemResponse): Promise<string> {
        let classThatCouldBeInstantiated = ""
        const classesNames: string[] = mechanic.getDeclaredClassesNames();
        await Promise.all(classesNames.map(async responseClass => {
            let fnAssignJsonToClass =
                `function(){
                        return Object.assign(new ${responseClass}(), ${itemResponse.response})
                    }`;
            let isValidCode = await this.codeInterpreterService.isExecutable(
                `${mechanic.responseClassDefinition}
                        console.log(${fnAssignJsonToClass}())
                    `);
            if (isValidCode) {
                classThatCouldBeInstantiated = fnAssignJsonToClass;
            }
        }))
        return classThatCouldBeInstantiated;
    }
}
