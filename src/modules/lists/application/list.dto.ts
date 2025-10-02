import { ListItemDto } from './list-item.dto';
import { UserDto } from './user.dto';

export interface ListDto {
  id: string;

  name: string;

  user: UserDto;

  items: ListItemDto[];
}
