import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DeleteResult } from 'typeorm';
import ParticipationCount from './participation.count.dto';
import Participation from './participation.entity';
import { ParticipationService } from './participation.service';

@Controller('participations')
@UseGuards(JwtAuthGuard)
export class ParticipationController {
  constructor(private service: ParticipationService) {}

  @Put('public/save-progress')
  saveCurrentItem(@Body() participation: Participation) {
    this.service.saveProgress(participation);
  }

  @Put('public/save-source/:participationId/')
  saveParticipationSource(
    @Body() body: { participationId: number; source: string },
  ) {
    this.service.saveSource(body.participationId, body.source);
  }

  @Post('perTime')
  async getParticipationsPerTime(
    @Body() payload: { researchGroupId: number; testId: number },
  ): Promise<ParticipationCount> {
    return this.service.getParticipationsPerTime(payload);
  }

  @Post()
  saveParticipation(
    @Body() participation: Participation,
  ): Promise<Participation> {
    return this.service.save(participation);
  }

  @Post('public/saveQuizResponse')
  saveQuizResponse(
    @Body() participation: Participation,
  ): Promise<Participation> {
    return this.service.save(participation);
  }

  @Post('public/save-user/:userHash')
  saveUser(@Param('userHash') userHash: string, @Body() user: any) {
    this.service.saveUserData(userHash, user);
  }

  @Get('byId/:id')
  getById(@Param('id') id: number): Promise<Participation> {
    return this.service.getById(id);
  }

  @Get('getTotalParticipations/:researchGroupId')
  getTotalParticipations(
    @Param('researchGroupId') researchGroupId: number,
  ): Promise<number> {
    return this.service.countParticipations(researchGroupId);
  }

  @Get('public/byId/:id')
  getByIdPublic(@Param('id') id: number): Promise<Participation> {
    return this.service.getById(id);
  }

  @Get('recalculateAllResponseItems/:participationId')
  recalculateAll(
    @Param('participationId') participationId: number,
  ): Promise<any> {
    return this.service.recalculateAllResponseItems(participationId);
  }

  @Delete('softDelete/:id')
  softDelete(@Param('id') id: number): Promise<DeleteResult> {
    return this.service.softDeleteById(id);
  }

  @Get('/restore/:id')
  restore(@Param('id') id: number): Promise<any> {
    return this.service.restore(id);
  }

  @Post('public/respond/:participationId/:itemId')
  saveResponse(
    @Param('participationId') participationId: number,
    @Param('itemId') itemId: number,
    @Body() response: any,
  ) {
    return this.service.saveResponse(participationId, itemId, response);
  }

  @Get('public/instantiate/:participationId/:testItemId')
  instantiateParticipationItem(
    @Param('participationId') participationId: number,
    @Param('testItemId') testItemId: number,
  ) {
    return this.service.instantiateParticipationItem(
      participationId,
      testItemId,
    );
  }
}
