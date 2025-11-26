import { Module } from '@nestjs/common';
import { ManufacturersController } from './manufacturers.controller';
import { ManufacturersService } from './manufacturers.service';
import { PrismaService } from '@byob/prisma';

@Module({
  controllers: [ManufacturersController],
  providers: [ManufacturersService, PrismaService],
})
export class ManufacturersModule {}
