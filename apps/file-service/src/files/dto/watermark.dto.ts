import { IsOptional, IsString } from 'class-validator';

export class WatermarkDto {
  @IsString()
  productId!: string;

  @IsString()
  accountNo!: string;

  @IsOptional()
  @IsString()
  baseImageUrl?: string;
}
