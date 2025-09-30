import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/modules/users/domain/user.entity';

import {
  AuthenticationService,
  UserTokenPayload,
} from '../../../../domain/authentication.service';

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

  async validate(payload: UserTokenPayload): Promise<User> {
    try {
      return await this.authenticationService.validateUserFromPayload(payload);
    } catch {
      throw new UnauthorizedException('Invalid token or user not found');
    }
  }
}
