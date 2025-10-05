import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'Schema list items',
})
export class ListItemSchema {
  @Field(() => ID, {
    name: 'id',
    description: 'List item id',
    nullable: false,
  })
  id: string;

  @Field(() => Int, {
    name: 'quantity',
    description: 'Item quantity in the list',
    nullable: false,
  })
  quantity: number;
}
