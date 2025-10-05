import { Injectable } from '@nestjs/common';

import { FilterOperator } from '@shared/domain/criteria/filter-operator.enum';
import { User } from '@users/domain/user.entity';
import { UserRepository } from '@users/domain/user.repository';

import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception';
import { HashRepository } from '../../domain/hash.repository';
import { TokenRepository } from '../../domain/token.repository';
import { SignInDto } from './sign-in.dto';

@Injectable()
export class SignIn {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashRepository: HashRepository,

    private readonly tokenRepository: TokenRepository,
  ) {}

  async execute(signInDto: SignInDto): Promise<string> {
    const userDto = await this.ensureExistsUser(signInDto.email);

    await this.ensureHasCorrectPassword(
      userDto.password,
      signInDto.password,
      signInDto.email,
    );

    await this.ensureExistsUser(signInDto.email);

    const token = await this.generateToken({ email: userDto.email });

    return token;
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
      ],
    });

    if (result.data.length === 0) {
      throw new InvalidCredentialsException(email);
    }

    const user = result.data[0];

    return user;
  }

  private async ensureHasCorrectPassword(
    hashedPassword: string,
    originalPassword: string,
    email: string,
  ): Promise<void> {
    const isValid = await this.hashRepository.validate(
      hashedPassword,
      originalPassword,
    );

    if (!isValid) {
      throw new InvalidCredentialsException(email);
    }
  }

  private async generateToken(payload: { email: string }): Promise<string> {
    const token = await this.tokenRepository.generate(payload);

    return token;
  }
}
