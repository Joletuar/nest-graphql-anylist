import { UserDto } from '../../user.dto';

export type CreatedUserDto = Omit<UserDto, 'password'>;
