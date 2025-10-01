import { Field, ObjectType, OmitType } from '@nestjs/graphql';

import { UserSchema } from 'src/modules/users/infraestructure/http/nestjs/user.schema';

import { ItemSchema } from './item.schema';

@ObjectType({
  description: 'Schema for querying items',
})
export class QueryItemSchema extends OmitType(ItemSchema, ['userId']) {
  @Field(() => UserSchema, {
    description: 'User who owns the item',
    nullable: false,
  })
  user: UserSchema;
}
