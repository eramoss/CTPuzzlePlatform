import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ItemResponse } from 'src/item-responses/item-response.entity';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import Participation from 'src/participation/participation.entity';
import PreparedParticipation from 'src/participation/prepared-participation.dto';
import { User } from 'src/users/user.entity';
import { CsvData } from 'src/util/download';
import { DeleteResult, UpdateResult } from 'typeorm';
import { TestApplication } from './test-application.entity';
import { TestApplicationsService } from './test-applications.service';

@Controller('test-applications')
@UseGuards(JwtAuthGuard)
export class TestApplicationsController {
  constructor(private testApplicationsService: TestApplicationsService) {}

  @Post()
  save(@Body() testApplication: TestApplication): Promise<TestApplication> {
    return this.testApplicationsService.save(testApplication);
  }

  @Put('updateVisibility')
  updateVisibility(
    @Body() testApplication: TestApplication,
  ): Promise<UpdateResult> {
    return this.testApplicationsService.updateVisibility(testApplication);
  }

  @Delete('softDelete/:id')
  softDelete(@Param('id') id: number): Promise<DeleteResult> {
    return this.testApplicationsService.softDeleteById(id);
  }

  @Get('/findAll')
  findAll(): Promise<TestApplication[]> {
    return this.testApplicationsService.findAll();
  }

  @Get('public/getPuplicApplications')
  getPuplicApplications(): Promise<TestApplication[]> {
    return this.testApplicationsService.getPuplicApplications();
  }

  @Get('public/getPuplicApplicationsByMechanicName/:name')
  getPuplicApplicationsByMechanicName(
    @Param('name') name: string,
  ): Promise<TestApplication[]> {
    return this.testApplicationsService.getPuplicApplicationsByMechanicName(
      name,
    );
  }

  @Get('restore/:id')
  restore(@Param('id') id: number): Promise<UpdateResult> {
    return this.testApplicationsService.restore(id);
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
  generateItemResponsesCsv(
    @Param('testApplicationId') testApplicationId: number,
  ): Promise<string> {
    return this.testApplicationsService.generateCsvFromItemResponses(
      testApplicationId,
    );
  }

  @Get('getCsvData/:testApplicationId')
  getCsvData(
    @Param('testApplicationId') testApplicationId: number,
  ): Promise<CsvData> {
    return this.testApplicationsService.getCsvData(testApplicationId);
  }

  @Get('getLastResponse/:testApplicationId')
  getLastResponse(
    @Param('testApplicationId') testApplicationId: number,
  ): Promise<ItemResponse> {
    return this.testApplicationsService.getLastResponse(testApplicationId);
  }

  @Post('paginate')
  paginate(
    @Body() pageRequest: PageRequest,
    @Request() req: any,
  ): Promise<PageResponse<TestApplication>> {
    return this.testApplicationsService.paginate(pageRequest);
  }

  @Get('public/data/:testApplicationHash/:userHash')
  getApplicationData(
    @Param('testApplicationHash') testAplicationHash: string,
    @Param('userHash') userHash: string,
  ): Promise<PreparedParticipation> {
    return this.testApplicationsService.getApplicationData(
      testAplicationHash,
      userHash,
    );
  }

  @Get('public/participate/:testApplicationHash/:userHash')
  participateInTheTest(
    @Param('testApplicationHash') testApplicationHash: string,
    @Param('userHash') userHash: string,
  ): Promise<Participation> {
    const user = new User();
    user.hash = userHash;
    return this.testApplicationsService.participateInTheTest(
      testApplicationHash,
      user,
    );
  }

  @Get('recalculateAllApplicationParticipationScores/:testApplicationId')
  recalculateAllApplicationParticipationScores(
    @Param('testApplicationId') testApplicationId: number,
  ): Promise<any> {
    return this.testApplicationsService.recalculateAllApplicationParticipationScores(
      testApplicationId,
    );
  }
}
