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

import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const req = gqlCtx.getContext().req;
    const user = req?.user;

    if (!user) throw new ForbiddenException("User doestn't exist in request");

    const roles = this.reflector.getAllAndOverride<string[]>(Roles, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!roles || roles.length === 0) return false;

    this.ensureUserHasEnoughRoles(user.roles, roles);

    return true;
  }

  private ensureUserHasEnoughRoles(userRoles: string[], roles: string[]): void {
    const hasEnoughRoles = roles.some((role) =>
      userRoles.some((userRole) => userRole === role),
    );

    if (!hasEnoughRoles) throw new ForbiddenException();
  }
}
