import { Module } from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { ParticipationController } from './participation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Participation from './participation.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Participation])],
    providers: [ParticipationService],
    controllers: [ParticipationController],
    exports: [ParticipationService]
})
export class ParticipationModule { }
