/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { TokenRepository } from '@auth/domain/token.repository';
import { FilterOperator } from '@shared/domain/criteria/filter-operator.enum';
import { User } from '@users/domain/user.entity';
import { UserRepository } from '@users/domain/user.repository';
import { Request } from 'express';

interface UserPayload {
  email: string;
}

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const req = gqlCtx.getContext().req as Request;
    const authorization = req.header('authorization');

    const payload = await this.ensureIsValidToken(authorization);

    const user = await this.ensureExistsUser(payload.email);

    req.user = user;

    return true;
  }

  private async ensureIsValidToken(
    authorization: string | undefined,
  ): Promise<UserPayload> {
    if (!authorization) throw new UnauthorizedException();

    const [, token] = authorization.split('Bearer ');

    if (!token) throw new UnauthorizedException();

    const payalod = await this.tokenRepository.validate<UserPayload>(token);

    return payalod;
  }

  private async ensureExistsUser(email: string): Promise<User> {
    const result = await this.userRepository.search({
      pagination: {
        perPage: 1,
        page: 1,
      },
      filters: [
        {
          field: 'email',
          value: email,
          operator: FilterOperator.EQUAL,
        },
        {
          field: 'isActive',
          value: true,
          operator: FilterOperator.EQUAL,
        },
      ],
    });

    if (result.data.length === 0) {
      throw new UnauthorizedException();
    }

    const user = result.data[0];

    return user;
  }
}
