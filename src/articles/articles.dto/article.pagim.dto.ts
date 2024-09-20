import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsEnum, IsNotEmpty } from 'class-validator';



export class pagim {
 
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  take: number;
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  skip: number;

}
