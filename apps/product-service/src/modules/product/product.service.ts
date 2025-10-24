import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@byob/db';

@Injectable()
export class ProductService {
  list() {
    return prisma.product.findMany({
      include: { images: true, inventory: true, manufacturer: { include: { user: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async get(id: string) {
    const prod = await prisma.product.findUnique({ where: { id }, include: { images: true, inventory: true } });
    if (!prod) throw new NotFoundException('Product not found');
    return prod;
  }

  create(data: { manufacturerId: string; title: string; description: string; price: number; commission: any; imageUrls?: string[]; }) {
    return prisma.product.create({
      data: {
        manufacturerId: data.manufacturerId,
        title: data.title,
        description: data.description,
        price: data.price,
        commission: data.commission,
        images: { create: (data.imageUrls || []).map((url) => ({ url })) }
      }
    });
  }
}
