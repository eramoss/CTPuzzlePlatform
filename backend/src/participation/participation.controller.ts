import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DeleteResult } from 'typeorm';
import Participation from './participation.entity';
import { ParticipationService } from './participation.service';

@Controller('participations')
@UseGuards(JwtAuthGuard)
export class ParticipationController {

    constructor(private service: ParticipationService) {
    }

    @Put('public/save-progress')
    saveCurrentItem(@Body() participation: Participation) {
        this.service.saveProgress(participation)
    }

    @Delete('/remove/:id')
    removeParticipation(@Param('id') id: number): Promise<DeleteResult> {
        return this.service.removeById(id);
    }

}
