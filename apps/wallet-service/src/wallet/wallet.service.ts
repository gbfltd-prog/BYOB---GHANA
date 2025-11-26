import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaService, PayoutStatus } from '@byob/prisma';
import { TransferDto } from './dto/transfer.dto';
import { CreatePayoutDto } from './dto/create-payout.dto';
import { ApprovePayoutDto } from './dto/approve-payout.dto';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  getWalletByUser(userId: string) {
    return this.prisma.wallet.findUnique({ where: { userId } });
  }

  async transfer(dto: TransferDto) {
    if (dto.fromUserId === dto.toUserId) {
      throw new BadRequestException('Cannot transfer to self');
    }

    const [fromWallet, toWallet] = await Promise.all([
      this.prisma.wallet.findUnique({ where: { userId: dto.fromUserId } }),
      this.prisma.wallet.findUnique({ where: { userId: dto.toUserId } }),
    ]);

    if (!fromWallet || !toWallet) {
      throw new NotFoundException('Wallet not found');
    }

    const amount = new Prisma.Decimal(dto.amount);

    if (fromWallet.balance.lt(amount)) {
      throw new BadRequestException('Insufficient balance');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: fromWallet.id },
        data: {
          balance: fromWallet.balance.minus(amount),
          txns: {
            create: {
              amount,
              type: 'TRANSFER',
              metadata: { direction: 'OUT', toUserId: dto.toUserId },
            },
          },
        },
      });

      await tx.wallet.update({
        where: { id: toWallet.id },
        data: {
          balance: toWallet.balance.plus(amount),
          txns: {
            create: {
              amount,
              type: 'TRANSFER',
              metadata: { direction: 'IN', fromUserId: dto.fromUserId },
            },
          },
        },
      });

      return { success: true };
    });
  }

  async requestPayout(dto: CreatePayoutDto) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId: dto.userId } });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    const amount = new Prisma.Decimal(dto.amount);

    if (wallet.balance.lt(amount)) {
      throw new BadRequestException('Insufficient balance');
    }

    const requiresSuper = dto.amount > 1000;

    return this.prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: wallet.balance.minus(amount),
          txns: {
            create: {
              amount,
              type: 'PAYOUT',
              metadata: { channel: dto.channel, status: 'REQUESTED' },
            },
          },
        },
      });

      return tx.payoutRequest.create({
        data: {
          walletId: wallet.id,
          amount,
          status: PayoutStatus.REQUESTED,
          requiresSuper,
          createdBy: dto.userId,
        },
      });
    });
  }

  listPayouts() {
    return this.prisma.payoutRequest.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async updatePayoutStatus(payoutId: string, dto: ApprovePayoutDto) {
    const payout = await this.prisma.payoutRequest.findUnique({ where: { id: payoutId } });
    if (!payout) {
      throw new NotFoundException('Payout not found');
    }

    return this.prisma.payoutRequest.update({
      where: { id: payoutId },
      data: {
        status: dto.status,
        approvedBy: dto.approverId,
      },
    });
  }
}
