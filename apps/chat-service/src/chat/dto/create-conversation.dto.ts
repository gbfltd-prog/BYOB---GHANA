import { IsOptional, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  agentId!: string;

  @IsOptional()
  @IsString()
  customerAlias?: string;

  @IsOptional()
  @IsString()
  customerId?: string;
}
