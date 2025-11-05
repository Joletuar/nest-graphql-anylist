/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { Role } from '@modules/users/domain/roles.enum';
import { UserPrimitives } from '@users/domain/user.entity';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): Omit<UserPrimitives, 'password'> => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req as Request;

    if (!req.user) {
      throw new ForbiddenException('User not found in request');
    }

    const user = req.user;

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive,
      roles: user.roles as Role[],
    };
  },
);
