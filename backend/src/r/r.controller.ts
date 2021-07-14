import { Body, Controller, Post } from '@nestjs/common';
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

    @Post('run')
    run(@Body() payload: { script: string, csv: string, separator: string, dataVarName: string }): Promise<string> {
        return this.rService.run(payload)
    }

}
