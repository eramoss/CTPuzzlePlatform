import { Module } from '@nestjs/common';
import { ItemsModule } from 'src/items/items.module';
import { ItemsService } from 'src/items/items.service';
import { ScoreFunctionTestModule } from 'src/score-function-test/score-function-test.module';
import { ItemResponsesController } from './item-responses.controller';
import { ItemResponsesService } from './item-responses.service';

@Module({
    controllers: [ItemResponsesController],
    imports: [ScoreFunctionTestModule, ItemsModule],
    providers: [ItemResponsesService]
})
export class ItemResponsesModule { }
