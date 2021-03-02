import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import { DeleteResult } from 'typeorm';
import { TestApplication } from './test-application.entity';
import { TestApplicationsService } from './test-applications.service';

@Controller('test-applications')
export class TestApplicationsController {

    constructor(private testApplicationsService: TestApplicationsService) {

    }

    @UseGuards(JwtAuthGuard)
    @Post()
    save(@Body() testApplication: TestApplication): Promise<TestApplication> {
        return this.testApplicationsService.save(testApplication);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('remove/:id')
    delete(@Param('id') id: number): Promise<DeleteResult> {
        return this.testApplicationsService.removeById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('byId/:id')
    getById(@Param('id') id: number): Promise<TestApplication> {
        return this.testApplicationsService.getById(id);
    }

    @Get('byHash/:hash')
    getByHash(@Param('hash') hash: string): Promise<TestApplication> {
        return this.testApplicationsService.getByHash(hash);
    }

    @UseGuards(JwtAuthGuard)
    @Post('paginate')
    async paginate(@Body() pageRequest: PageRequest): Promise<PageResponse<TestApplication>> {
        return this.testApplicationsService.paginate(pageRequest)
    }
}
