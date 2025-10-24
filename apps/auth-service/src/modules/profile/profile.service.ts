import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@byob/db';

@Injectable()
export class ProfileService {
  async me(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { agentProfile: true, manufacturerProfile: true, wallet: true } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateStorefront(userId: string, data: { storefrontColor?: string; storefrontBannerUrl?: string; storefrontSlogan?: string; }) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== 'AGENT') throw new NotFoundException('Only agents have storefront');
    const prof = await prisma.agentProfile.update({ where: { userId }, data });
    return prof;
  }
}
