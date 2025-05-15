import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteFavoriteDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
