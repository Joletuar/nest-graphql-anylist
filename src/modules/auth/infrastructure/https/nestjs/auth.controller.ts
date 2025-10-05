import { Body, Controller, Post } from '@nestjs/common';

import { SignIn } from '@auth/application/sign-in/sign-in.use-case';
import { SignUp } from '@auth/application/sign-up/sign-up.use-case';

import { AuthResponseDto } from './dtos/auth-response.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signIn: SignIn,
    private readonly signUp: SignUp,
  ) {}

  @Post('sign-in')
  async login(@Body() signInDto: SignInDto): Promise<AuthResponseDto> {
    const token = await this.signIn.execute(signInDto);

    return {
      token,
    };
  }

  @Post('sign-up')
  async register(@Body() signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const token = await this.signUp.execute(signUpDto);

    return {
      token,
    };
  }
}
