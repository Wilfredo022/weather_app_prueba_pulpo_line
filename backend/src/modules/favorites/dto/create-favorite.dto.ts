import { IsInt, IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateFavoriteDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lon: number;
}
