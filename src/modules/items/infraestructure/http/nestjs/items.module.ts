import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FinItemByIdQueryHandler } from 'src/modules/items/application/queries/find-item-by-id/find-item-by-id.query-handler';
import { GetAllItemsQueryHandler } from 'src/modules/items/application/queries/get-all-items/get-all-items.query-handler';
import { ItemRepository } from 'src/modules/items/domain/item.repository';

import { ItemTypeOrmRepository } from '../../persitence/typeorm/item-typeorm.repository';
import { ItemModel } from '../../persitence/typeorm/item.model';
import { ItemsResolver } from './items.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ItemModel])],

  providers: [
    ItemsResolver,

    // Repositories
    ItemTypeOrmRepository,

    {
      provide: ItemRepository,
      useClass: ItemTypeOrmRepository,
    },

    // Query Handlers
    GetAllItemsQueryHandler,
    FinItemByIdQueryHandler,
  ],
})
export class ItemsModule {}
