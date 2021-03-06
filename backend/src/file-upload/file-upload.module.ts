import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import MulterConfigService from './multer-config.service'

@Module({
    providers: [MulterConfigService],
    imports: [MulterModule.registerAsync({
        useClass: MulterConfigService,
    })],
    controllers: [FileUploadController]
})
export class FileUploadModule { }
