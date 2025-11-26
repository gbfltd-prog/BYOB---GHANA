import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterAgentDto } from './dto/register-agent.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@byob/prisma';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async registerAgent(payload: RegisterAgentDto) {
    const existing = await this.users.findByEmail(payload.email);
    if (existing) {
      throw new BadRequestException('Email already taken');
    }

    // Ghana Card verification stub
    const verified = await this.verifyGhanaCard(payload.ghanaCardNumber);
    if (!verified) {
      throw new BadRequestException('Ghana Card verification failed');
    }

    const user = await this.users.createUser({
      email: payload.email,
      password: payload.password,
      ghanaCardNumber: payload.ghanaCardNumber,
      role: 'AGENT',
    });

    return {
      token: this.signToken(user),
      user: this.sanitizeUser(user),
    };
  }

  async login(payload: LoginDto) {
    const user = await this.users.validateCredentials(payload.email, payload.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      token: this.signToken(user),
      user: this.sanitizeUser(user),
    };
  }

  private sanitizeUser(user: User) {
    const { passwordHash, ...rest } = user;
    return rest;
  }

  private signToken(user: User) {
    return this.jwt.sign({
      sub: user.id,
      role: user.role,
      email: user.email,
      accountNo: user.accountNo,
    });
  }

  private async verifyGhanaCard(ghanaCardNumber: string) {
    return ghanaCardNumber.length > 0;
  }
}
