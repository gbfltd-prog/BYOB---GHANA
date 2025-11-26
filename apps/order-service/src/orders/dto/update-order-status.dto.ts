import { IsEnum } from 'class-validator';
import { OrderStatus } from '@byob/prisma';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
