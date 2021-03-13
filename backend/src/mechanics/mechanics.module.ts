import { Module } from '@nestjs/common';
import { MechanicsService } from './mechanics.service';
import { MechanicsController } from './mechanics.controller';
import { Mechanic } from './mechanic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from 'src/items/items.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Mechanic]),
        ItemsModule,
    ],
    exports: [MechanicsService],
    providers: [MechanicsService],
    controllers: [MechanicsController]
})
export class MechanicsModule { }
