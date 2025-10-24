import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../common/jwt.guard';

@Module({
  imports: [ProductModule],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard }
  ]
})
export class AppModule {}
