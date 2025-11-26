import { IsNumber, IsString, Min } from 'class-validator';

export class TransferDto {
  @IsString()
  fromUserId!: string;

  @IsString()
  toUserId!: string;

  @IsNumber()
  @Min(0.01)
  amount!: number;
}
