import { PrismaClient, UserRole, PayoutStatus, OrderStatus } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

function ghAccountNo(): string {
  return 'BYOB-' + Math.floor(100000 + Math.random() * 900000).toString();
}

async function main() {
  // Users
  const superadmin = await prisma.user.upsert({
    where: { email: 'superadmin@byob.local' },
    update: {},
    create: {
      email: 'superadmin@byob.local',
      passwordHash: 'x',
      role: UserRole.SUPERADMIN,
      ghanaCardNumber: 'GHA-000000000-0',
      accountNo: ghAccountNo(),
      wallet: { create: { balance: 0 } }
    }
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@byob.local' },
    update: {},
    create: {
      email: 'admin@byob.local',
      passwordHash: 'x',
      role: UserRole.ADMIN,
      ghanaCardNumber: 'GHA-000000001-1',
      accountNo: ghAccountNo(),
      wallet: { create: { balance: 0 } }
    }
  });

  const manufacturerUser = await prisma.user.upsert({
    where: { email: 'manufacturer@byob.local' },
    update: {},
    create: {
      email: 'manufacturer@byob.local',
      passwordHash: 'x',
      role: UserRole.MANUFACTURER,
      ghanaCardNumber: 'GHA-000000002-2',
      accountNo: ghAccountNo(),
      manufacturerProfile: { create: { businessName: 'Klloyds Manufacturing' } },
      wallet: { create: { balance: 0 } }
    }
  });

  const agent = await prisma.user.upsert({
    where: { email: 'agent@byob.local' },
    update: {},
    create: {
      email: 'agent@byob.local',
      passwordHash: 'x',
      role: UserRole.AGENT,
      ghanaCardNumber: 'GHA-000000010-0',
      accountNo: ghAccountNo(),
      agentProfile: { create: { supervisorId: admin.id } },
      wallet: { create: { balance: 0 } }
    }
  });

  // Warehouses
  const accra = await prisma.warehouse.upsert({
    where: { id: 'accra' },
    update: {},
    create: {
      id: 'accra',
      name: 'Accra Warehouse',
      latitude: 5.6037,
      longitude: -0.1870
    }
  });
  const takoradi = await prisma.warehouse.upsert({
    where: { id: 'takoradi' },
    update: {},
    create: {
      id: 'takoradi',
      name: 'Takoradi Warehouse',
      latitude: 4.9040,
      longitude: -1.7554
    }
  });
  const tamale = await prisma.warehouse.upsert({
    where: { id: 'tamale' },
    update: {},
    create: {
      id: 'tamale',
      name: 'Tamale Warehouse',
      latitude: 9.4075,
      longitude: -0.8533
    }
  });

  // Products
  const product1 = await prisma.product.create({
    data: {
      manufacturerId: manufacturerUser.manufacturerProfile!.id,
      title: 'Solar Lamp',
      description: 'Durable solar lamp with phone charger',
      price: 150.00,
      commission: { type: 'PERCENT', value: 10 },
      images: { create: [{ url: 'https://placehold.co/600x400?text=Solar+Lamp' }] },
      inventory: {
        create: [
          { warehouseId: accra.id, quantity: 50 },
          { warehouseId: takoradi.id, quantity: 30 },
          { warehouseId: tamale.id, quantity: 20 }
        ]
      }
    }
  });

  const product2 = await prisma.product.create({
    data: {
      manufacturerId: manufacturerUser.manufacturerProfile!.id,
      title: 'Water Filter',
      description: 'Household water filtration system',
      price: 300.00,
      commission: { type: 'FLAT', value: 25 },
      images: { create: [{ url: 'https://placehold.co/600x400?text=Water+Filter' }] },
      inventory: {
        create: [
          { warehouseId: accra.id, quantity: 40 },
          { warehouseId: takoradi.id, quantity: 25 },
          { warehouseId: tamale.id, quantity: 15 }
        ]
      }
    }
  });

  // Conversation sample
  const conversation = await prisma.conversation.create({
    data: {
      agentId: agent.id,
      messages: {
        create: [
          { senderId: agent.id, content: 'Hello! Are you interested in our solar lamp?' },
          { senderId: agent.id, content: 'It can also charge your phone.' }
        ]
      }
    }
  });

  console.log('Seeded:', { superadmin: superadmin.email, admin: admin.email, agent: agent.email, manufacturer: manufacturerUser.email, products: [product1.title, product2.title], conversation: conversation.id });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
