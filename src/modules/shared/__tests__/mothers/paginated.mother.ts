import { Paginated } from '@shared/domain/paginated.entity';

export class PaginatedMother {
  static create<T>(data: T[]): Paginated<T> {
    return {
      data,
      pagination: {
        page: 1,
        perPage: data.length || 10,
        total: data.length,
      },
    };
  }
}
