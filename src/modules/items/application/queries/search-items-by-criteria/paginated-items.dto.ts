import { QueryItemDto } from '../query-item.dto';

export interface PaginatedItemsDto {
  items: QueryItemDto[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  perPage: number;
  total: number;
}
