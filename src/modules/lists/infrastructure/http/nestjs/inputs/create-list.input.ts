import { Field, ID, InputType } from '@nestjs/graphql';

import { CreateListItemInput } from './create-list-item.input';

@InputType({
  description: 'Input to create new list',
})
export class CreateListInput {
  @Field(() => String, {
    description: 'List name',
    nullable: false,
  })
  name: string;

  @Field(() => ID, {
    description: 'List userId',
    nullable: false,
  })
  userId: string;

  @Field(() => [CreateListItemInput], {
    description: 'List items',
    nullable: false,
  })
  items: CreateListItemInput[];
}
