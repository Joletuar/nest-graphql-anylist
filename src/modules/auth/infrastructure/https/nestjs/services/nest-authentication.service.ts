import { Injectable, UnauthorizedException } from '@nestjs/common';

import {
  AuthenticationService,
  UserTokenPayload,
} from '@modules/auth/domain/authentication.service';
import { TokenRepository } from '@modules/auth/domain/token.repository';
import { FilterOperator } from '@shared/domain/criteria/filter-operator.enum';
import { User } from '@users/domain/user.entity';
import { UserRepository } from '@users/domain/user.repository';

// TODO: implement caching for user retrieval to enhance performance

@Injectable()
export class NestAuthenticationService extends AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
  ) {
    super();
  }

  async validateToken(token: string): Promise<User> {
    const payload =
      await this.tokenRepository.validate<UserTokenPayload>(token);

    return await this.validateUserFromPayload(payload);
  }

  async validateUserFromPayload(payload: UserTokenPayload): Promise<User> {
    const result = await this.userRepository.search({
      pagination: {
        perPage: 1,
        page: 1,
      },
      filters: [
        {
          field: 'email',
          value: payload.email,
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
      throw new UnauthorizedException('User not found or inactive');
    }

    return result.data[0];
  }
}
