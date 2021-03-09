import { Module } from '@nestjs/common';
import { TestService } from './tests.service';
import { TestController } from './tests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestItem } from './test-item.entity';
import { Test } from './test.entity';
import { ItemsService } from 'src/items/items.service';
import { ItemsModule } from 'src/items/items.module';

@Module({
    imports: [
        ItemsModule,
        TypeOrmModule.forFeature([Test, TestItem])
    ],
    providers: [TestService],
    controllers: [TestController]
})
export class TestModule { }
