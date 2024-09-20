import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateComment {
  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsNotEmpty()
  articleId: string;
}
