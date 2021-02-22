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

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forRoot(),
    MechanicsModule,
    PaginationModule,
    ItemsModule,
    FileUploadModule,
    TestModule,
    TestApplicationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
