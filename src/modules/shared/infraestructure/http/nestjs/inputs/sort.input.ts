import { Field, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Sorting input',
})
export class SortInput {
  @Field(() => String, {
    description: 'Sort order (asc or desc)',
    nullable: false,
  })
  order: string;

  @Field(() => String, {
    description: 'Sort field',
    nullable: false,
  })
  field: string;
}
