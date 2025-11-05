import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { PasswordHasherService } from '@modules/auth/domain/password-hasher.service';
import { TokenProvider } from '@modules/auth/domain/token.provider';
import { UserWithoutPasswordDto } from '@modules/users/application/user-without-password.dto';
import { CreateUserCommand } from '@users/application/commands/create-user/create-user.command';

import { SignUpDto } from './sign-up.dto';

@Injectable()
export class SignUp {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly passwordHasherService: PasswordHasherService,
    private readonly tokenProvider: TokenProvider,
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

  private async createUser(
    signUpDto: SignUpDto,
  ): Promise<UserWithoutPasswordDto> {
    const { fullName, email, password, roles } = signUpDto;

    const createdUser = await this.commandBus.execute(
      new CreateUserCommand({
        fullName,
        email,
        password,
        roles,
        isActive: true,
      }),
    );

    return createdUser;
  }

  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = await this.passwordHasherService.hash(password);

    return hashedPassword;
  }

  private async generateToken(payload: { email: string }): Promise<string> {
    const token = await this.tokenProvider.generate(payload);

    return token;
  }
}
