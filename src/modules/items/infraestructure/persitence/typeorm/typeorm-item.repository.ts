import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Item } from 'src/modules/items/domain/item.entity';
import { ItemRepository } from 'src/modules/items/domain/item.repository';
import { InfraestructureException } from 'src/modules/shared/domain/exceptions/infraestructure.exception';
import { Nullable } from 'src/modules/shared/domain/nullable.type';
import { BaseTypeOrmRepository } from 'src/modules/shared/infraestructure/persitence/typeorm/base-typeorm.repository';
import { TypeOrmException } from 'src/modules/shared/infraestructure/persitence/typeorm/exceptions/typeorm.exception';
import { Repository } from 'typeorm';

import { NotFoundItemModelException } from './exceptions/not-found-item-model.exception';
import { ItemModel } from './item.model';
import { TypeOrmItemMapper } from './typeorm-item.mapper';

@Injectable()
export class TypeOrmItemRepository
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
      const items = await this.repository.find();

      return TypeOrmItemMapper.toDomainList(items);
    } catch (error) {
      this.handlerError(error);
    }
  }

  async findById(id: string): Promise<Nullable<Item>> {
    try {
      const item = await this.repository.findOneBy({
        id,
      });

      if (!item) return null;

      return TypeOrmItemMapper.toDomain(item);
    } catch (error) {
      this.handlerError(error);
    }
  }

  async create(item: Item): Promise<Item> {
    try {
      const instance = this.repository.create(item);

      await this.repository.insert(instance);

      const createdItem = await this.repository.findOneBy({
        id: item.id,
      });

      if (!createdItem) throw new NotFoundItemModelException(item.id);

      return TypeOrmItemMapper.toDomain(createdItem);
    } catch (error) {
      this.handlerError(error);
    }
  }

  async update(item: Item): Promise<Item> {
    try {
      const itemToUpdate = await this.repository.preload(item);

      if (!itemToUpdate) throw new NotFoundItemModelException(item.id);

      await this.repository.update(itemToUpdate.id, itemToUpdate);

      const updatedItem = await this.repository.findOneBy({
        id: item.id,
      });

      if (!updatedItem) throw new NotFoundItemModelException(item.id);

      return TypeOrmItemMapper.toDomain(updatedItem);
    } catch (error) {
      this.handlerError(error);
    }
  }

  protected handlerError(error: unknown): never {
    // TODO: improve this handler exception

    if (error instanceof InfraestructureException) throw error;

    throw new TypeOrmException(error);
  }
}
