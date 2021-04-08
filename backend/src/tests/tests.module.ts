import { Module } from '@nestjs/common';
import { TestService } from './tests.service';
import { TestController } from './tests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestItem } from './test-item.entity';
import { Test } from './test.entity';
import { ItemsModule } from 'src/items/items.module';
import { ItemResponsesModule } from 'src/item-responses/item-responses.module';

@Module({
    imports: [
        ItemResponsesModule,
        ItemsModule,
        TypeOrmModule.forFeature([Test, TestItem])
    ],
    exports: [TestService],
    providers: [TestService],
    controllers: [TestController]
})
export class TestModule { }
