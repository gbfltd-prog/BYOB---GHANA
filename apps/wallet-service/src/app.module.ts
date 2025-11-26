import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule } from '@byob/nest-common';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), JwtAuthModule.register(), WalletModule],
})
export class AppModule {}
