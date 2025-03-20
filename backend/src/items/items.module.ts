import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeInterpreterModule } from 'src/code-interpreter/code-interpreter.module';
import { Item } from './item.entity';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), CodeInterpreterModule],
  exports: [ItemsService],
  providers: [ItemsService],
  controllers: [ItemsController],
})
export class ItemsModule {}
