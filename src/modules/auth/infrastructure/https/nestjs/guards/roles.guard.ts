/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { Role } from 'src/modules/users/domain/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const req = gqlCtx.getContext().req;
    const user = req?.user;

    if (!user) throw new ForbiddenException("User doestn't exist in request");

    const roles = this.reflector.get<string[]>(Role, ctx.getClass());

    this.ensureUserHasEnoughRoles(user.roles, roles);

    return true;
  }

  private ensureUserHasEnoughRoles(userRoles: string[], roles: string[]): void {
    const hasEnoughRoles = roles.every((role) =>
      userRoles.some((userRole) => userRole === role),
    );

    if (!hasEnoughRoles) throw new ForbiddenException();
  }
}
