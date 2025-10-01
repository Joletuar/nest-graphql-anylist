import { InputType, OmitType, PartialType } from '@nestjs/graphql';

import { CreateUserInput } from './create-user.input';

@InputType({
  description: 'Input to update an user',
})
export class UpdateUserInput extends PartialType(
  OmitType(CreateUserInput, ['password']),
) {}
