import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { spawn, spawnSync, SpawnSyncReturns } from 'child_process';

import fs from 'fs'

@Injectable()
export class CodeInterpreterService {

    denoLocation!: string

    constructor(private configService: ConfigService) {
        this.denoLocation = this.configService.get('DENO_LOCATION')
    }

    async isExecutable(codeToTry: string): Promise<boolean> {
        try {
            await this.execute(codeToTry, true)
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    execute(script: string, rejectOnError: boolean = false): Promise<string> {
        return this.executeAsync(script, rejectOnError);
    }

    //deprecated
    executeSync(script: string, rejectOnError: boolean): Promise<string> {
        let path = __dirname + '/test.ts';
        fs.writeFileSync(path, script);
        let deno: SpawnSyncReturns<Buffer> = spawnSync(this.denoLocation, ['run', path], { env: { 'NO_COLOR': 'true', }, timeout: 100 });
        let stderr = deno.stderr.toString()
        if (rejectOnError) {
            if (stderr) {
                Promise.reject(stderr);
            }
        }
        let result = this.removeUndesiredLines(deno.output.toString())
        return Promise.resolve(result);
    }

    executeAsync(script: string, rejectOnError: boolean): Promise<string> {
        return new Promise((resolve, reject) => {

            let deno = spawn(this.denoLocation, ['run', '-'], { env: { 'NO_COLOR': 'true' } });
            deno.stdout.setEncoding('utf8')
            deno.stderr.setEncoding('utf8')

            let lines = ""

            deno.stdout.on('data', (data: Buffer) => {
                lines += data.toString()
            })

            deno.stderr.on('data', (data: Buffer) => {
                let line = data.toString();
                if (!line.startsWith('Check file:///')) {
                    lines += data.toString()
                    if (rejectOnError) {
                        reject(line)
                    }
                }
            })

            deno.on('error', (error: Error) => {
                console.log(error.message);
            })

            deno.on('close', code => {
                console.log('Deno exits with code ', code);
                let result = this.removeUndesiredLines(lines)
                resolve(result)
            })

            deno.stdin.write(script)
            deno.stdin.end()
        })
    }

    removeUndesiredLines(result: String): string {
        return result.split('\n')
            .map(line => {
                while (line.startsWith(',')) {
                    line = line.substring(1, line.length)
                }
                return line
            })
            .filter(line => !line.startsWith('Check file:///'))
            .join('\n')
    }
}
