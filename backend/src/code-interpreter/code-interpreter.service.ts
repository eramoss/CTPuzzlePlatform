import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ChildProcess, spawn } from 'child_process';

@Injectable()
export class CodeInterpreterService {

    denoLocation!: string

    constructor(private configService: ConfigService) {
        this.denoLocation = this.configService.get('DENO_LOCATION')
    }

    execute(script: string): Promise<string> {
        console.info(`running code:\n ${script}`)
        return new Promise<string>((resolve, reject) => {
            let deno: ChildProcess = spawn(this.denoLocation, ['run', '-'], { env: { 'NO_COLOR': 'true' } })
            deno.stdout.setEncoding('utf8');
            deno.stdout.on('data', (data: Buffer) => {
                Logger.log('Resultado da execução:' + data)
                resolve(data.toString('utf8'));
            })
            deno.stderr.on('data', (data: Buffer) => {
                Logger.log('Resultado da falha:' + data)
                let result = data.toString('utf8');
                console.log(result)
                if (!result.startsWith('Check file')) {
                    resolve(result);
                }
            })
            deno.stdin.write(script);
            deno.stdin.end();
        })
    }
}
