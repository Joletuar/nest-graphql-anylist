import { Role } from '@users/domain/roles.enum';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @IsArray()
  @IsEnum(Role, {
    each: true,
  })
  @ArrayMinSize(1)
  roles: Role[];

  @IsBoolean()
  isActive: boolean;
}
