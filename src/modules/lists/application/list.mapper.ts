import { List } from '../domain/list.entity';
import { ListDto } from './list.dto';

export class ListMapper {
  static toDto(list: List): ListDto {
    return {
      id: list.id,
      name: list.name,
      userId: list.userId,
    };
  }

  static toDtoList(lists: List[]): ListDto[] {
    return lists.map((list) => this.toDto(list));
  }
}
