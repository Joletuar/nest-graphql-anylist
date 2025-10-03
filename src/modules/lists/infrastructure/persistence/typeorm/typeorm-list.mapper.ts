import { List } from 'src/modules/lists/domain/list.entity';

import { ListModel } from './list.model';
import { TypeOrmListItemMapper } from './typeorm-list-item.mapper';

export class TypeOrmListMapper {
  static async toDomain(model: ListModel): Promise<List> {
    const { id, name, userId } = model;
    const itemModels = await model.items;

    return {
      id,
      name,
      userId,
      items: TypeOrmListItemMapper.toDomainList(itemModels),
    };
  }

  static async toDomainList(models: ListModel[]): Promise<List[]> {
    return Promise.all(models.map((model) => this.toDomain(model)));
  }
}
