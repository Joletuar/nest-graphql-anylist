/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { Request } from 'express';
import { User } from 'src/modules/users/domain/user.entity';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req as Request;

    if (!req.user) {
      throw new ForbiddenException('User not found in request');
    }

    return req.user;
  },
);
