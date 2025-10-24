import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { prisma } from '@byob/db';

function computeCommissionForItem(price: number, quantity: number, commission: any): number {
  if (!commission) return 0;
  if (commission.type === 'PERCENT') return (price * quantity) * (commission.value / 100);
  if (commission.type === 'FLAT') return commission.value * quantity;
  return 0;
}

@Injectable()
export class OrderService {
  async create(params: { agentId: string; items: { productId: string; quantity: number; }[]; latitude: number; longitude: number; }) {
    const products = await prisma.product.findMany({ where: { id: { in: params.items.map(i => i.productId) } } });
    if (products.length !== params.items.length) throw new NotFoundException('Some products not found');

    const subtotal = params.items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId)!;
      return sum + Number(product.price) * item.quantity;
    }, 0);
    const commission = params.items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId)!;
      return sum + computeCommissionForItem(Number(product.price), item.quantity, product.commission);
    }, 0);

    // find nearest warehouse
    const warehouses = await prisma.warehouse.findMany();
    const nearest = warehouses.reduce((best, w) => {
      const d = this.distance(params.latitude, params.longitude, w.latitude, w.longitude);
      if (!best || d < best.d) return { w, d } as any;
      return best;
    }, null as any);

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          agentId: params.agentId,
          status: 'PENDING',
          warehouseId: nearest.w.id,
          subtotal,
          commission,
          total: subtotal,
          items: {
            create: params.items.map((i) => ({ productId: i.productId, quantity: i.quantity, price: products.find(p => p.id === i.productId)!.price }))
          }
        },
        include: { items: true }
      });

      // reserve inventory
      for (const i of params.items) {
        const inv = await tx.inventory.findFirst({ where: { productId: i.productId, warehouseId: nearest.w.id } });
        if (!inv || inv.quantity - inv.reserved < i.quantity) throw new NotFoundException('Insufficient stock');
        await tx.inventory.update({ where: { id: inv.id }, data: { reserved: { increment: i.quantity } } });
      }
      return created;
    });

    return order;
  }

  async confirm(orderId: string) {
    const order = await prisma.order.update({ where: { id: orderId }, data: { status: 'CONFIRMED' } });
    // credit commission to agent wallet
    try {
      const walletUrl = process.env.WALLET_URL || 'http://wallet-service:3005/api/wallet/credit-commission';
      await axios.post(walletUrl, { userId: order.agentId, amount: Number(order.commission), orderId: order.id }, { headers: { Authorization: `Bearer ${process.env.SERVICE_TOKEN || ''}` } });
    } catch (e) {
      // swallow errors but log in real impl
    }
    return order;
  }

  distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}
