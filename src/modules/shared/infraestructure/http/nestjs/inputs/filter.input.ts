import { Field, InputType, registerEnumType } from '@nestjs/graphql';

import { FilterOperator } from 'src/modules/shared/domain/criteria/filter-operator.enum';

@InputType({
  description: 'Input type for filtering',
})
export class FilterInput {
  @Field(() => String, {
    description: 'Field to filter',
    nullable: false,
  })
  field: string;

  @Field(() => String, {
    description: 'Value to filter',
    nullable: false,
  })
  value: string;

  @Field(() => FilterOperator, {
    description: 'Operator to use for filtering',
    nullable: false,
  })
  operator: FilterOperator;
}

registerEnumType(FilterOperator, {
  name: 'FilterOperator',
  description: 'Filter operator',
});
