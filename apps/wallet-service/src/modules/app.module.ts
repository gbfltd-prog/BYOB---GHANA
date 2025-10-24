import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../common/jwt.guard';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [WalletModule],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }]
})
export class AppModule {}
