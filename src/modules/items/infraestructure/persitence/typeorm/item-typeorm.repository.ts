import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Item } from 'src/modules/items/domain/item.entity';
import { ItemRepository } from 'src/modules/items/domain/item.repository';
import { Nullable } from 'src/modules/shared/domain/nullable.type';
import { BaseTypeOrmRepository } from 'src/modules/shared/infraestructure/persitence/typeorm/base-typeorm.repository';
import { TypeOrmException } from 'src/modules/shared/infraestructure/persitence/typeorm/exceptions/typeorm.exceptions';
import { Repository } from 'typeorm';

import { ItemTypeOrmMapper } from './item-typeorm.mapper';
import { ItemModel } from './item.model';

@Injectable()
export class ItemTypeOrmRepository
  extends BaseTypeOrmRepository<ItemModel>
  implements ItemRepository
{
  constructor(
    @InjectRepository(ItemModel)
    repository: Repository<ItemModel>,
  ) {
    super(repository);
  }

  async getAll(): Promise<Item[]> {
    try {
      const items = await this.getRepository().find();

      return ItemTypeOrmMapper.toDomainList(items);
    } catch (error) {
      this.handlerError(error);
    }
  }

  async findById(id: string): Promise<Nullable<Item>> {
    try {
      const item = await this.getRepository().findOneBy({
        id,
      });

      if (!item) return null;

      return ItemTypeOrmMapper.toDomain(item);
    } catch (error) {
      this.handlerError(error);
    }
  }

  protected handlerError(error: unknown): never {
    throw new TypeOrmException(error);
  }
}
