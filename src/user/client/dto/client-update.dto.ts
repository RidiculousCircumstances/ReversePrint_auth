import { IsEmail, IsMobilePhone, IsString, IsEnum, IsDefined, MinLength } from 'class-validator';

export class ClientUpdateDto {
  @IsString()
  name?: string;

  @IsString()
  surname?: string;

  @IsDefined({ message: 'Email must be defined' })
  @IsEmail({ message: 'Email is not valid' })
  email?: string;

  @IsDefined({ message: 'Phone number must be defined' })
  @IsMobilePhone('ru-RU')
  phoneNumber?: string;

  @MinLength(8)
  @IsDefined({ message: 'Password must be defined' })
  @IsString()
  password?: string;

  @IsDefined({ message: 'City must be defined' })
  @IsString()
  city?: string;

  @IsDefined({ message: 'Street must be defined' })
  @IsString()
  street?: string;

  @IsDefined({ message: 'Building must be defined' })
  @IsString()
  building?: string;
}
