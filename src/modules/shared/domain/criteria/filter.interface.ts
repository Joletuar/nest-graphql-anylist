import { FilterOperator } from './filter-operator.enum';

export interface Filter {
  readonly field: string;
  readonly value: string | number | boolean;
  readonly operator: FilterOperator;
}
