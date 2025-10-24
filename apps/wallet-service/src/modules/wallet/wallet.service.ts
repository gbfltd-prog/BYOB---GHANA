import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@byob/db';

@Injectable()
export class WalletService {
  async me(userId: string) {
    const wallet = await prisma.wallet.findUnique({ where: { userId }, include: { txns: true } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async transfer(fromUserId: string, toUserEmail: string, amount: number) {
    if (amount <= 0) throw new ForbiddenException('Invalid amount');
    const toUser = await prisma.user.findUnique({ where: { email: toUserEmail } });
    if (!toUser) throw new NotFoundException('Recipient not found');
    return prisma.$transaction(async (tx) => {
      const fromWallet = await tx.wallet.findUnique({ where: { userId: fromUserId } });
      const toWallet = await tx.wallet.findUnique({ where: { userId: toUser.id } });
      if (!fromWallet || !toWallet) throw new NotFoundException('Wallet missing');
      if (Number(fromWallet.balance) < amount) throw new ForbiddenException('Insufficient balance');
      await tx.wallet.update({ where: { id: fromWallet.id }, data: { balance: { decrement: amount }, txns: { create: { amount: -amount, type: 'TRANSFER_OUT' } } } });
      await tx.wallet.update({ where: { id: toWallet.id }, data: { balance: { increment: amount }, txns: { create: { amount: amount, type: 'TRANSFER_IN' } } } });
      return { ok: true };
    });
  }

  async requestPayout(userId: string, amount: number) {
    if (amount <= 0) throw new ForbiddenException('Invalid amount');
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (Number(wallet.balance) < amount) throw new ForbiddenException('Insufficient balance');
    return prisma.$transaction(async (tx) => {
      await tx.wallet.update({ where: { id: wallet.id }, data: { balance: { decrement: amount }, txns: { create: { amount: -amount, type: 'PAYOUT', note: 'Payout requested' } } } });
      const payout = await tx.payoutRequest.create({ data: { walletId: wallet.id, amount } });
      return payout;
    });
  }

  async approvePayout(payoutId: string, approverId: string, approverRole: string) {
    const payout = await prisma.payoutRequest.findUnique({ where: { id: payoutId } });
    if (!payout) throw new NotFoundException('Payout not found');
    const amount = Number(payout.amount);
    // Enforce: payouts over GHS 1000 require SUPERADMIN approval
    if (amount > 1000 && approverRole !== 'SUPERADMIN') {
      throw new ForbiddenException('Only SuperAdmin can approve payouts over GHS 1000');
    }
    // Admin or SuperAdmin can approve smaller payouts
    const updated = await prisma.payoutRequest.update({ where: { id: payoutId }, data: { status: 'APPROVED', approvedBy: approverId } });
    return updated;
  }

  async rejectPayout(payoutId: string, approverId: string, _approverRole: string) {
    const payout = await prisma.payoutRequest.update({ where: { id: payoutId }, data: { status: 'REJECTED', approvedBy: approverId } });
    // refund
    await prisma.wallet.update({ where: { id: payout.walletId }, data: { balance: { increment: Number(payout.amount) }, txns: { create: { amount: Number(payout.amount), type: 'TRANSFER_IN', note: 'Payout rejected refund' } } } });
    return payout;
  }

  async creditCommission(userId: string, amount: number, orderId: string) {
    return prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet) throw new NotFoundException('Wallet not found');
      await tx.wallet.update({ where: { id: wallet.id }, data: { balance: { increment: amount }, txns: { create: { amount, type: 'COMMISSION_CREDIT', note: `Order ${orderId}` } } } });
      return { ok: true };
    });
  }
}
