import { IsEmail, IsString } from 'class-validator';

export class CreateWorkerDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
