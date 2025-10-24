import { Body, Controller, Get, Post } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('warehouses')
@ApiBearerAuth()
@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly service: WarehouseService) {}

  @Get()
  list() { return this.service.list(); }

  @Post('nearest')
  nearest(@Body() body: { latitude: number; longitude: number; }) {
    return this.service.nearest(body.latitude, body.longitude);
  }
}
