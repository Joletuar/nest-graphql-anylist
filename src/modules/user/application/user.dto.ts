export interface UserDto {
  id: string;

  fullName: string;

  email: string;

  password: string;

  roles: string[];

  isActive: boolean;
}
