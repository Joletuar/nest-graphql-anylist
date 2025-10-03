import { Field, ID, ObjectType } from '@nestjs/graphql';

import { UserSchema } from 'src/modules/users/infrastructure/http/nestjs/user.schema';

import { ListItemSchema } from './list-item.schema';

@ObjectType({
  description: 'Schema lists',
})
export class ListSchema {
  @Field(() => ID, {
    name: 'id',
    description: 'List id',
    nullable: false,
  })
  id: string;

  @Field(() => String, {
    name: 'name',
    description: 'List name',
    nullable: false,
  })
  name: string;

  @Field(() => UserSchema, {
    name: 'user',
    description: 'User who created the list',
    nullable: false,
  })
  user: UserSchema;

  @Field(() => [ListItemSchema], {
    name: 'items',
    description: 'List items',
    nullable: false,
  })
  items: ListItemSchema[];
}
