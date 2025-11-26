import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '@byob/nest-common';
import { WatermarkDto } from './dto/watermark.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly files: FilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.files.uploadFile(file);
  }

  @UseGuards(JwtAuthGuard)
  @Post('watermark')
  watermark(@Body() dto: WatermarkDto) {
    return this.files.generateWatermark(dto);
  }
}
