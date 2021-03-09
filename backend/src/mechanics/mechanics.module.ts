import { Module } from '@nestjs/common';
import { MechanicsService } from './mechanics.service';
import { MechanicsController } from './mechanics.controller';
import { Mechanic } from './mechanic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([Mechanic])
    ],
    exports: [MechanicsService],
    providers: [MechanicsService],
    controllers: [MechanicsController]
})
export class MechanicsModule { }
