import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateListItemDto {
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
