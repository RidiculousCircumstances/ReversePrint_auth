import { IsEmail, IsMobilePhone, IsString, IsEnum, IsDefined, MinLength } from 'class-validator';
import { RoleTypes } from '../entities/role.entity';

export class EmployeeCreateDto {
  name: string;
  surname: string;

  @IsDefined({ message: 'Email must be defined' })
  @IsEmail({ message: 'Email is not valid' })
  email: string;

  @IsDefined({ message: 'Phone number must be defined' })
  @IsMobilePhone('ru-RU')
  phoneNumber: string;

  @MinLength(8)
  @IsDefined({ message: 'Password must be defined' })
  @IsString()
  password: string;
}
