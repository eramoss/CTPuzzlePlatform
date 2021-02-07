import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import { TestItem } from './test-item.entity';
import { TestItemsService } from './test-items.service';

@UseGuards(JwtAuthGuard)
@Controller('test-items')
export class TestItemsController {

  constructor(private testItemService: TestItemsService) { }

  @Get('byId/:id')
  getById(@Param('id') id:number):Promise<TestItem>{
    return this.testItemService.getById(id);
  }

  @Post()
  save(@Body() testItem: TestItem): Promise<TestItem> {
    return this.testItemService.save(testItem);
  }

  @Post('paginate')
  async paginate(@Body() pageRequest: PageRequest): Promise<PageResponse<TestItem>> {
    return this.testItemService.paginate(pageRequest);
  }

  @Delete('remove/:id')
  remove(@Param('id') id:number){
    this.testItemService.removeById(id);
  }

}
