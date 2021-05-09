import { Injectable } from '@nestjs/common';
import ScoreFunctionTestResult from 'score-function-test-result.dto';
import ScoreFunctionTestDto from 'score-function-test.dto';
import { CodeInterpreterService } from 'src/code-interpreter/code-interpreter.service';
import { Mechanic } from 'src/mechanics/mechanic.entity';
import { ItemTestCase } from './item-test-case.entity';
import { ResponseTestCase } from './response-test-case.entity';
import fs from 'fs'
import { TestItem } from 'src/tests/test-item.entity';
import { Item } from 'src/items/item.entity';
import { ItemResponse } from 'src/item-responses/item-response.entity';
import { Score } from 'src/item-responses/score.entity';

@Injectable()
export class ScoreFunctionTestService {

    constructor(private codeInterpreterService: CodeInterpreterService) { }

    async execute(scoreFunctionTestDto: ScoreFunctionTestDto): Promise<ScoreFunctionTestResult> {

        const item = `${scoreFunctionTestDto.mechanic.itemInstantiation}()`
        const response = `${scoreFunctionTestDto.mechanic.responseInstantiation}()`

        return this.calculateScore({
            mechanic: scoreFunctionTestDto.mechanic,
            item,
            response
        });
    }

    async runTestCases(mechanic: Mechanic): Promise<ItemTestCase[]> {
        return Promise.all(mechanic.itemTestCases.map(itemTestCase => {
            return this.fillTestCases(mechanic, itemTestCase)
        }))
    }

    async fillTestCases(mechanic: Mechanic, itemTestCase: ItemTestCase): Promise<ItemTestCase> {
        itemTestCase.responseTestCases =
            await Promise.all(itemTestCase.responseTestCases.map(async responseCase => {
                return this.calculateResponseTestCase(mechanic, itemTestCase, responseCase)
            }))
        return itemTestCase;
    }

    async calculateResponseTestCase(
        mechanic: Mechanic,
        itemTestCase: ItemTestCase,
        responseCase: ResponseTestCase): Promise<ResponseTestCase> {

        const result = await this.calculateScore({
            mechanic: mechanic,
            item: itemTestCase.itemInstantiation + '()',
            response: responseCase.responseInstantiation + '()'
        })
        responseCase.score = result.toScore()
        return responseCase
    }

    async calculateScores(args: {
        mechanic: Mechanic,
        itemResponse: ItemResponse,
        response: string
    }[]
    ): Promise<ItemResponse[]> {

        const code = args.map(arg => {
            let declareScoreFunction = this.createFunctionCalculateScore(arg.mechanic, 'calculateScore');
            const itemDefinition = arg.itemResponse.testItem.item.itemDefinition;
            return `{
    ${declareScoreFunction}
    let score = calculateScore((${itemDefinition})(),\n (${arg.response})())
    let scoreJson = JSON.stringify(score)
    console.log(scoreJson)    
    console.log('SPLIT_ITEM')
}`;
        }).join('\n');

        let output = await this.codeInterpreterService.execute(code)
        let scoreFunctionsLogs = output.split('SPLIT_ITEM')
        return scoreFunctionsLogs.map((log, index) => {
            let arg = args[index]
            if (arg) {
                const itemResponse = arg.itemResponse;
                const previousScore = itemResponse.score
                const newScore = new ScoreFunctionTestResult().setResponse(log).toScore()
                itemResponse.score = newScore;
                if (previousScore) {
                    itemResponse.score.id = previousScore.id
                }
                return itemResponse
            }
        }).filter(it => !!it)
    }

    async calculateScore(args: {
        mechanic: Mechanic,
        item: string,
        response: string
    }
    ): Promise<ScoreFunctionTestResult> {

        let codePreparation = this.createFunctionCalculateScore(args.mechanic, 'calculateScore');

        let response: string = await this.codeInterpreterService.execute(`
            // Preparação do código da função de escore
            ${codePreparation}
            
            // Execução da função de escore
            let score = calculateScore(${args.item}, ${args.response})
            let scoreJson = JSON.stringify(score)
            console.log(scoreJson)
        `);

        const testResult = new ScoreFunctionTestResult();
        testResult.response = response;
        return testResult;
    }

    createFunctionCalculateScore(mechanic: Mechanic, fnName: string): string {
        let classDefinition = mechanic.classDefinition;
        let responseClassDefinition = mechanic.responseClassDefinition;
        let scoreFunction = mechanic.scoreFunction;

        let code = `
    //Definição da classe
    ${classDefinition}

    //Função da resposta
    ${responseClassDefinition}

    //Função de cálculo
    let ${fnName} = ${scoreFunction}
`;
        return code;
    }
}
