import { IsNumber, IsString } from 'class-validator';

export class UpdateStockDto {
  @IsString()
  warehouseId!: string;

  @IsNumber()
  quantityDelta!: number;
}
