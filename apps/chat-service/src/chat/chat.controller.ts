import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '@byob/nest-common';

@Controller('chat')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('conversations')
  createConversation(@Body() dto: CreateConversationDto) {
    return this.chat.createConversation(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('conversations/:agentId')
  list(@Param('agentId') agentId: string) {
    return this.chat.listConversations(agentId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('messages')
  sendMessage(@Body() dto: SendMessageDto) {
    return this.chat.sendMessage(dto);
  }
}
