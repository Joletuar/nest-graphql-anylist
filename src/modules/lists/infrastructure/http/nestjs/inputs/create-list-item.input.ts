import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType({
  description: 'Input to create new list item',
})
export class CreateListItemInput {
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
