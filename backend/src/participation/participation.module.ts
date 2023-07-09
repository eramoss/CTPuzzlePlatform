import { Module } from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { ParticipationController } from './participation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Participation from './participation.entity';
import { TestItem } from 'src/tests/test-item.entity';
import { ItemResponse } from 'src/item-responses/item-response.entity';
import { ItemResponsesModule } from 'src/item-responses/item-responses.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participation, TestItem, ItemResponse]),
    ItemResponsesModule,
    UsersModule,
  ],
  providers: [ParticipationService],
  controllers: [ParticipationController],
  exports: [ParticipationService],
})
export class ParticipationModule {}
