import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { PrismaService } from '@byob/prisma';

@Module({
  controllers: [WalletController],
  providers: [WalletService, PrismaService],
})
export class WalletModule {}
