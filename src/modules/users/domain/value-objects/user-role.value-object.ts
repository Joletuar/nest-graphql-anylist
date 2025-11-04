import { DomainValidationException } from '@modules/shared/domain/exceptions/domain-validation.exception';
import { RootValueObject } from '@modules/shared/domain/value-objects/root.value-object';

import { Role } from '../roles.enum';

export class UserRole extends RootValueObject<Role> {
  static readonly VALID_ROLES = Object.values(Role);
  private readonly VALID_ROLES = Object.values(Role);

  static fromPrimitives(value: string): UserRole {
    if (!this.VALID_ROLES.includes(value as Role)) {
      throw new DomainValidationException([
        {
          cause: `Invalid user role, must be one of: ${this.VALID_ROLES.join(', ')}`,
        },
      ]);
    }

    return new UserRole(Role[value as keyof typeof Role]);
  }

  constructor(value: Role) {
    super(value);
    this.ensureIsValidRole();
  }

  override toString(): string {
    return this._value.toString();
  }

  isAdmin(): boolean {
    return this._value === Role.ADMIN;
  }

  isGuest(): boolean {
    return this._value === Role.GUEST;
  }

  private ensureIsValidRole(): void {
    if (!this.VALID_ROLES.includes(this._value)) {
      throw new DomainValidationException([
        {
          cause: `Invalid user role, must be one of: ${this.VALID_ROLES.join(', ')}`,
        },
      ]);
    }
  }
}
