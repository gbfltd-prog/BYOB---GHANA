import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule } from '@byob/nest-common';
import { ScoresModule } from './scores/scores.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), JwtAuthModule.register(), ScoresModule],
})
export class AppModule {}
