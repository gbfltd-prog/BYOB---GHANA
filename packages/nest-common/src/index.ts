import { createParamDecorator, ExecutionContext, Module, DynamicModule } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
  accountNo: string;
}

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user as AuthUser;
});

export class JwtAuthGuard extends AuthGuard('jwt') {}

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'dev-secret'),
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      accountNo: payload.accountNo,
    } satisfies AuthUser;
  }
}

@Module({})
export class JwtAuthModule {
  static register(): DynamicModule {
    return {
      module: JwtAuthModule,
      global: true,
      imports: [
        PassportModule,
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            secret: config.get<string>('JWT_SECRET', 'dev-secret'),
            signOptions: { expiresIn: '12h' },
          }),
        }),
      ],
      providers: [JwtStrategy],
      exports: [JwtModule, PassportModule],
    };
  }
}

export const JwtAuthImports = [ConfigModule.forRoot({ isGlobal: true }), JwtAuthModule.register()];
