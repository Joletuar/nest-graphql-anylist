import { Field, InputType, Int } from '@nestjs/graphql';

@InputType({
  description: 'Pagination input',
})
export class PaginationInput {
  @Field(() => Int, {
    nullable: true,
    defaultValue: 1,
  })
  page: number;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 10,
  })
  perPage: number;
}
