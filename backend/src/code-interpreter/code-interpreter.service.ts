import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ChildProcess, spawn, spawnSync, SpawnSyncReturns } from 'child_process';

const fs = require('fs')

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
        //console.info(`running code:\n ${script}`)
        return this.executeSync(script, rejectOnError);
    }

    executeSync(script: string, rejectOnError: boolean): Promise<string> {
        let path = __dirname + '/test.ts';
        fs.writeFileSync(path, script);
        let deno: SpawnSyncReturns<Buffer> = spawnSync(this.denoLocation, ['run', path], { env: { 'NO_COLOR': 'true' } });
        let stderr = deno.stderr.toString()
        if (rejectOnError) {
            if (stderr) {
                Promise.reject(stderr);
            }
        }
        let result = deno.output.toString().split('\n')
            .map(line => {
                if (line.startsWith(',')) {
                    return line.substring(1, line.length)
                }
                return line
            })
            .filter(line => !line.startsWith('Check file:///'))
            .join('\n')
        return Promise.resolve(result);
    }
}
