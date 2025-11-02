import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import {
  AuthenticationService,
  UserTokenPayload,
} from '@modules/auth/domain/authentication.service';
import { User } from '@users/domain/user.entity';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authenticationService: AuthenticationService,
    readonly configService: ConfigService,
  ) {
    const secretOrKey = configService.get<string>('SECRET_TOKEN');

    if (!secretOrKey) {
      throw new Error('SECRET_TOKEN is required for JWT strategy');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate(payload: UserTokenPayload): Promise<Omit<User, 'password'>> {
    try {
      const user =
        await this.authenticationService.validateUserFromPayload(payload);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch {
      throw new UnauthorizedException('Invalid token or user not found');
    }
  }
}
