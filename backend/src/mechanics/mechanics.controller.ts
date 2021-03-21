import { Delete } from '@nestjs/common';
import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import { getResearchGroupId } from 'src/util/getClaim';
import { DeleteResult } from 'typeorm';
import { Mechanic } from './mechanic.entity';
import { MechanicsService } from './mechanics.service';

@UseGuards(JwtAuthGuard)
@Controller('mechanics')
export class MechanicsController {

    constructor(
        private mechanicsService: MechanicsService) { }

    @Post()
    saveMechanic(@Body() mechanic: Mechanic): Promise<Mechanic> {
        return this.mechanicsService.save(mechanic);
    }

    @Get('byId/:id')
    getById(@Param('id') id: number): Promise<Mechanic> {
        return this.mechanicsService.getById(id);
    }

    @Post('paginate')
    async paginate(@Body() pageRequest: PageRequest): Promise<PageResponse<Mechanic>> {
        return this.mechanicsService.paginate(pageRequest);
    }

    @Get('findAll')
    async findAll(@Request() req: any): Promise<Mechanic[]> {
        const researchGroupId = getResearchGroupId(req);
        return this.mechanicsService.findAll(researchGroupId);
    }

    @Delete('softDelete/:id')
    async softDelete(@Param('id') id: number): Promise<DeleteResult> {
        return this.mechanicsService.softDelete(id);
    }

    @Get('restore/:id')
    async restore(@Param('id') id: number): Promise<any> {
        return this.mechanicsService.restore(id);
    }


    @Get('public/instantiate/:id')
    instantiate(@Param('id') id: number): Promise<string> {
        return this.mechanicsService.instantiateToGetJson(id);
    }

}
