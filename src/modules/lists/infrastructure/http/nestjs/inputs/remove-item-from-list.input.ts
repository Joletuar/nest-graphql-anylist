import { Field, ID, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Input to remove item from list',
})
export class RemoveItemFromListInput {
  @Field(() => ID, {
    description: 'List id',
    nullable: false,
  })
  listId: string;

  @Field(() => ID, {
    description: 'Item id',
    nullable: false,
  })
  itemId: string;
}
