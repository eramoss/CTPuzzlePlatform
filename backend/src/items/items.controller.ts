import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import { Item } from './item.entity';
import { ItemsService } from './items.service';

@UseGuards(JwtAuthGuard)
@Controller('items')
export class ItemsController {

  constructor(private itemService: ItemsService) { }

  @Get('byId/:id')
  getById(@Param('id') id: number): Promise<Item> {
    return this.itemService.getById(id);
  }

  @Post()
  save(@Body() item: Item): Promise<Item> {
    return this.itemService.save(item);
  }

  @Post('paginate')
  async paginate(@Body() pageRequest: PageRequest): Promise<PageResponse<Item>> {
    return this.itemService.paginate(pageRequest);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: number) {
    this.itemService.removeById(id);
  }

  @Get('findAll')
  findAll(): Promise<Item[]> {
    return this.itemService.findAll()
  }

}
