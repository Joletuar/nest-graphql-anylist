import { UserDto } from '../../user.dto';

export interface PaginatedUserDto {
  users: UserDto[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  perPage: number;
  total: number;
}
