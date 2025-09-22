import { InputType, PartialType } from '@nestjs/graphql';

import { CreateItemInput } from './create-item.input';

@InputType({
  description: 'Input to update an item',
})
export class UpdateItemInput extends PartialType(CreateItemInput) {}
