import { ListItemDto } from '../../list-item.dto';

export interface PaginatedListItemsDto {
  items: ListItemDto[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  perPage: number;
  total: number;
}
