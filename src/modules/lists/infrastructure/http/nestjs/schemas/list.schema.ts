import { Field, ID, ObjectType } from '@nestjs/graphql';

import { UserSchema } from '@users/infrastructure/http/nestjs/user.schema';

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
}
