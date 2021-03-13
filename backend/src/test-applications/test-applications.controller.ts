import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import Participation from 'src/participation/participation.entity';
import PreparedParticipation from 'src/participation/prepared-participation.dto';
import { User } from 'src/users/user.entity';
import { DeleteResult } from 'typeorm';
import { TestApplication } from './test-application.entity';
import { TestApplicationsService } from './test-applications.service';

@Controller('test-applications')
@UseGuards(JwtAuthGuard)
export class TestApplicationsController {

    constructor(private testApplicationsService: TestApplicationsService) {
    }

    @Post()
    save(@Body() testApplication: TestApplication): Promise<TestApplication> {
        return this.testApplicationsService.save(testApplication);
    }

    @Delete('remove/:id')
    delete(@Param('id') id: number): Promise<DeleteResult> {
        return this.testApplicationsService.removeById(id);
    }

    @Get('byId/:id')
    getById(@Param('id') id: number): Promise<TestApplication> {
        return this.testApplicationsService.getById(id);
    }

    @Get('byHash/:hash')
    getByHash(@Param('hash') hash: string): Promise<TestApplication> {
        return this.testApplicationsService.getByHash(hash);
    }

    @Post('paginate')
    paginate(@Body() pageRequest: PageRequest): Promise<PageResponse<TestApplication>> {
        return this.testApplicationsService.paginate(pageRequest)
    }

    @Get('public/data/:testApplicationHash/:userHash')
    getApplicationData(
        @Param('testApplicationHash') testAplicationHash: string,
        @Param('userHash') userHash: string
        ): 
        Promise<PreparedParticipation> {
        return this.testApplicationsService.getApplicationData(testAplicationHash, userHash);
    }

}
