import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import { DeleteResult } from 'typeorm';
import { Item } from './item.entity';
import { ItemsService } from './items.service';


@Controller('items')
export class ItemsController {

    constructor(private itemService: ItemsService) { }

    @UseGuards(JwtAuthGuard)
    @Get('byId/:id')
    getById(@Param('id') id: number): Promise<Item> {
        return this.itemService.getById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    save(@Body() item: Item): Promise<Item> {
        return this.itemService.save(item);
    }

    @UseGuards(JwtAuthGuard)
    @Post('paginate')
    async paginate(@Body() pageRequest: PageRequest): Promise<PageResponse<Item>> {
        return this.itemService.paginate(pageRequest);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('remove/:id')
    remove(@Param('id') id: number): Promise<DeleteResult> {
        return this.itemService.removeById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('findAll')
    findAll(): Promise<Item[]> {
        return this.itemService.findAll()
    }

    @Get('instantiate/:id')
    instantiate(@Param('id') id: number): Promise<string> {
        return this.itemService.instantiateToGetJson(id);
    }

}
