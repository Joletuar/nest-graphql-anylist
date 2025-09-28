/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { applyDecorators, UseGuards } from '@nestjs/common';

import { RolesGuard } from '../guards/roles.guard';
import { TokenGuard } from '../guards/token.guard';
import { Roles } from './roles.decorator';

export const Auth = (...roles: string[]) =>
  applyDecorators(Roles(...roles), UseGuards(TokenGuard, RolesGuard));
