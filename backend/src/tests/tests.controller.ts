import { Body, Controller, Delete, Get, Header, Param, Post, Res, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import { getResearchGroupId } from 'src/util/getClaim';
import { DeleteResult } from 'typeorm';
import { Test } from './test.entity';
import { TestService } from './tests.service';


@Controller('tests')
@UseGuards(JwtAuthGuard)
export class TestController {

    constructor(private testService: TestService) { }

    @Post()
    save(@Body() test: Test): Promise<Test> {
        return this.testService.save(test)
    }

    @Get('byId/:id')
    getById(@Param('id') id: number): Promise<Test> {
        return this.testService.getById(id);
    }

    @Get('findAll')
    findAll(@Request() req: any): Promise<Test[]> {
        const researchGroupId = getResearchGroupId(req);
        return this.testService.findAll(researchGroupId);
    }

    @Post('paginate')
    async paginate(@Body() pageRequest: PageRequest): Promise<PageResponse<Test>> {
        return this.testService.paginate(pageRequest);
    }

    @Delete('softDelete/:id')
    remove(@Param('id') id: number): Promise<DeleteResult> {
        return this.testService.softDeleteById(id);
    }

    @Get('restore/:id')
    restore(@Param('id') id: number): Promise<DeleteResult> {
        return this.testService.restore(id);
    }


    @Get('getPuzzleBaseUrl/:id')
    async getPuzzleBaseUrl(@Param('id') id: number): Promise<string> {
        return this.testService.getPuzzleBaseUrl(id)
    }

    @Get('public/generateJson/:id')
    @Header('Content-Type', 'application/json')
    generateJsonFromTest(@Param('id') testId: number): Promise<string> {
        return this.testService.generateJson(testId);
    }
}
