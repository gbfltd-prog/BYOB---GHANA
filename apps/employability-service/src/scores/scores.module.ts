import { Module } from '@nestjs/common';
import { ScoresController } from './scores.controller';
import { ScoresService } from './scores.service';
import { PrismaService } from '@byob/prisma';

@Module({
  controllers: [ScoresController],
  providers: [ScoresService, PrismaService],
})
export class ScoresModule {}
