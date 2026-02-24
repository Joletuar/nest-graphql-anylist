import { Role } from '@users/domain/roles.enum';
import { User } from '@users/domain/user.entity';
import { ulid } from 'ulidx';

export class UserMother {
  static create(overrides: Partial<User> = {}): User {
    return {
      id: ulid(),
      fullName: 'John Doe',
      email: `john.${ulid().toLowerCase()}@mail.com`,
      password: 'hashed-password',
      roles: [Role.ADMIN],
      isActive: true,
      ...overrides,
    };
  }
}
