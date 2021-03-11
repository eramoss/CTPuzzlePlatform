import { Module } from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { ParticipationController } from './participation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Participation from './participation.entity';
import { TestItem } from 'src/tests/test-item.entity';
import { ItemResponse } from 'src/item-responses/item-response.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Participation, TestItem, ItemResponse])],
    providers: [ParticipationService],
    controllers: [ParticipationController],
    exports: [ParticipationService]
})
export class ParticipationModule { }
