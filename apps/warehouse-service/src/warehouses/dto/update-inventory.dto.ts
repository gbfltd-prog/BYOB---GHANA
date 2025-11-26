import { IsNumber, IsString } from 'class-validator';

export class UpdateInventoryDto {
  @IsString()
  productId!: string;

  @IsNumber()
  quantity!: number;
}
