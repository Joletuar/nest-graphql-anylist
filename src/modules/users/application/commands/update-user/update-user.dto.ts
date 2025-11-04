export interface UpdateUserDto {
  readonly id: string;
  readonly fullName?: string;
  readonly email?: string;
  readonly roles?: string[];
  readonly isActive?: boolean;
}
