import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';

import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { GeneratorModule } from './generators/generators.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
