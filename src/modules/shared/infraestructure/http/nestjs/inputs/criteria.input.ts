import { Field, InputType } from '@nestjs/graphql';

import { FilterInput } from './filter.input';
import { PaginationInput } from './pagination.input';
import { SortInput } from './sort.input';

@InputType({
  description: 'Criteria to filter, paginate and sort',
})
export class CriteriaInput {
  @Field(() => [FilterInput], {
    nullable: false,
    description: 'Filters to apply to the search',
  })
  filters: FilterInput[];

  @Field(() => PaginationInput, {
    nullable: false,
    description: 'Pagination options',
  })
  pagination: PaginationInput;

  @Field(() => SortInput, {
    nullable: true,
    description: 'Sort options',
  })
  sort?: SortInput;
}
