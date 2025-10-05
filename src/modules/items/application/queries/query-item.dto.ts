import { UserDto as BaseUserDto } from '@users/application/user.dto';

import { ItemDto } from '../item.dto';

export interface QueryItemDto extends Omit<ItemDto, 'userId'> {
  user: UserDto;
}

type UserDto = Omit<BaseUserDto, 'password'>;
