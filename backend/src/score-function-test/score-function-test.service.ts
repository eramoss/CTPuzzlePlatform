import { Injectable } from '@nestjs/common';
import ScoreFunctionTestResult from 'score-function-test-result.dto';
import ScoreFunctionTestDto from 'score-function-test.dto';
import { CodeInterpreterService } from 'src/code-interpreter/code-interpreter.service';
import { Mechanic } from 'src/mechanics/mechanic.entity';

@Injectable()
export class ScoreFunctionTestService {

    constructor(private codeInterpreterService: CodeInterpreterService) {

    }

    async execute(scoreFunctionTestDto: ScoreFunctionTestDto): Promise<ScoreFunctionTestResult> {

        const item = `${scoreFunctionTestDto.mechanic.itemInstantiation}()`
        const response = `${scoreFunctionTestDto.mechanic.responseInstantiation}()`

        return this.calculateScore({
            mechanic: scoreFunctionTestDto.mechanic,
            item,
            response
        })
    }

    async calculateScore(args: {
        mechanic: Mechanic,
        item: string,
        response: string
    }): Promise<ScoreFunctionTestResult> {

        let classDefinition = args.mechanic.classDefinition;
        let responseClassDefinition = args.mechanic.responseClassDefinition;
        let scoreFunction = args.mechanic.scoreFunction;

        let code = `
        //Definição da classe
        ${classDefinition}

        //Função da resposta
        ${responseClassDefinition}

        //Função de cálculo
        let calculateScore = ${scoreFunction}

        console.log(JSON.stringify(calculateScore(${args.item}, ${args.response})))
        `
        let response: string = await this.codeInterpreterService.execute(code);
        const testResult = new ScoreFunctionTestResult();
        testResult.response = response;
        return testResult;
    }
}
