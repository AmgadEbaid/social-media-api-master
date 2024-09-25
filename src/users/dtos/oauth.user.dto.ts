import { IsEmail, IsString } from 'class-validator';

export class oauthUser {
  @IsString()
  diplayname: string;

  @IsEmail()
  email: string;

  @IsString()
  image: string;    
}
