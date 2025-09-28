import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { HashRepository } from 'src/modules/auth/domain/hash.repository';
import { TokenRepository } from 'src/modules/auth/domain/token.repository';
import { CreateUserCommand } from 'src/modules/users/application/commands/create-user/create-user.command';
import { UserDto } from 'src/modules/users/application/user.dto';

import { SignUpDto } from './sign-up.dto';

@Injectable()
export class SignUp {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly hasRepository: HashRepository,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async execute(signUpDto: SignUpDto): Promise<string> {
    const hashedPassword = await this.hashPassword(signUpDto.password);

    const { fullName, email, roles } = signUpDto;

    await this.createUser({
      fullName,
      email,
      password: hashedPassword,
      roles,
    });

    const token = await this.generateToken({ email });

    return token;
  }

  private async createUser(signUpDto: SignUpDto): Promise<UserDto> {
    const { fullName, email, password, roles } = signUpDto;

    const createdUser = await this.commandBus.execute(
      new CreateUserCommand(fullName, email, password, roles, true),
    );

    return createdUser;
  }

  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = await this.hasRepository.hash(password);

    return hashedPassword;
  }

  private async generateToken(payload: { email: string }): Promise<string> {
    const token = await this.tokenRepository.generate(payload);

    return token;
  }
}
