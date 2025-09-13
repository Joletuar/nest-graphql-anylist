import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GetAllItemsQueryHandler } from '../../../application/queries/get-all-items/get-all-items.query-handler';
import { GetItemByIdQueryHandler } from '../../../application/queries/get-item-by-id/get-item-by-id.query-handler';
import { ItemModel } from '../../persitence/typeorm/item.model';
import { ItemsResolver } from './items.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ItemModel])],

  providers: [
    ItemsResolver,

    // Query Handlers
    GetAllItemsQueryHandler,
    GetItemByIdQueryHandler,
  ],
})
export class ItemsModule {}
