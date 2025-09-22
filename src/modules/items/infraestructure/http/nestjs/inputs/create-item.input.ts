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
    description: 'Item quantity',
    nullable: false,
  })
  quantity: number;

  @Field(() => String, {
    description: 'Item quantityUnits',
    nullable: false,
  })
  quantityUnits: string;
}
