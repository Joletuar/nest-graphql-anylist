import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { List } from 'src/modules/lists/domain/list.entity';
import { ListRespository } from 'src/modules/lists/domain/list.repository';
import { InfraestructureException } from 'src/modules/shared/domain/exceptions/infraestructure.exception';
import { Nullable } from 'src/modules/shared/domain/nullable.type';
import { BaseTypeOrmRepository } from 'src/modules/shared/infrastructure/persistence/typeorm/base-typeorm.repository';
import { TypeOrmException } from 'src/modules/shared/infrastructure/persistence/typeorm/exceptions/typeorm.exception';
import { Repository } from 'typeorm';

import { NotFoundListModelException } from './exceptions/not-found-list-model.exception';
import { ListItemModel } from './list-item.model';
import { ListModel } from './list.model';
import { TypeOrmListMapper } from './typeorm-list.mapper';

@Injectable()
export class TypeOrmListRepository
  extends BaseTypeOrmRepository<ListModel>
  implements ListRespository
{
  constructor(
    @InjectRepository(ListModel)
    repository: Repository<ListModel>,
  ) {
    super(repository);
  }

  async getAll(): Promise<List[]> {
    try {
      const lists = await this.repository.find({
        relations: {
          items: true,
        },
      });

      return await TypeOrmListMapper.toDomainList(lists);
    } catch (error) {
      this.handlerError(error);
    }
  }

  async findById(id: string): Promise<Nullable<List>> {
    try {
      const list = await this.repository.findOne({
        where: { id },
        relations: {
          items: true,
        },
      });

      if (!list) return null;

      return await TypeOrmListMapper.toDomain(list);
    } catch (error) {
      this.handlerError(error);
    }
  }

  async create(list: List): Promise<List> {
    try {
      const queryRunner = this.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Create the list
        const listInstance = this.repository.create({
          id: list.id,
          name: list.name,
          userId: list.userId,
        });

        await queryRunner.manager.insert(ListModel, listInstance);

        // Create list items if any
        if (list.items && list.items.length > 0) {
          const listItemInstances = list.items.map((item) =>
            queryRunner.manager.getRepository(ListItemModel).create({
              id: item.id,
              listId: list.id,
              itemId: item.itemId,
              quantity: item.quantity,
            }),
          );

          await queryRunner.manager.insert(ListItemModel, listItemInstances);
        }

        await queryRunner.commitTransaction();

        const createdList = await this.repository.findOne({
          where: { id: list.id },
          relations: {
            items: true,
          },
        });

        if (!createdList) throw new NotFoundListModelException(list.id);

        return await TypeOrmListMapper.toDomain(createdList);
      } catch (error) {
        await queryRunner.rollbackTransaction();

        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      this.handlerError(error);
    }
  }

  async update(list: List): Promise<List> {
    try {
      const queryRunner = this.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Update the list
        const listToUpdate = await this.repository.preload({
          id: list.id,
          name: list.name,
          userId: list.userId,
        });

        if (!listToUpdate) throw new NotFoundListModelException(list.id);

        await queryRunner.manager.update(ListModel, list.id, listToUpdate);

        // Delete existing list items
        await queryRunner.manager.delete(ListItemModel, { listId: list.id });

        // Create new list items if any
        if (list.items && list.items.length > 0) {
          const listItemInstances = list.items.map((item) =>
            queryRunner.manager.getRepository(ListItemModel).create({
              id: item.id,
              listId: list.id,
              itemId: item.itemId,
              quantity: item.quantity,
            }),
          );

          await queryRunner.manager.insert(ListItemModel, listItemInstances);
        }

        await queryRunner.commitTransaction();

        const updatedList = await this.repository.findOne({
          where: { id: list.id },
          relations: {
            items: true,
          },
        });

        if (!updatedList) throw new NotFoundListModelException(list.id);

        return await TypeOrmListMapper.toDomain(updatedList);
      } catch (error) {
        await queryRunner.rollbackTransaction();

        throw error;
      } finally {
        await queryRunner.release();
      }
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
