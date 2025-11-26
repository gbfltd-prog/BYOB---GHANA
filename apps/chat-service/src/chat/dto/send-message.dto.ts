import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MessageType } from '@byob/prisma';

export class SendMessageDto {
  @IsString()
  conversationId!: string;

  @IsOptional()
  @IsString()
  senderId?: string;

  @IsString()
  content!: string;

  @IsOptional()
  @IsEnum(MessageType)
  messageType?: MessageType;
}
