import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from 'src/items/items.module';
import { ScoreFunctionTestModule } from 'src/score-function-test/score-function-test.module';
import { ItemResponse } from './item-response.entity';
import { ItemResponsesController } from './item-responses.controller';
import { ItemResponsesService } from './item-responses.service';

@Module({
    controllers: [ItemResponsesController],
    imports: [
        ScoreFunctionTestModule,
        ItemsModule,
        TypeOrmModule.forFeature([ItemResponse])
    ],
    providers: [ItemResponsesService],
    exports: [ ItemResponsesService]
})
export class ItemResponsesModule { }
