import { Injectable } from '@nestjs/common';
import { prisma } from '@byob/db';
import Redis from 'ioredis';

@Injectable()
export class ChatService {
  private pub = new Redis(process.env.REDIS_URL || 'redis://redis:6379');

  async createConversation(agentId: string, customerId?: string) {
    return prisma.conversation.create({ data: { agentId, customerId } });
  }

  async saveMessage(conversationId: string, senderId: string, content: string, type: 'TEXT' | 'VOICE' = 'TEXT') {
    const msg = await prisma.message.create({ data: { conversationId, senderId, content, type } });
    await this.pub.publish('chat_events', JSON.stringify({ conversationId, senderId, content, type, createdAt: msg.createdAt }));
    return msg;
  }
}
