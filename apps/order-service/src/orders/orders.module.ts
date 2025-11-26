import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '@byob/prisma';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService],
})
export class OrdersModule {}
