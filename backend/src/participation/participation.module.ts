import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemResponse } from 'src/item-responses/item-response.entity';
import { ItemResponsesModule } from 'src/item-responses/item-responses.module';
import { ItemsModule } from 'src/items/items.module';
import { TestItem } from 'src/tests/test-item.entity';
import { Test } from 'src/tests/test.entity';
import { UsersModule } from 'src/users/users.module';
import { ParticipationController } from './participation.controller';
import Participation from './participation.entity';
import { ParticipationService } from './participation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participation, Test, TestItem, ItemResponse]),
    ItemResponsesModule,
    ItemsModule,
    UsersModule,
  ],
  providers: [ParticipationService],
  controllers: [ParticipationController],
  exports: [ParticipationService],
})
export class ParticipationModule {}
