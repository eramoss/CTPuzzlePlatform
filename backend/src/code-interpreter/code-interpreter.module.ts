import { Module } from '@nestjs/common';
import { CodeInterpreterService } from './code-interpreter.service';

@Module({
    exports: [CodeInterpreterService],
    providers: [CodeInterpreterService]
})
export class CodeInterpreterModule { }
