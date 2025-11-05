/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenProvider } from '@modules/auth/domain/token.provider';
import { InfraestructureException } from '@shared/domain/exceptions/infraestructure.exception';

import { JwtException } from './exceptions/jwt.exception';

@Injectable()
export class JwtTokenProvider implements TokenProvider {
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
