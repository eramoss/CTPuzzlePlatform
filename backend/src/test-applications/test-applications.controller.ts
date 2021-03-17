import { Body, Controller, Delete, Get, Head, Request, Param, Post, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import PreparedParticipation from 'src/participation/prepared-participation.dto';
import { DeleteResult } from 'typeorm';
import { TestApplication } from './test-application.entity';
import { TestApplicationsService } from './test-applications.service';
import { Response } from 'express';
import { getResearchGroupId } from 'src/util/getClaim';

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

    @Get('generateItemResponsesCsv/:testApplicationId')
    generateItemResponsesCsv(@Param('testApplicationId') testApplicationId: number): Promise<string> {
        return this.testApplicationsService.generateItemResponsesCsv(testApplicationId);
    }

    @Post('paginate')
    paginate(@Body() pageRequest: PageRequest, @Request() req: any): Promise<PageResponse<TestApplication>> {
        let researchGroupId = getResearchGroupId(req)
        return this.testApplicationsService.paginate(researchGroupId, pageRequest)
    }

    @Get('public/data/:testApplicationHash/:userHash')
    getApplicationData(
        @Param('testApplicationHash') testAplicationHash: string,
        @Param('userHash') userHash: string):
        Promise<PreparedParticipation> {
        return this.testApplicationsService.getApplicationData(testAplicationHash, userHash);
    }

}
