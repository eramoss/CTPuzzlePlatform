import { Module } from '@nestjs/common';
import { RService } from './r.service';
import { RController } from './r.controller';

@Module({
    providers: [RService],
    controllers: [RController]
})
export class RModule { }
