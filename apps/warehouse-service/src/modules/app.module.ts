import { Module } from '@nestjs/common';
import { WarehouseModule } from './warehouse/warehouse.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../common/jwt.guard';

@Module({
  imports: [WarehouseModule],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }]
})
export class AppModule {}
