import { Module } from '@nestjs/common';
import { MechanicsService } from './mechanics.service';
import { MechanicsController } from './mechanics.controller';
import { Mechanic } from './mechanic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from 'src/items/items.module';
import { ScoreFunctionTestModule } from 'src/score-function-test/score-function-test.module';
import { ItemTestCase } from 'src/score-function-test/item-test-case.entity';
import { ResponseTestCase } from 'src/score-function-test/response-test-case.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Mechanic, ItemTestCase, ResponseTestCase]),
        ItemsModule,
        ScoreFunctionTestModule,
    ],
    exports: [MechanicsService],
    providers: [MechanicsService],
    controllers: [MechanicsController]
})
export class MechanicsModule { }
