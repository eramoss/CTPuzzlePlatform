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
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './databaseConfig'
import { ParticipationModule } from './participation/participation.module';
import { ItemResponsesModule } from './item-responses/item-responses.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRoot(databaseConfig),
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
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
