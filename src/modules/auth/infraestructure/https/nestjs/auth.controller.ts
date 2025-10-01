import { Body, Controller, Post } from '@nestjs/common';

import { SignIn } from 'src/modules/auth/application/sign-in/sign-in.use-case';
import { SignUp } from 'src/modules/auth/application/sign-up/sign-up.use-case';

import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signIn: SignIn,
    private readonly signUp: SignUp,
  ) {}

  @Post('sign-in')
  async login(@Body() signInDto: SignInDto): Promise<string> {
    const token = await this.signIn.execute(signInDto);

    return token;
  }

  @Post('sign-up')
  async register(@Body() signUpDto: SignUpDto): Promise<string> {
    const token = await this.signUp.execute(signUpDto);

    return token;
  }
}
