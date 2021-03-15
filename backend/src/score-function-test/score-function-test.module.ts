import { Module } from '@nestjs/common';
import { CodeInterpreterModule } from 'src/code-interpreter/code-interpreter.module';
import { CodeInterpreterService } from 'src/code-interpreter/code-interpreter.service';
import { ScoreFunctionTestController } from './score-function-test.controller';
import { ScoreFunctionTestService } from './score-function-test.service';

@Module({
    exports: [ScoreFunctionTestService],
    imports: [CodeInterpreterModule],
    controllers: [ScoreFunctionTestController],
    providers: [ScoreFunctionTestService]
})
export class ScoreFunctionTestModule { }
