import { IsNumber, IsString } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  name!: string;

  @IsString()
  city!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;
}
