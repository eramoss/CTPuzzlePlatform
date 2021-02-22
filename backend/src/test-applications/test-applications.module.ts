import { Module } from '@nestjs/common';
import { TestApplicationsService } from './test-applications.service';
import { TestApplicationsController } from './test-applications.controller';

@Module({
  providers: [TestApplicationsService],
  controllers: [TestApplicationsController]
})
export class TestApplicationsModule {}
