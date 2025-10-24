import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

class RegisterDto {
  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;

  @IsNotEmpty()
  ghanaCardNumber!: string;
}

class LoginDto {
  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register-agent')
  async register(@Body() dto: RegisterDto) {
    return this.auth.registerAgent(dto.email, dto.password, dto.ghanaCardNumber);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Get('health')
  @ApiBearerAuth()
  health() {
    return { ok: true };
  }
}
