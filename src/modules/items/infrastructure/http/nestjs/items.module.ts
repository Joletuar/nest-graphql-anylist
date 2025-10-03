import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateItemCommandHandler } from 'src/modules/items/application/commands/create-item/create-item.command-handler';
import { UpdateItemCommandHandler } from 'src/modules/items/application/commands/update-item/update-item.command-handler';
import { FinItemByIdQueryHandler } from 'src/modules/items/application/queries/find-item-by-id/find-item-by-id.query-handler';
import { GetAllItemsQueryHandler } from 'src/modules/items/application/queries/get-all-items/get-all-items.query-handler';
import { SearchItemsByCriteriaQueryHandler } from 'src/modules/items/application/queries/search-items-by-criteria/search-items-by-criteria.query-handler';
import { ItemRepository } from 'src/modules/items/domain/item.repository';
import { UsersModule } from 'src/modules/users/infrastructure/http/nestjs/users.module';

import { ItemModel } from '../../persistence/typeorm/item.model';
import { TypeOrmItemRepository } from '../../persistence/typeorm/typeorm-item.repository';
import { ItemsResolver } from './items.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ItemModel]), UsersModule],

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
    SearchItemsByCriteriaQueryHandler,

    // Command Handlers
    CreateItemCommandHandler,
    UpdateItemCommandHandler,
  ],

  exports: [ItemRepository],
})
export class ItemsModule {}
