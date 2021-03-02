import { Body, Controller, Get, Post } from '@nestjs/common';
import ScoreFunctionTestResult from 'score-function-test-result.dto';
import ScoreFunctionTestDto from 'score-function-test.dto';
import { ScoreFunctionTestService } from './score-function-test.service';

@Controller('score-function-test')
export class ScoreFunctionTestController {

    constructor(private scoreFunctionTestService: ScoreFunctionTestService) {
    }

    @Post('execute')
    execute(@Body() scoreFunctionTestDto: ScoreFunctionTestDto): Promise<ScoreFunctionTestResult> {
        return this.scoreFunctionTestService.execute(scoreFunctionTestDto);
    }

}
