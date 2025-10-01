/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { applyDecorators, UseGuards } from '@nestjs/common';

import { Role } from 'src/modules/users/domain/roles.enum';

import { GqlJwtAuthGuard } from '../guards/gql-jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';

export const Auth = (...roles: Role[]) => {
  return applyDecorators(Roles(roles), UseGuards(GqlJwtAuthGuard, RolesGuard));
};
