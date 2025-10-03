import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'Schema items',
})
export class ItemSchema {
  @Field(() => ID, {
    name: 'id',
    description: 'Item id',
  })
  id: string;

  @Field(() => String, {
    name: 'name',
    description: 'Item name',
  })
  name: string;

  @Field(() => Int, {
    name: 'stock',
    description: 'Item stock',
  })
  stock: number;

  @Field(() => Int, {
    name: 'quantityUnits',
    description: 'Item unit',
  })
  quantityUnits: string;

  @Field(() => ID, {
    name: 'userId',
    description: 'User id who created the item',
  })
  userId: string;
}
