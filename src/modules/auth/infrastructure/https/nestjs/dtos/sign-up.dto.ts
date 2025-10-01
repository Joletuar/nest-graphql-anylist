import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'src/modules/users/domain/roles.enum';

export class SignUpDto {
  @IsString()
  @MinLength(3)
  fullName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(Role, { each: true })
  roles: Role[];
}
