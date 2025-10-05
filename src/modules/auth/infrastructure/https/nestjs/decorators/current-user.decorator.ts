/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { Role } from '@modules/users/domain/roles.enum';
import { User } from '@users/domain/user.entity';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): Omit<User, 'password'> => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req as Request;

    if (!req.user) {
      throw new ForbiddenException('User not found in request');
    }

    return {
      id: req.user.id,
      email: req.user.email,
      fullName: req.user.fullName,
      isActive: req.user.isActive,
      roles: req.user.roles as Role[],
    };
  },
);
