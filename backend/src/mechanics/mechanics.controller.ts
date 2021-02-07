import { Delete } from '@nestjs/common';
import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PageRequest } from 'src/pagination/pagerequest.dto';
import { PageResponse } from 'src/pagination/pageresponse.dto';
import { Mechanic } from './mechanic.entity';
import { MechanicsService } from './mechanics.service';

@UseGuards(JwtAuthGuard)
@Controller('mechanics')
export class MechanicsController {

  constructor(private mechanicsService: MechanicsService) { }

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
    return this.mechanicsService.findAll();
  }

  @Delete('remove/:id')
  async delete(@Param('id') id: number) {
    return this.mechanicsService.removeById(id);
  }

}
