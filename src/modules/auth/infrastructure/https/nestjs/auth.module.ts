import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { SignIn } from 'src/modules/auth/application/sign-in/sign-in.use-case';
import { SignUp } from 'src/modules/auth/application/sign-up/sign-up.use-case';
import { AuthenticationService } from 'src/modules/auth/domain/authentication.service';
import { HashRepository } from 'src/modules/auth/domain/hash.repository';
import { TokenRepository } from 'src/modules/auth/domain/token.repository';
import { UsersModule } from 'src/modules/users/infrastructure/http/nestjs/users.module';

import { BcryptHashRepository } from '../../hash/bcrypt/bcrypt-hash.repository';
import { JwtTokenRepository } from '../../token/jwt/jwt-token-repository.repository';
import { AuthController } from './auth.controller';
import { GqlJwtAuthGuard } from './guards/gql-jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { NestAuthenticationService } from './services/nest-authentication.service';
import { JwtStrategy } from './strategies/jwt.strategy';

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
      provide: HashRepository,
      useClass: BcryptHashRepository,
    },
    {
      provide: TokenRepository,
      useClass: JwtTokenRepository,
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
