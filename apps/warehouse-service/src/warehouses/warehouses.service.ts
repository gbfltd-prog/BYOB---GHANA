import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@byob/prisma';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateWarehouseDto) {
    return this.prisma.warehouse.create({ data: dto });
  }

  list() {
    return this.prisma.warehouse.findMany({ include: { inventory: true } });
  }

  async updateInventory(id: string, dto: UpdateInventoryDto) {
    const inventory = await this.prisma.inventory.findFirst({
      where: { warehouseId: id, productId: dto.productId },
    });
    if (!inventory) {
      throw new NotFoundException('Inventory entry not found');
    }
    return this.prisma.inventory.update({
      where: { id: inventory.id },
      data: { quantity: dto.quantity },
    });
  }
}
