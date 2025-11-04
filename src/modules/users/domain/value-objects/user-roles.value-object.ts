import { DomainValidationException } from '@modules/shared/domain/exceptions/domain-validation.exception';
import { RootValueObject } from '@modules/shared/domain/value-objects/root.value-object';

import { Role } from '../roles.enum';
import { UserRole } from './user-role.value-object';

export class UserRoles extends RootValueObject<UserRole[]> {
  static fromPrimitives(primitives: string[]): UserRoles {
    const roles = primitives.map((role) => UserRole.fromPrimitives(role));

    return new UserRoles(roles);
  }

  constructor(value: UserRole[]) {
    super(value);
    this.ensureIsValidRoles();
  }

  override toString(): string {
    return this._value.join(', ');
  }

  toPrimitives(): Role[] {
    return this._value.map((role) => role.value);
  }

  hasRole(role: UserRole): boolean {
    return this._value.includes(role);
  }

  addRole(role: UserRole): UserRoles {
    if (!this.hasRole(role)) {
      return new UserRoles([...this._value, role]);
    }

    return this;
  }

  removeRole(role: UserRole): UserRoles {
    return new UserRoles(this._value.filter((r) => r !== role));
  }

  private ensureIsValidRoles(): void {
    this.ensureMinimumOneRole();
    this.ensureUniqueRoles();
  }

  private ensureMinimumOneRole(): void {
    if (this._value.length < 1) {
      throw new DomainValidationException([
        { cause: 'User must have at least one role.' },
      ]);
    }
  }

  private ensureUniqueRoles(): void {
    const uniqueRoles = new Set(this._value.map((role) => role.value));

    if (uniqueRoles.size !== this._value.length) {
      throw new DomainValidationException([
        { cause: 'Duplicate roles are not allowed.' },
      ]);
    }
  }
}
