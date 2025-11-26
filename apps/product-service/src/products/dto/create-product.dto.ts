import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class StockInputDto {
  @IsString()
  warehouseId!: string;

  @IsNumber()
  quantity!: number;
}

export class CreateProductDto {
  @IsString()
  manufacturerId!: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsNumber()
  price!: number;

  @IsOptional()
  commissionRules?: Record<string, unknown>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockInputDto)
  stock!: StockInputDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];
}
