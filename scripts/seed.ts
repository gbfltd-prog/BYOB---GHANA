import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.warehouse.createMany({
    data: [
      { name: 'Accra Central', city: 'Accra', latitude: 5.6037, longitude: -0.187 },
      { name: 'Takoradi Hub', city: 'Takoradi', latitude: 4.9045, longitude: -1.7593 },
      { name: 'Tamale Depot', city: 'Tamale', latitude: 9.4438, longitude: -0.8576 },
    ],
    skipDuplicates: true,
  });

  const passwordHash = await bcrypt.hash('ChangeMe123!', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@byob.africa' },
    update: {},
    create: {
      email: 'superadmin@byob.africa',
      passwordHash,
      ghanaCardNumber: 'GHA-0000001',
      role: UserRole.SUPER_ADMIN,
      accountNo: 'BYOB-000001',
      wallet: { create: {} },
    },
  });

  const agent = await prisma.user.upsert({
    where: { email: 'agent@byob.africa' },
    update: {},
    create: {
      email: 'agent@byob.africa',
      passwordHash,
      ghanaCardNumber: 'GHA-0000002',
      role: UserRole.AGENT,
      accountNo: 'BYOB-100001',
      wallet: { create: {} },
      agentProfile: { create: {} },
    },
  });

  const manufacturerUser = await prisma.user.upsert({
    where: { email: 'manufacturer@byob.africa' },
    update: {},
    create: {
      email: 'manufacturer@byob.africa',
      passwordHash,
      ghanaCardNumber: 'GHA-0000003',
      role: UserRole.MANUFACTURER,
      accountNo: 'BYOB-200001',
      wallet: { create: {} },
      manufacturer: {
        create: {
          businessName: 'Klloyds Manufacturing',
          verified: true,
        },
      },
    },
    include: { manufacturer: true },
  });

  let product = await prisma.product.findFirst({ where: { title: 'Organic Shea Butter' } });
  if (!product) {
    const accraWarehouse = (await prisma.warehouse.findFirst({ where: { city: 'Accra' } }))!;
    product = await prisma.product.create({
      data: {
        manufacturerId: manufacturerUser.manufacturer!.id,
        title: 'Organic Shea Butter',
        description: 'Premium shea sourced from Tamale',
        price: 150,
        commissionScheme: { create: { rules: { percentage: 0.08 } } },
        inventories: {
          create: [{ warehouseId: accraWarehouse.id, quantity: 40 }],
        },
        images: { create: { url: 'https://cdn.byob.africa/products/shea.png' } },
      },
    });
  }

  const sampleOrder = await prisma.order.findFirst({ where: { customerName: 'Ama Boateng' } });
  if (!sampleOrder) {
    await prisma.order.create({
      data: {
        agentId: agent.id,
        customerName: 'Ama Boateng',
        customerPhone: '+233555000111',
        latitude: 5.6,
        longitude: -0.18,
        warehouseId: (await prisma.warehouse.findFirst({ where: { city: 'Accra' } }))!.id,
        total: 150,
        commissionTotal: 12,
        status: 'DELIVERED',
        items: {
          create: [{ productId: product.id, quantity: 1, price: 150, commission: 12 }],
        },
      },
    });
  }

  console.log('Seed completed');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
