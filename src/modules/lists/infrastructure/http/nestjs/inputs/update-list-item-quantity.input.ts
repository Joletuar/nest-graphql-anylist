import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType({
  description: 'Input to update list item quantity',
})
export class UpdateListItemQuantityInput {
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

  @Field(() => Int, {
    description: 'New quantity',
    nullable: false,
  })
  quantity: number;
}
