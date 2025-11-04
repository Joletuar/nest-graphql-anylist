import { Primitives } from '@modules/shared/domain/primitves.type';
import { RootAggregate } from '@modules/shared/domain/root.aggegate';

import { UserIsNotAdminException } from './exceptions/user-is-not-admin.exception';
import { Role } from './roles.enum';
import { UserEmail } from './value-objects/user-email.value-object';
import { UserFullName } from './value-objects/user-full-name.value-object';
import { UserId } from './value-objects/user-id.value-object';
import { UserIsActive } from './value-objects/user-is-active.value-object';
import { UserPassword } from './value-objects/user-password.value-object';
import { UserRole } from './value-objects/user-role.value-object';
import { UserRoles } from './value-objects/user-roles.value-object';

type UserProps = {
  id: UserId;

  fullName: UserFullName;

  email: UserEmail;

  password: UserPassword;

  roles: UserRoles;

  isActive: UserIsActive;
};

type UserPrimitives = Omit<Primitives<UserProps>, 'roles'> & {
  roles: Role[];
};

export class User extends RootAggregate {
  static fromPrimitives(
    primitives: Omit<UserPrimitives, 'roles'> & { roles: string[] },
  ): User {
    const { id, fullName, email, password, roles, isActive } = primitives;

    return new this({
      id: new UserId(id),
      fullName: new UserFullName(fullName),
      email: new UserEmail(email),
      password: new UserPassword(password),
      roles: UserRoles.fromPrimitives(roles),
      isActive: new UserIsActive(isActive),
    });
  }

  constructor(readonly props: UserProps) {
    super();
  }

  override toPrimitives(): UserPrimitives {
    const { id, fullName, email, password, roles, isActive } = this.props;

    return {
      id: id.value,
      fullName: fullName.value,
      email: email.value,
      password: password.value,
      roles: roles.toPrimitives(),
      isActive: isActive.value,
    };
  }

  get id(): UserId {
    return this.props.id;
  }

  get idValue(): string {
    return this.props.id.value;
  }

  updateFullName(fullName: UserFullName): void;
  updateFullName(fullName: string): void;
  updateFullName(fullName: UserFullName | string): void {
    if (fullName instanceof UserFullName) {
      this.props.fullName = fullName;

      return;
    }

    this.props.fullName = new UserFullName(fullName);
  }

  updatePassword(password: UserPassword): void;
  updatePassword(password: string): void;
  updatePassword(password: UserPassword | string): void {
    if (password instanceof UserPassword) {
      this.props.password = password;

      return;
    }

    this.props.password = new UserPassword(password);
  }

  updateEmail(email: UserEmail): void;
  updateEmail(email: string): void;
  updateEmail(email: UserEmail | string): void {
    if (email instanceof UserEmail) {
      this.props.email = email;

      return;
    }

    this.props.email = new UserEmail(email);
  }

  updateRoles(roles: UserRoles): void;
  updateRoles(roles: Role[]): void;
  updateRoles(roles: string[]): void;
  updateRoles(roles: UserRoles | Role[] | string[]): void {
    if (!this.isAdmin()) {
      throw new UserIsNotAdminException('Only admins can update user roles');
    }

    if (roles instanceof UserRoles) {
      this.props.roles = roles;

      return;
    }

    this.props.roles = UserRoles.fromPrimitives(
      (roles as (Role | string)[]).map((role) => role),
    );
  }

  addRole(role: Role): void;
  addRole(role: UserRole): void;
  addRole(role: string): void;
  addRole(role: Role | UserRole | string): void {
    if (!this.isAdmin()) {
      throw new UserIsNotAdminException('Only admins can add user roles');
    }

    if (role instanceof UserRole) {
      this.props.roles.addRole(role);

      return;
    }

    if (typeof role === 'string') {
      this.props.roles.addRole(UserRole.fromPrimitives(role));

      return;
    }

    this.props.roles.addRole(new UserRole(role));
  }

  updateIsActive(isActive: UserIsActive): void;
  updateIsActive(isActive: boolean): void;
  updateIsActive(isActive: UserIsActive | boolean): void {
    if (isActive instanceof UserIsActive) {
      this.props.isActive = isActive;

      return;
    }

    if (isActive) {
      this.activate();

      return;
    }

    this.deactivate();
  }

  activate(): void {
    if (this.props.isActive.value) return;

    if (!this.isAdmin()) {
      throw new UserIsNotAdminException('Only admins can activate a user');
    }

    this.props.isActive = new UserIsActive(true);
  }

  deactivate(): void {
    if (!this.props.isActive.value) return;

    if (!this.isAdmin()) {
      throw new UserIsNotAdminException('Only admins can deactivate a user');
    }

    this.props.isActive = new UserIsActive(false);
  }

  private isAdmin(): boolean {
    return this.props.roles.hasRole(new UserRole(Role.ADMIN));
  }
}
