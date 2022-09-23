import { Type } from 'class-transformer';
import {
  IsEmail,
  IsMobilePhone,
  IsString,
  IsDefined,
  MinLength,
  IsArray,
  ValidateNested,
  IsOptional,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';

export class AddressDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  building: string;
}

export class ClientCreateDto {
  @IsString()
  name: string;

  @IsString()
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

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}

export class PersonInfo {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsString()
  @IsEmail({ message: 'Email is not valid' })
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @IsDefined({ message: 'Password must be defined' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsMobilePhone('ru-RU', { message: 'Phone number is not valid' })
  @IsNotEmpty()
  phoneNumber: string;
}

export class ClientUpdateDto {
  @ValidateNested()
  @Type(() => PersonInfo)
  personInfo?: PersonInfo;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => AddressDto)
  addresses?: AddressDto[];
}
