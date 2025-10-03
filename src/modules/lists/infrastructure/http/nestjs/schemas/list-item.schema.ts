import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

import { ItemSchema } from 'src/modules/items/infrastructure/http/nestjs/schemas/item.schema';

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

  @Field(() => ItemSchema, {
    name: 'item',
    description: 'Item information',
    nullable: false,
  })
  item: ItemSchema;

  @Field(() => Int, {
    name: 'quantity',
    description: 'Item quantity in the list',
    nullable: false,
  })
  quantity: number;
}
