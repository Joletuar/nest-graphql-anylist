import { Role as UserRole } from '@users/domain/roles.enum';

export interface SignUpDto {
  fullName: string;

  email: string;

  password: string;

  roles: Role[];
}

type Role = UserRole;
