import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

class CreateProductDto {
  @IsString() @IsNotEmpty() manufacturerId!: string;
  @IsString() @IsNotEmpty() title!: string;
  @IsString() @IsNotEmpty() description!: string;
  @IsNumber() price!: number;
  commission!: any;
  @IsOptional() @IsArray() imageUrls?: string[];
}

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly products: ProductService) {}

  @Get()
  list() { return this.products.list(); }

  @Get(':id')
  get(@Param('id') id: string) { return this.products.get(id); }

  @Post()
  create(@Body() dto: CreateProductDto) { return this.products.create(dto); }
}
