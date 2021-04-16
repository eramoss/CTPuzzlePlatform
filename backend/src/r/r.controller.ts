import { Body, Controller, Param, Post } from '@nestjs/common';
import { PlotRequest, PlotResponse } from './plot.dto';
import { RService } from './r.service';

@Controller('r')
export class RController {

    constructor(private rService: RService) {

    }

    @Post('plot')
    plot(@Body() plotRequest: PlotRequest): Promise<PlotResponse> {
        return this.rService.plot(plotRequest)
    }

}
