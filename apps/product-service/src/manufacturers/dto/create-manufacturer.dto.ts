import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateManufacturerDto {
  @IsString()
  userId!: string;

  @IsString()
  businessName!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;
}
