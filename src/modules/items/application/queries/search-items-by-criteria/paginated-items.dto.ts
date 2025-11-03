import { QueryItemDto } from '../query-item.dto';

export interface PaginatedItemsDto {
  items: QueryItemDto[];
  pagination: PaginationDto;
}

export interface PaginationDto {
  page: number;
  perPage: number;
  total: number;
}
