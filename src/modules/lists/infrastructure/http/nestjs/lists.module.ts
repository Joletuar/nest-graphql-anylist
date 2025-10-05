import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemsModule } from 'src/modules/items/infrastructure/http/nestjs/items.module';
import { AddItemToListCommandHandler } from 'src/modules/lists/application/commands/add-item-to-list/add-item-to-list.command-handler';
import { CreateListCommandHandler } from 'src/modules/lists/application/commands/create-list/create-list.command-handler';
import { RemoveItemFromListCommandHandler } from 'src/modules/lists/application/commands/remove-item-from-list/remove-item-from-list.command-handler';
import { UpdateListItemQuantityCommandHandler } from 'src/modules/lists/application/commands/update-list-item-quantity/update-list-item-quantity.command-handler';
import { UpdateListCommandHandler } from 'src/modules/lists/application/commands/update-list/update-list.command-handler';
import { FindListByIdQueryHandler } from 'src/modules/lists/application/queries/find-list-by-id/find-list-by-id.query-handler';
import { GetAllListsQueryHandler } from 'src/modules/lists/application/queries/get-all-lists/get-all-lists.query-handler';
import { SearchListItemsByCriteriaQueryHandler } from 'src/modules/lists/application/queries/search-list-items-by-criteria/search-list-items-by-criteria.query-handler';
import { FindListByIdService } from 'src/modules/lists/application/services/find-list-by-id.service';
import { ListItemRepository } from 'src/modules/lists/domain/list-item.repository';
import { ListRespository } from 'src/modules/lists/domain/list.repository';
import { UsersModule } from 'src/modules/users/infrastructure/http/nestjs/users.module';

import { ListItemModel } from '../../persistence/typeorm/list-item.model';
import { ListModel } from '../../persistence/typeorm/list.model';
import { TypeOrmListItemRepository } from '../../persistence/typeorm/typeorm-list-item.repository';
import { TypeOrmListRepository } from '../../persistence/typeorm/typeorm-list.repository';
import { ListItemsResolver } from './list-items.resolver';
import { ListsResolver } from './lists.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([ListModel, ListItemModel]),
    UsersModule,
    ItemsModule,
  ],

  providers: [
    // Resolvers
    ListsResolver,
    ListItemsResolver,

    // Repositories
    TypeOrmListRepository,
    TypeOrmListItemRepository,

    // Services
    FindListByIdService,

    {
      provide: ListRespository,
      useClass: TypeOrmListRepository,
    },

    {
      provide: ListItemRepository,
      useClass: TypeOrmListItemRepository,
    },

    // Query Handlers
    GetAllListsQueryHandler,
    FindListByIdQueryHandler,
    SearchListItemsByCriteriaQueryHandler,

    // Command Handlers
    CreateListCommandHandler,
    UpdateListCommandHandler,
    AddItemToListCommandHandler,
    RemoveItemFromListCommandHandler,
    UpdateListItemQuantityCommandHandler,
  ],
})
export class ListsModule {}
