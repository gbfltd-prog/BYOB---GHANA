import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class ChatGateway {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('joinConversation')
  handleJoin(@MessageBody() conversationId: string, @ConnectedSocket() client: Socket) {
    client.join(conversationId);
    this.logger.debug(`Client ${client.id} joined conversation ${conversationId}`);
    return { joined: conversationId };
  }

  @OnEvent('chat.message.created')
  handleMessageCreated(payload: any) {
    if (!this.server) {
      return;
    }
    this.server.to(payload.conversationId).emit('messageCreated', payload);
  }
}
