import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('chat')
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Post('conversations')
  createConversation(@Body() body: { agentId: string; customerId?: string }) {
    return this.chat.createConversation(body.agentId, body.customerId);
  }

  @Post('messages')
  sendMessage(@Body() body: { conversationId: string; senderId: string; content: string; }) {
    return this.chat.saveMessage(body.conversationId, body.senderId, body.content, 'TEXT');
  }
}
