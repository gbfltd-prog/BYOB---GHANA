import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  create(@Req() req: any, @Body() body: { items: { productId: string; quantity: number; }[]; latitude: number; longitude: number; }) {
    return this.service.create({ agentId: req.user.id, items: body.items, latitude: body.latitude, longitude: body.longitude });
  }

  @Post(':id/confirm')
  confirm(@Param('id') id: string) {
    return this.service.confirm(id);
  }
}
