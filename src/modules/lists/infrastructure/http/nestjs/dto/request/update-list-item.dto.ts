import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class UpdateListItemDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
