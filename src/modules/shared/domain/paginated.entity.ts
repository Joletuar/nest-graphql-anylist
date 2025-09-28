export interface Paginated<T> {
  data: T[];

  pagination: Pagination;
}

export interface Pagination {
  page: number;
  perPage: number;
  total: number;
}
