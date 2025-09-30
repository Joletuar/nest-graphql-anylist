import { UserDto } from '../../user.dto';

export type UpdatedUserDto = Omit<UserDto, 'password'>;
