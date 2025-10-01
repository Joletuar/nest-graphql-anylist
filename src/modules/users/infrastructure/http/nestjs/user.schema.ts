import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

import { Role } from 'src/modules/users/domain/roles.enum';

@ObjectType({
  description: 'User schema',
})
export class UserSchema {
  @Field(() => ID, {
    nullable: false,
    description: 'User id',
  })
  id: string;

  @Field(() => String, {
    nullable: false,
    description: 'User fullName',
  })
  fullName: string;

  @Field(() => String, {
    nullable: false,
    description: 'User email',
  })
  email: string;

  @Field(() => [Role], {
    nullable: false,
    description: 'User roles',
  })
  roles: Role[];

  @Field(() => Boolean, {
    nullable: false,
    description: 'Flag to indicate if the user is block or not',
  })
  isActive: boolean;
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User roles',
});
