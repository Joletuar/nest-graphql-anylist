import { Field, InputType } from '@nestjs/graphql';

import { Role } from 'src/modules/users/domain/roles.enum';

@InputType({
  description: 'Input to create new user',
})
export class CreateUserInput {
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

  @Field(() => String, {
    nullable: false,
    description: 'User password',
  })
  password: string;

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
