import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule } from '@byob/nest-common';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), JwtAuthModule.register(), OrdersModule],
})
export class AppModule {}
