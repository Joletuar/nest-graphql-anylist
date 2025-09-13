import { Item } from '../domain/item.entity';
import { ItemDto } from './item.dto';

export class ItemMapper {
  static toDto(entity: Item): ItemDto {
    const { id, name, quantity, quantityUnits } = entity;

    return {
      id,
      name,
      quantity,
      quantityUnits,
    };
  }

  static toDtoList(entities: Item[]): ItemDto[] {
    return entities.map((entity) => ItemMapper.toDto(entity));
  }
}
