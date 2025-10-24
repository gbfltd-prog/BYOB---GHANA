import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class FileService {
  private s3 = new S3Client({
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT || 'http://minio:9000',
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || 'minio',
      secretAccessKey: process.env.S3_SECRET_KEY || 'minio123',
    },
  });
  private bucket = process.env.S3_BUCKET || 'byob';

  async watermarkAndUpload(imageBuffer: Buffer, agentAccountNo: string, key: string) {
    const watermarked = await sharp(imageBuffer)
      .composite([
        {
          input: Buffer.from(
            `<svg width=\"800\" height=\"100\"><style>.t{fill:#ffffff; font-size: 40px; font-weight: bold}</style><text x=\"10\" y=\"60\" class=\"t\">BYOB | ${agentAccountNo}</text></svg>`
          ),
          gravity: 'south',
        },
      ])
      .toBuffer();

    await this.s3.send(
      new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: watermarked, ContentType: 'image/png' })
    );
    return `s3://${this.bucket}/${key}`;
  }
}
