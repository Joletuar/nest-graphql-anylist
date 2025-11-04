export interface CreateUserDto {
  readonly fullName: string;
  readonly email: string;
  readonly password: string;
  readonly roles: string[];
  readonly isActive: boolean;
}
