import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule } from '@byob/nest-common';
import { ChatModule } from './chat/chat.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), EventEmitterModule.forRoot(), JwtAuthModule.register(), ChatModule],
})
export class AppModule {}
