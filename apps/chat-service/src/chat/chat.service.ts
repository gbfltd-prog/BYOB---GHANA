import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@byob/prisma';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService, private readonly events: EventEmitter2) {}

  createConversation(dto: CreateConversationDto) {
    return this.prisma.conversation.create({
      data: {
        agentId: dto.agentId,
        customerAlias: dto.customerAlias,
        customerId: dto.customerId,
      },
    });
  }

  listConversations(agentId: string) {
    return this.prisma.conversation.findMany({
      where: { agentId },
      include: { messages: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async sendMessage(dto: SendMessageDto) {
    const conversation = await this.prisma.conversation.findUnique({ where: { id: dto.conversationId } });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        senderId: dto.senderId,
        content: dto.content,
        messageType: dto.messageType || 'TEXT',
      },
    });

    this.events.emit('chat.message.created', message);
    return message;
  }
}
