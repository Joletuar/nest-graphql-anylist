import { UserDto } from './user.dto';

export type UserWithoutPasswordDto = Omit<UserDto, 'password'>;
