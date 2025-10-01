import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { FilterDto } from './filter.dto';
import { PaginationDto } from './pagination.dto';
import { SortDto } from './sort.dto';

export class CriteriaDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FilterDto)
  filters: FilterDto[];

  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SortDto)
  sort?: SortDto;
}
