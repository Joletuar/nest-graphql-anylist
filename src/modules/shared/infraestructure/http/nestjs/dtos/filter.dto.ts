import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FilterOperator } from 'src/modules/shared/domain/criteria/filter-operator.enum';

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
