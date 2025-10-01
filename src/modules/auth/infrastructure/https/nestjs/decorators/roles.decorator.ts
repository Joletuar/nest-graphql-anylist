import { Reflector } from '@nestjs/core';

import { Role } from 'src/modules/users/domain/roles.enum';

export const Roles = Reflector.createDecorator<Role[]>();
