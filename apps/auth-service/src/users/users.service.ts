import { Injectable } from '@nestjs/common';
import { PrismaService, UserRole } from '@byob/prisma';
import * as bcrypt from 'bcryptjs';

export interface CreateUserPayload {
  email: string;
  password: string;
  ghanaCardNumber: string;
  role: UserRole;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(payload: CreateUserPayload) {
    const passwordHash = await bcrypt.hash(payload.password, 10);
    const accountNo = `BYOB-${Math.floor(Math.random() * 1_000_000)
      .toString()
      .padStart(6, '0')}`;

    return this.prisma.user.create({
      data: {
        email: payload.email,
        passwordHash,
        ghanaCardNumber: payload.ghanaCardNumber,
        role: payload.role,
        accountNo,
        wallet: { create: {} },
        agentProfile:
          payload.role === 'AGENT'
            ? {
                create: {
                  totalCommission: 0,
                },
              }
            : undefined,
        manufacturer:
          payload.role === 'MANUFACTURER'
            ? {
                create: {
                  businessName: `${payload.email.split('@')[0]} Ventures`,
                  verified: false,
                },
              }
            : undefined,
      },
      include: {
        agentProfile: true,
        manufacturer: true,
        wallet: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async validateCredentials(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  }
}
