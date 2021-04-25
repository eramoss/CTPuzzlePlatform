import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { spawnSync, SpawnSyncReturns } from 'child_process';
import { buildCsv, write, writeCsv } from 'src/util/download';
import { PlotRequest, PlotResponse } from './plot.dto';

// Como gerar gráficos:
// R Graphics Cookbook Practical Recipes for Visualizing Data by Winston Chang (epub baixado)
// Como passar argumentos para script R:
// https://www.r-bloggers.com/2015/09/passing-arguments-to-an-r-script-from-command-lines/

@Injectable()
export class RService {

    constructor(
        private configService: ConfigService) {
    }

    plot(plotRequest: PlotRequest): Promise<PlotResponse> {
        return new Promise<PlotResponse>((resolve: (value: PlotResponse) => void, reject: (reason?: any) => void) => {
            let response = new PlotResponse()
            try {
                let uploadDir = this.configService.get('FILE_UPLOAD_DIRECTORY')
                let RscriptsLocation = this.configService.get('R_SCRIPTS_LOCATION')
                let path = `${RscriptsLocation}/plot.R`
                let plotFileName = `output-plot-${plotRequest.id}.png`
                let plot_file_path = `${uploadDir}/${plotFileName}`
                let data_file_path = `${RscriptsLocation}/input.csv`

                write(data_file_path, plotRequest.csv)

                let r: SpawnSyncReturns<Buffer> = spawnSync('Rscript',
                    [
                        '--vanilla',
                        `${path}`,
                        `--fn=${plotRequest.id}`,
                        `--plot_output_file_path=${plot_file_path}`,
                        `--data_input_file_path=${data_file_path}`,
                    ],
                    { env: {} });
                let stderr = r.stderr.toString()
                let output = r.stdout.toString()
                response.data = output;
                response.plotFileName = plotFileName
                response.err = stderr

                console.error(stderr)
                console.log(output)
            } catch (e) {
                response.err = e
            }
            resolve(response)
        })

    }
}
