import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType({
  description: 'Input to update list item',
})
export class UpdateListItemInput {
  @Field(() => ID, {
    description: 'List item id',
    nullable: false,
  })
  id: string;

  @Field(() => ID, {
    description: 'Item id',
    nullable: false,
  })
  itemId: string;

  @Field(() => Int, {
    description: 'Item quantity',
    nullable: false,
  })
  quantity: number;
}
