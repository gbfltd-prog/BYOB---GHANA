import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../common/jwt.guard';
import { OrderModule } from './order/order.module';

@Module({
  imports: [OrderModule],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }]
})
export class AppModule {}
