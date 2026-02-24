import { Criteria } from '@shared/domain/criteria/criteria.interface';
import { FilterOperator } from '@shared/domain/criteria/filter-operator.enum';

export class CriteriaMother {
  static create(overrides: Partial<Criteria> = {}): Criteria {
    return {
      filters: [],
      pagination: {
        page: 1,
        perPage: 10,
      },
      ...overrides,
    };
  }

  static withEmailFilter(email: string): Criteria {
    return {
      filters: [
        {
          field: 'email',
          operator: FilterOperator.EQUAL,
          value: email,
        },
      ],
      pagination: {
        page: 1,
        perPage: 1,
      },
    };
  }
}
