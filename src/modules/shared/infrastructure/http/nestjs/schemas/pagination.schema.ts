import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'Pagination info',
})
export class PaginationSchema {
  @Field(() => Int, {
    description: 'Current page number',
    nullable: false,
  })
  page: number;

  @Field(() => Int, {
    description: 'Number of items per page',
    nullable: false,
  })
  perPage: number;

  @Field(() => Int, {
    description: 'Total number of items',
    nullable: false,
  })
  total: number;
}
