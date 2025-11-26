import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule } from '@byob/nest-common';
import { WarehousesModule } from './warehouses/warehouses.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), JwtAuthModule.register(), WarehousesModule],
})
export class AppModule {}
