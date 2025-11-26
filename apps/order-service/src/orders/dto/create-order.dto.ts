import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, Min, ValidateNested } from 'class-validator';

class OrderItemInput {
  @IsString()
  productId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsString()
  agentId!: string;

  @IsString()
  customerName!: string;

  @IsString()
  customerPhone!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  items!: OrderItemInput[];
}
