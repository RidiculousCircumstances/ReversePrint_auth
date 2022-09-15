import { IsEmail, IsString } from 'class-validator';

export class EmployeeLoginDto {
  @IsEmail({ message: 'Incorrect login or password' })
  name: string;

  @IsString({ message: 'Incorrect login or password' })
  password: string;
}
