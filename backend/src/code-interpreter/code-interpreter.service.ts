import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ChildProcess, spawn } from 'child_process';

@Injectable()
export class CodeInterpreterService {

    async isExecutable(codeToTry: string): Promise<boolean> {
        try {
            await this.execute(codeToTry, true)
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    denoLocation!: string

    constructor(private configService: ConfigService) {
        this.denoLocation = this.configService.get('DENO_LOCATION')
    }

    execute(script: string, rejectOnError: boolean = false): Promise<string> {
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
                    if (rejectOnError) {
                        reject(result);
                    }
                    resolve(result);
                }
            })
            deno.stdin.write(script);
            deno.stdin.end();
        })
    }
}
