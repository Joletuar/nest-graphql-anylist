import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class SortDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['asc', 'desc'])
  order: string;

  @IsString()
  @IsNotEmpty()
  field: string;
}
