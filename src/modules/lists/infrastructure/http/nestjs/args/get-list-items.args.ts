import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class GetListItemsArgs {
  @Field(() => Int, {
    description: 'The page number to retrieve (starting from 1).',
    nullable: true,
    defaultValue: 1,
  })
  page: number;

  @Field(() => Int, {
    description: 'The maximum number of items to return.',
    nullable: true,
    defaultValue: 10,
  })
  limit: number;
}
