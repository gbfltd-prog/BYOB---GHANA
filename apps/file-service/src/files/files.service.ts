import { Injectable } from '@nestjs/common';
import { Client as MinioClient } from 'minio';
import { WatermarkDto } from './dto/watermark.dto';

@Injectable()
export class FilesService {
  private readonly client: MinioClient;
  private readonly bucket: string;

  constructor() {
    this.bucket = process.env.MINIO_BUCKET || 'byob';
    this.client = new MinioClient({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: Number(process.env.MINIO_PORT || 9000),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY || 'minio',
      secretKey: process.env.MINIO_SECRET_KEY || 'minio123',
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const objectName = `${Date.now()}-${file.originalname}`;
    await this.ensureBucket();
    await this.client.putObject(this.bucket, objectName, file.buffer, file.size);
    return { url: this.buildUrl(objectName) };
  }

  async generateWatermark(dto: WatermarkDto) {
    const baseImageUrl = dto.baseImageUrl || 'https://cdn.byob.africa/default-product.png';
    const watermark = `BYOB | ${dto.accountNo}`;
    const objectName = `watermarks/${dto.productId}-${dto.accountNo}.png`;
    await this.ensureBucket();
    await this.client.putObject(this.bucket, objectName, Buffer.from(watermark), watermark.length);
    return {
      watermarkText: watermark,
      baseImageUrl,
      watermarkedUrl: this.buildUrl(objectName),
    };
  }

  private async ensureBucket() {
    const exists = await this.client.bucketExists(this.bucket).catch(() => false);
    if (!exists) {
      await this.client.makeBucket(this.bucket, 'us-east-1');
    }
  }

  private buildUrl(objectName: string) {
    const endpoint = process.env.MINIO_PUBLIC_URL || 'http://localhost:9000';
    return `${endpoint}/${this.bucket}/${objectName}`;
  }
}
