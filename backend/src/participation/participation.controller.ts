import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
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

    @Get('byId/:id')
    getById(@Param('id') id: number): Promise<Participation> {
        return this.service.getById(id);
    }

    @Get('recalculateAllResponseItems/:participationId')
    recalculateAll(@Param('participationId') participationId: number): Promise<any> {
        return this.service.recalculateAllResponseItems(participationId)
    }

    @Delete('remove/:id')
    removeParticipation(@Param('id') id: number): Promise<DeleteResult> {
        return this.service.removeById(id);
    }

    @Post('public/respond/:participationId/:itemId')
    saveResponse(@Param('participationId') participationId: number, @Param('itemId') itemId: number, @Body() response: any) {
        return this.service.saveResponse(participationId, itemId, response);
    }

}
