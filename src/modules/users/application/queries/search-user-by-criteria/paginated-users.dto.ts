import { UserDto } from '../../user.dto';

export interface PaginatedUsersDto {
  users: UserDto[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  perPage: number;
  total: number;
}
