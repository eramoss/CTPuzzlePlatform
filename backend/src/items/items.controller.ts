import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import { getResearchGroupId } from 'src/util/getClaim';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Item } from './item.entity';
import { ItemsService } from './items.service';

@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemsController {
  constructor(private itemService: ItemsService) {}

  @Get('byId/:id')
  getById(@Param('id') id: number): Promise<Item> {
    return this.itemService.getById(id);
  }

  @Post()
  save(@Body() item: Item): Promise<Item> {
    return this.itemService.save(item);
  }

  @Post('paginate')
  async paginate(
    @Body() pageRequest: PageRequest,
    @Request() req: any,
  ): Promise<PageResponse<Item>> {
    return this.itemService.paginate(pageRequest);
  }

  @Delete('softDelete/:id')
  softDelete(@Param('id') id: number): Promise<DeleteResult> {
    return this.itemService.softDeleteById(id);
  }

  @Get('restore/:id')
  restore(@Param('id') id: number): Promise<UpdateResult> {
    return this.itemService.restore(id);
  }

  @Get('findAll')
  findAll(@Request() req: any): Promise<Item[]> {
    const researchGroupId = getResearchGroupId(req);
    return this.itemService.findAll(researchGroupId);
  }

  @Get('public/instantiate/:id')
  instantiate(@Param('id') id: number): Promise<string> {
    return this.itemService.instantiateToGetJson(id);
  }
}
