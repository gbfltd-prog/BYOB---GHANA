import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePayoutDto {
  @IsString()
  userId!: string;

  @IsNumber()
  @Min(1)
  amount!: number;

  @IsOptional()
  @IsString()
  channel?: string;
}
