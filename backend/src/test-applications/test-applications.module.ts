import { Module } from '@nestjs/common';
import { TestApplicationsService } from './test-applications.service';
import { TestApplicationsController } from './test-applications.controller';
import { TestApplication } from './test-application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from 'src/tests/test.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TestApplication, Test])],
    providers: [TestApplicationsService],
    controllers: [TestApplicationsController]
})
export class TestApplicationsModule { }
