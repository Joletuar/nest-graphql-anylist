import { Role as UserRole } from 'src/modules/users/domain/roles.enum';

export interface SignUpDto {
  fullName: string;

  email: string;

  password: string;

  roles: Role[];
}

type Role = UserRole;
