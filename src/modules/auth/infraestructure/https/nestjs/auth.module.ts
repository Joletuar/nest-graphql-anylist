import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { SignIn } from 'src/modules/auth/application/sign-in/sign-in.use-case';
import { SignUp } from 'src/modules/auth/application/sign-up/sign-up.use-case';
import { HashRepository } from 'src/modules/auth/domain/hash.repository';
import { TokenRepository } from 'src/modules/auth/domain/token.repository';
import { UsersModule } from 'src/modules/users/infraestructure/http/nestjs/users.module';

import { BcryptHashRepository } from '../../hash/bcrypt/bcrypt-hash.repository';
import { JwtTokenRepository } from '../../token/jwt/jwt-repository.repository';
import { RolesGuard } from './guards/roles.guard';
import { TokenGuard } from './guards/token.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('SECRET_TOKEN'),
          signOptions: {
            expiresIn: '60s',
          },
        };
      },
    }),

    forwardRef(() => UsersModule),
  ],

  controllers: [],

  providers: [
    // Use cases
    SignUp,
    SignIn,

    // Repositories
    {
      provide: HashRepository,
      useClass: BcryptHashRepository,
    },
    {
      provide: TokenRepository,
      useClass: JwtTokenRepository,
    },

    // Guards
    TokenGuard,
    RolesGuard,
  ],

  exports: [TokenRepository, TokenGuard, RolesGuard],
})
export class AuthModule {}
