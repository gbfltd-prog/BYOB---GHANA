import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { ShareProductDto } from './dto/share-product.dto';
import { JwtAuthGuard } from '@byob/nest-common';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  findAll() {
    return this.products.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.products.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.products.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/stock')
  updateStock(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    return this.products.updateStock(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/share')
  share(@Param('id') id: string, @Body() dto: ShareProductDto) {
    return this.products.shareProduct(id, dto);
  }
}
