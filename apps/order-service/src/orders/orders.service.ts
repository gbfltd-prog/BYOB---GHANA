import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaService, OrderStatus } from '@byob/prisma';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const productIds = dto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { commissionScheme: true },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products missing');
    }

    const warehouses = await this.prisma.warehouse.findMany();
    const warehouse = this.pickNearestWarehouse(warehouses, dto.latitude, dto.longitude);

    const totals = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      const price = Number(product.price);
      const rules = (product.commissionScheme?.rules || {}) as any;
      const commission = rules.flat
        ? Number(rules.flat)
        : price * (rules.percentage ?? 0.05);
      return {
        product,
        quantity: item.quantity,
        price: price * item.quantity,
        commission: commission * item.quantity,
      };
    });

    const totalPrice = totals.reduce((sum, item) => sum + item.price, 0);
    const totalCommission = totals.reduce((sum, item) => sum + item.commission, 0);

    return this.prisma.$transaction(async (tx) => {
      const warehouseId = warehouse?.id;
      const order = await tx.order.create({
        data: {
          agentId: dto.agentId,
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          latitude: dto.latitude,
          longitude: dto.longitude,
          warehouseId,
          total: new Prisma.Decimal(totalPrice),
          commissionTotal: new Prisma.Decimal(totalCommission),
          items: {
            create: totals.map((t) => ({
              productId: t.product.id,
              quantity: t.quantity,
              price: new Prisma.Decimal(t.price / t.quantity),
              commission: new Prisma.Decimal(t.commission / t.quantity),
            })),
          },
        },
        include: { items: true },
      });

      if (warehouseId) {
        await Promise.all(
          totals.map((t) =>
            tx.inventory.updateMany({
              where: { productId: t.product.id, warehouseId },
              data: { quantity: { decrement: t.quantity } },
            }),
          ),
        );
      }

      return order;
    });
  }

  listForAgent(agentId: string) {
    return this.prisma.order.findMany({
      where: { agentId },
      include: { items: true, warehouse: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  listAll() {
    return this.prisma.order.findMany({
      include: { items: true, warehouse: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async updateStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: dto.status },
    });

    if (dto.status === OrderStatus.DELIVERED) {
      await this.creditWallet(order.agentId, order.commissionTotal);
    }

    return order;
  }

  private async creditWallet(agentId: string, amount: Prisma.Decimal) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { userId: agentId },
    });
    if (!wallet) return;

    await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: wallet.balance.plus(amount),
        txns: {
          create: {
            amount,
            type: 'COMMISSION',
            metadata: { reason: 'Order delivered' },
          },
        },
      },
    });
  }

  private pickNearestWarehouse(warehouses: any[], lat: number, lng: number) {
    if (!warehouses.length) return null;
    const withDistance = warehouses.map((warehouse) => ({
      warehouse,
      distance: this.distanceKm(lat, lng, warehouse.latitude, warehouse.longitude),
    }));
    return withDistance.sort((a, b) => a.distance - b.distance)[0].warehouse;
  }

  private distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
