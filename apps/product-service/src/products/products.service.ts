import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@byob/prisma';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { ShareProductDto } from './dto/share-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({
      include: {
        commissionScheme: true,
        images: true,
        inventories: {
          include: { warehouse: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        commissionScheme: true,
        images: true,
        inventories: {
          include: { warehouse: true },
        },
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        manufacturerId: dto.manufacturerId,
        title: dto.title,
        description: dto.description,
        price: dto.price,
        commissionScheme: dto.commissionRules
          ? {
              create: {
                rules: dto.commissionRules,
              },
            }
          : undefined,
        images:
          dto.imageUrls?.length
            ? {
                createMany: {
                  data: dto.imageUrls.map((url) => ({ url })),
                },
              }
            : undefined,
        inventories: {
          create: dto.stock.map((entry) => ({
            warehouseId: entry.warehouseId,
            quantity: entry.quantity,
          })),
        },
      },
    });
  }

  async updateStock(productId: string, dto: UpdateStockDto) {
    const inventory = await this.prisma.inventory.findFirst({
      where: { productId, warehouseId: dto.warehouseId },
    });
    if (!inventory) {
      throw new NotFoundException('Inventory record not found');
    }

    return this.prisma.inventory.update({
      where: { id: inventory.id },
      data: {
        quantity: inventory.quantity + dto.quantityDelta,
      },
    });
  }

  async shareProduct(productId: string, dto: ShareProductDto) {
    const product = await this.findOne(productId);
    const watermarkText = `BYOB | ${dto.accountNo}`;
    const imageUrl = dto.imageUrl || product.images[0]?.url || 'https://cdn.byob/placeholder.png';
    const watermarkedImageUrl = `${imageUrl}?watermark=${encodeURIComponent(watermarkText)}`;

    return {
      productId,
      agentId: dto.agentId,
      watermark: watermarkText,
      watermarkedImageUrl,
      shareLink: `${process.env.SHARE_BASE_URL || 'https://byob.africa/p'}/${productId}?agent=${dto.agentId}`,
    };
  }
}
