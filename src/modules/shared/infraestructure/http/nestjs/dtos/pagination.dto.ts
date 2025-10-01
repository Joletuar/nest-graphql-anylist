import { IsNumber, IsPositive, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  page: number;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(100)
  perPage: number;
}
