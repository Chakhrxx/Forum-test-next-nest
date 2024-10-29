import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  // The username field must not be empty and must be a string
  @IsNotEmpty()
  @IsString()
  username: string;

  // The email field must not be empty and must be a valid email format
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
