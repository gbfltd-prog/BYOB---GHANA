import { Module } from '@nestjs/common';
import { WarehousesController } from './warehouses.controller';
import { WarehousesService } from './warehouses.service';
import { PrismaService } from '@byob/prisma';

@Module({
  controllers: [WarehousesController],
  providers: [WarehousesService, PrismaService],
  exports: [WarehousesService],
})
export class WarehousesModule {}
