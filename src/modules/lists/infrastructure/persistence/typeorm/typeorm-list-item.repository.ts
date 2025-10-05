import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Criteria } from 'src/modules/shared/domain/criteria/criteria.interface';
import { InfraestructureException } from 'src/modules/shared/domain/exceptions/infraestructure.exception';
import { Paginated } from 'src/modules/shared/domain/paginated.entity';
import { TypeOrmException } from 'src/modules/shared/infrastructure/persistence/typeorm/exceptions/typeorm.exception';
import { TypeOrmCriteriaConverter } from 'src/modules/shared/infrastructure/persistence/typeorm/typeorm-criteria-converter';
import { Repository } from 'typeorm';

import { ListItem } from '../../../domain/list-item.entity';
import { ListItemRepository } from '../../../domain/list-item.repository';
import { ListItemModel } from './list-item.model';
import { TypeOrmListItemMapper } from './typeorm-list-item.mapper';

@Injectable()
export class TypeOrmListItemRepository extends ListItemRepository {
  constructor(
    @InjectRepository(ListItemModel)
    private readonly repository: Repository<ListItemModel>,
  ) {
    super();
  }

  async search(criteria: Criteria): Promise<Paginated<ListItem>> {
    try {
      const where = TypeOrmCriteriaConverter.convert<ListItemModel>(criteria);

      const [models, total] = await this.repository.findAndCount(where);

      const {
        pagination: { page, perPage },
      } = criteria;

      return {
        data: TypeOrmListItemMapper.toDomainList(models),
        pagination: {
          page,
          perPage,
          total,
        },
      };
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
