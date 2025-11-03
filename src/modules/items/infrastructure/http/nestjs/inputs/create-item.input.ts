import { Field, InputType, Int } from '@nestjs/graphql';

@InputType({
  description: 'Input to create new item',
})
export class CreateItemInput {
  @Field(() => String, {
    description: 'Item name',
    nullable: false,
  })
  name: string;

  @Field(() => Int, {
    description: 'Item stock',
    nullable: false,
  })
  stock: number;

  @Field(() => String, {
    description: 'Item quantityUnits',
    nullable: false,
  })
  quantityUnits: string;

  @Field(() => String, {
    description: 'Item userId',
    nullable: false,
  })
  userId: string;
}
