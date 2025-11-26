import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { JwtAuthGuard } from '@byob/nest-common';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehouses: WarehousesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateWarehouseDto) {
    return this.warehouses.create(dto);
  }

  @Get()
  list() {
    return this.warehouses.list();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/inventory')
  updateInventory(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    return this.warehouses.updateInventory(id, dto);
  }
}
