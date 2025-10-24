import { Body, Controller, Post } from '@nestjs/common';
import { FileService } from './file.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('files')
@ApiBearerAuth()
@Controller('files')
export class FileController {
  constructor(private readonly files: FileService) {}

  @Post('watermark')
  async watermark(@Body() body: { imageBase64: string; agentAccountNo: string; key: string; }) {
    const buf = Buffer.from(body.imageBase64, 'base64');
    return this.files.watermarkAndUpload(buf, body.agentAccountNo, body.key);
  }
}
