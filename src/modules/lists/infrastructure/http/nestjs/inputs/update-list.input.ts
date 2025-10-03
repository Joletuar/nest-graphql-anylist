import { Field, ID, InputType } from '@nestjs/graphql';

import { UpdateListItemInput } from './update-list-item.input';

@InputType({
  description: 'Input to update list',
})
export class UpdateListInput {
  @Field(() => String, {
    description: 'List name',
    nullable: true,
  })
  name?: string;

  @Field(() => ID, {
    description: 'List userId',
    nullable: false,
  })
  userId: string;

  @Field(() => [UpdateListItemInput], {
    description: 'List items',
    nullable: true,
  })
  items?: UpdateListItemInput[];
}
