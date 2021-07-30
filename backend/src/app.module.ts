import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';

import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MechanicsModule } from './mechanics/mechanics.module';
import { PaginationModule } from './pagination/pagination.module';
import { ItemsModule } from './items/items.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { TestModule } from './tests/tests.module';
import { TestApplicationsModule } from './test-applications/test-applications.module';
import { ScoreFunctionTestModule } from './score-function-test/score-function-test.module';
import { CodeInterpreterModule } from './code-interpreter/code-interpreter.module';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { databaseConfig } from './databaseConfig'
import { ParticipationModule } from './participation/participation.module';
import { ItemResponsesModule } from './item-responses/item-responses.module';
import { ResearchGroupModule } from './research-group/research-group.module';
import { RModule } from './r/r.module';
import { AppConfigModule } from './app-config/app-config.module';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRoot(databaseConfig),
        AppConfigModule,
        UsersModule,
        AuthModule,
        MechanicsModule,
        PaginationModule,
        ItemsModule,
        FileUploadModule,
        TestModule,
        TestApplicationsModule,
        ScoreFunctionTestModule,
        CodeInterpreterModule,
        ParticipationModule,
        ItemResponsesModule,
        ResearchGroupModule,
        RModule,
    ],
})
export class AppModule { }
