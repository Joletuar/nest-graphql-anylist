import { FilterOperator } from '@shared/domain/criteria/filter-operator.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class FilterDto {
  @IsString()
  @IsNotEmpty()
  field: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(FilterOperator)
  operator: FilterOperator;
}
