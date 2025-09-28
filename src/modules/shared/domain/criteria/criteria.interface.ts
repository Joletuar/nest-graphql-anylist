import { Filter } from './filter.interface';
import { Pagination } from './pagination.interface';
import { Sort } from './sort.interface';

export interface Criteria {
  readonly filters: Filter[];
  readonly sort?: Sort;
  readonly pagination: Pagination;
}
