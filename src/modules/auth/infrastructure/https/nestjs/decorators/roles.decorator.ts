import { Reflector } from '@nestjs/core';

import { Role } from '@users/domain/roles.enum';

export const Roles = Reflector.createDecorator<Role[]>();
