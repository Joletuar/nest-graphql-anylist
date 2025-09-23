import { Role } from './roles.enum';

export interface User {
  id: string;

  fullName: string;

  email: string;

  password: string;

  roles: Role[];

  isActive: boolean;
}
