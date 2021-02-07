import { Module } from '@nestjs/common';
import { TestItemsService } from './test-items.service';
import { TestItemsController } from './test-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestItem } from './test-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestItem])],
  providers: [TestItemsService],
  controllers: [TestItemsController]
})
export class TestItemsModule { }
