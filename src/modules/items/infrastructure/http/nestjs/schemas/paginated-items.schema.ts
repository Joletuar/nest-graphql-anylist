import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationSchema } from '@shared/infrastructure/http/nestjs/schemas/pagination.schema';

import { QueryItemSchema } from './query-item.schema';

@ObjectType({ description: 'Paginated items' })
export class PaginatedItemsSchema {
  @Field(() => [QueryItemSchema], {
    description: 'Items list',
    nullable: false,
  })
  items: QueryItemSchema[];

  @Field(() => PaginationSchema, {
    description: 'Pagination info',
    nullable: false,
  })
  pagination: PaginationSchema;
}
