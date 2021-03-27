import { Module } from '@nestjs/common';
import { TestApplicationsService } from './test-applications.service';
import { TestApplicationsController } from './test-applications.controller';
import { TestApplication } from './test-application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from 'src/tests/test.entity';
import { UsersModule } from 'src/users/users.module';
import Participation from 'src/participation/participation.entity';
import { ParticipationModule } from 'src/participation/participation.module';
import { TestModule } from 'src/tests/tests.module';
import { Mechanic } from 'src/mechanics/mechanic.entity';
import { ItemResponse } from 'src/item-responses/item-response.entity';
import { ItemResponsesModule } from 'src/item-responses/item-responses.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([TestApplication, Test, Participation, Mechanic, ItemResponse]),
        UsersModule,
        ParticipationModule,
        TestModule,
        ItemResponsesModule,
    ],
    providers: [TestApplicationsService],
    controllers: [TestApplicationsController]
})
export class TestApplicationsModule { }
