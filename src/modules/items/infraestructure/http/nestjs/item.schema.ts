import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'Esquema de los items',
})
export class ItemSchema {
  @Field(() => ID, {
    name: 'id',
    description: 'ID del item',
  })
  id: string;

  @Field(() => String, {
    name: 'name',
    description: 'Nombre del item',
  })
  name: string;

  @Field(() => Int, {
    name: 'quantity',
    description: 'Cantidad disponible del item',
  })
  quantity: number;

  @Field(() => Int, {
    name: 'quantityUnits',
    description: 'Unidad del item',
  })
  quantityUnits: number;
}
