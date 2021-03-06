import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MulterOptionsFactory } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

@Injectable()
export default class MulterConfigService implements MulterOptionsFactory {

    destConfigDirectory: string;

    constructor(private configService: ConfigService) {
        this.destConfigDirectory = this.configService.get('FILE_UPLOAD_DIRECTORY')
    }

    createMulterOptions(): MulterOptions {
        return {
            dest: this.destConfigDirectory
        }
    }

}