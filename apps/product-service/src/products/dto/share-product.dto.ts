import { IsOptional, IsString } from 'class-validator';

export class ShareProductDto {
  @IsString()
  agentId!: string;

  @IsString()
  accountNo!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
