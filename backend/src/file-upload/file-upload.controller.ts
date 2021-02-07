import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file-upload')
export class FileUploadController {

  @Post('upload')
  @UseInterceptors(FileInterceptor('files'))
  uploadFile(@UploadedFile() file: any) {
    console.log(file)
  }
}
