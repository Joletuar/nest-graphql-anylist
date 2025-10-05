import { IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class GetListItemsDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  page: number;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(100)
  limit: number;
}
