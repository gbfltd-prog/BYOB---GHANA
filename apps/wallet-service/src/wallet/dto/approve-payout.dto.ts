import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PayoutStatus } from '@byob/prisma';

export class ApprovePayoutDto {
  @IsEnum(PayoutStatus)
  status!: PayoutStatus;

  @IsOptional()
  @IsString()
  approverId?: string;
}
