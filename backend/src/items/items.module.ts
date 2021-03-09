import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { CodeInterpreterModule } from 'src/code-interpreter/code-interpreter.module';

@Module({
    imports: [TypeOrmModule.forFeature([Item]), CodeInterpreterModule],
    exports: [ItemsService],
    providers: [ItemsService],
    controllers: [ItemsController]
})
export class ItemsModule { }
