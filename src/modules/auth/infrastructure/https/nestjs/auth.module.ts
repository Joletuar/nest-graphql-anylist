import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { SignIn } from '@auth/application/sign-in/sign-in.use-case';
import { SignUp } from '@auth/application/sign-up/sign-up.use-case';
import { AuthenticationService } from '@auth/domain/authentication.service';
import { PasswordHasherService } from '@modules/auth/domain/password-hasher.service';
import { TokenProvider } from '@modules/auth/domain/token.provider';
import { UsersModule } from '@users/infrastructure/http/nestjs/users.module';

import { BcryptPasswordHasherService } from '../../password-hasher/bcrypt/bcrypt-password-hasher.provider';
import { JwtTokenProvider } from '../../token-provider/jwt/jwt-token.provider';
import { AuthController } from './auth.controller';
import { NestAuthenticationService } from './authentication/services/nest-authentication.service';
import { JwtStrategy } from './authentication/strategies/jwt.strategy';
import { GqlJwtAuthGuard } from './guards/gql-jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('SECRET_TOKEN'),
          signOptions: {
            expiresIn: '60m',
          },
        };
      },
    }),

    forwardRef(() => UsersModule),
  ],

  controllers: [AuthController],

  providers: [
    // Use cases
    SignUp,
    SignIn,

    // Domain services
    {
      provide: AuthenticationService,
      useClass: NestAuthenticationService,
    },

    // Repositories
    {
      provide: PasswordHasherService,
      useClass: BcryptPasswordHasherService,
    },
    {
      provide: TokenProvider,
      useClass: JwtTokenProvider,
    },

    // Passport strategy
    JwtStrategy,

    // Guards
    GqlJwtAuthGuard,
    RolesGuard,
  ],

  exports: [PassportModule, JwtModule, JwtStrategy],
})
export class AuthModule {}
