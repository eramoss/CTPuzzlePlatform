import { Injectable } from '@nestjs/common';
import { response } from 'express';
import ScoreFunctionTestResult from 'score-function-test-result.dto';
import scoreFunctionTestDto from 'score-function-test.dto';
import { CodeInterpreterService } from 'src/code-interpreter/code-interpreter.service';

@Injectable()
export class ScoreFunctionTestService {

    constructor(private codeInterpreterService: CodeInterpreterService) {

    }

    async execute(scoreFunctionTestDto: scoreFunctionTestDto): Promise<ScoreFunctionTestResult> {
        let code = `
        //Definição da classe
        ${scoreFunctionTestDto.mechanic.classDefinition}

        //Função da resposta
        ${scoreFunctionTestDto.mechanic.responseClassDefinition}

        //Função de cálculo
        ${scoreFunctionTestDto.mechanic.scoreFunction}

        const item = ${scoreFunctionTestDto.mechanic.itemInstantiation}()
        const resposta = ${scoreFunctionTestDto.mechanic.responseInstantiation}()

        console.log(calculaScore(item, resposta))

        `
        let response: string = await this.codeInterpreterService.execute(code);
        const testResult = new ScoreFunctionTestResult();
        testResult.response = response;
        return testResult;
    }
}
