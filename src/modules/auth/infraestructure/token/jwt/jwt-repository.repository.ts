/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtService } from '@nestjs/jwt';

import { TokenRespository } from 'src/modules/auth/domain/token.repository';
import { InfraestructureException } from 'src/modules/shared/domain/exceptions/infraestructure.exception';

import { JwtException } from './exceptions/jwt.exception';

export class JwtTokenRepository implements TokenRespository {
  constructor(private readonly jwtService: JwtService) {}

  async generate(payload: Record<string, any>): Promise<string> {
    try {
      const token = await this.jwtService.signAsync(payload);

      return token;
    } catch (error) {
      this.handlerError(error);
    }
  }

  async validate<T>(token: string): Promise<T> {
    try {
      const payload = (await this.jwtService.verifyAsync(token)) as T;

      return payload;
    } catch (error) {
      this.handlerError(error);
    }
  }

  private handlerError(error: unknown): never {
    if (error instanceof InfraestructureException) throw error;

    throw new JwtException(error);
  }
}
