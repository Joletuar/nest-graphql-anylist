import { Criteria } from '@modules/shared/domain/criteria/criteria.interface';
import { FilterOperator } from '@modules/shared/domain/criteria/filter-operator.enum';
import { Filter } from '@modules/shared/domain/criteria/filter.interface';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

import { TypeOrmCriteriaConverterException } from './exceptions/typeorm-criteria-converter.exception';

export class TypeOrmCriteriaConverter {
  static convert<T>(criteria: Criteria): FindManyOptions<T> {
    const options: FindManyOptions<T> = {};

    if (criteria.filters.length > 0) {
      options.where = this.convertFilters<T>(criteria.filters);
    }

    if (criteria.sort) {
      options.order = this.convertSort<T>(criteria.sort);
    }

    const { page, perPage } = criteria.pagination;
    options.skip = (page - 1) * perPage;
    options.take = perPage;

    return options;
  }

  private static convertFilters<T>(filters: Filter[]): FindOptionsWhere<T> {
    const where: FindOptionsWhere<T> = {};

    filters.forEach((filter) => {
      const { field, value, operator } = filter;

      switch (operator) {
        case FilterOperator.EQUAL:
          where[field] = value;
          break;

        case FilterOperator.NOT_EQUAL:
          where[field] = Not(value);
          break;

        case FilterOperator.GREATER_THAN:
          where[field] = MoreThan(value);
          break;

        case FilterOperator.GREATER_THAN_OR_EQUAL:
          where[field] = MoreThanOrEqual(value);
          break;

        case FilterOperator.LESS_THAN:
          where[field] = LessThan(value);
          break;

        case FilterOperator.LESS_THAN_OR_EQUAL:
          where[field] = LessThanOrEqual(value);
          break;

        case FilterOperator.CONTAINS:
          where[field] = Like(`%${value}%`);
          break;

        default:
          throw new TypeOrmCriteriaConverterException();
      }
    });

    return where;
  }

  private static convertSort<T>(sort: {
    field: string;
    order: string;
  }): FindOptionsOrder<T> {
    const order = {} as FindOptionsOrder<T>;

    order[sort.field] = sort.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    return order;
  }
}
