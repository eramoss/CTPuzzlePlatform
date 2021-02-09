import { Controller, Post, UploadedFile, UseInterceptors, Request, Get, Res, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file-upload')
export class FileUploadController {

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
    uploadSingle(@UploadedFile() file: any): string {
        return file.filename
    }

    @Get('view/:filename')
    viewFile(@Param('filename') filename: string, @Res() res) {
        res.sendFile(filename, { root: 'uploads' })
    }
}
