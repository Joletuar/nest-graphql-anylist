import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateItemCommandHandler } from '@items/application/commands/create-item/create-item.command-handler';
import { UpdateItemCommandHandler } from '@items/application/commands/update-item/update-item.command-handler';
import { FinItemByIdQueryHandler } from '@items/application/queries/find-item-by-id/find-item-by-id.query-handler';
import { GetAllItemsQueryHandler } from '@items/application/queries/get-all-items/get-all-items.query-handler';
import { SearchItemsByCriteriaQueryHandler } from '@items/application/queries/search-items-by-criteria/search-items-by-criteria.query-handler';
import { ItemRepository } from '@items/domain/item.repository';
import { UsersModule } from '@users/infrastructure/http/nestjs/users.module';

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
