import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import Participation from './participation.entity';
import { ParticipationService } from './participation.service';

@Controller('participations')
export class ParticipationController {

    constructor(private service:ParticipationService){

    }

    @Put('/save-progress')
    saveCurrentItem(@Body() participation:Participation){
        this.service.saveProgress(participation)
    }
    
}
