import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { JwtAuthGuard } from '@byob/nest-common';

@Controller('manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturers: ManufacturersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  register(@Body() dto: CreateManufacturerDto) {
    return this.manufacturers.register(dto);
  }

  @Get()
  list() {
    return this.manufacturers.list();
  }
}
