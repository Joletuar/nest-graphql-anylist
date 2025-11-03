import { User } from '@modules/users/domain/user.entity';

import { Item } from '../domain/item.entity';
import { ItemDto } from './item.dto';
import { QueryItemDto } from './queries/query-item.dto';

export class ItemMapper {
  static toDto(entity: Item): ItemDto {
    const { id, name, stock, quantityUnits, userId } = entity.toPrimitives();

    return {
      id,
      name,
      stock,
      quantityUnits,
      userId,
    };
  }

  static toDtoList(entities: Item[]): ItemDto[] {
    return entities.map((entity) => ItemMapper.toDto(entity));
  }

  static toQueryDto(entity: Item, user: User): QueryItemDto {
    const { id, name, stock, quantityUnits } = entity.toPrimitives();

    return {
      id,
      name,
      stock,
      quantityUnits,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        isActive: user.isActive,
        roles: user.roles,
      },
    };
  }

  static toQueryDtoList(entities: Item[], users: User[]): QueryItemDto[] {
    return entities.map((entity) => {
      const user = users.find((u) => entity.userId.isEquals(u.id));

      if (!user) {
        throw new Error(`User with ID ${entity.userIdValue} not found`);
      }

      return ItemMapper.toQueryDto(entity, user);
    });
  }
}
