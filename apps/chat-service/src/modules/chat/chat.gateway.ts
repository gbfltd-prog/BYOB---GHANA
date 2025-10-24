import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly chat: ChatService) {}

  @SubscribeMessage('join')
  async onJoin(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string }) {
    client.join(data.conversationId);
    client.emit('joined', { ok: true });
  }

  @SubscribeMessage('message')
  async onMessage(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string; senderId: string; content: string; }) {
    const msg = await this.chat.saveMessage(data.conversationId, data.senderId, data.content, 'TEXT');
    this.server.to(data.conversationId).emit('message', msg);
    return msg;
  }
}
