import { IsEmail, IsString } from 'class-validator';

export class ClientLoginDto {
  @IsEmail({ message: 'Incorrect email or password' })
  login: string;

  @IsString({ message: 'Incorrect email or password' })
  password: string;
}
