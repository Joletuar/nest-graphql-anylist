import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateItemCommandHandler } from 'src/modules/items/application/commands/create-item/create-item.command-handler';
import { UpdateItemCommandHandler } from 'src/modules/items/application/commands/update-item/update-item.command-handler';
import { FinItemByIdQueryHandler } from 'src/modules/items/application/queries/find-item-by-id/find-item-by-id.query-handler';
import { GetAllItemsQueryHandler } from 'src/modules/items/application/queries/get-all-items/get-all-items.query-handler';
import { ItemRepository } from 'src/modules/items/domain/item.repository';

import { ItemModel } from '../../persitence/typeorm/item.model';
import { TypeOrmItemRepository } from '../../persitence/typeorm/typeorm-item.repository';
import { ItemsResolver } from './items.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ItemModel])],

  providers: [
    // Resolvers
    ItemsResolver,

    // Repositories
    TypeOrmItemRepository,

    {
      provide: ItemRepository,
      useClass: TypeOrmItemRepository,
    },

    // Query Handlers
    GetAllItemsQueryHandler,
    FinItemByIdQueryHandler,

    // Command Handlers
    CreateItemCommandHandler,
    UpdateItemCommandHandler,
  ],
})
export class ItemsModule {}
