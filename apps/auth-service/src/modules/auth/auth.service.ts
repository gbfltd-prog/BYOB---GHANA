import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prisma } from '@byob/db';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private generateAccountNo(): string {
    return 'BYOB-' + Math.floor(100000 + Math.random() * 900000).toString();
  }

  async registerAgent(email: string, password: string, ghanaCardNumber: string) {
    // Ghana card verification stub
    const ghanaVerified = true;
    if (!ghanaVerified) throw new UnauthorizedException('Ghana Card not verified');

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new UnauthorizedException('User already exists');

    const passwordHash = await this.hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: UserRole.AGENT,
        ghanaCardNumber,
        accountNo: this.generateAccountNo(),
        agentProfile: { create: {} },
        wallet: { create: { balance: 0 } },
      },
    });
    const token = await this.jwt.signAsync({ id: user.id, email: user.email, role: user.role });
    return { token, user };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = await this.jwt.signAsync({ id: user.id, email: user.email, role: user.role });
    return { token, user };
  }
}
