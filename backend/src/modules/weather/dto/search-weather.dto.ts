import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

export class SearchWeatherDto {
  @IsNotEmpty({ message: 'El nombre de la ciudad es requerido' })
  @IsString({ message: 'La ciudad debe ser un texto' })
  @Length(2, 50, { message: 'La ciudad debe tener entre 2 y 50 caracteres' })
  @Matches(/^[a-zA-Z\u00C0-\u00FF\s\-']+$/, {
    message: 'La ciudad solo puede contener letras y espacios',
  })
  city: string;

  @IsOptional()
  @IsString()
  lang: string;

  @IsOptional()
  @IsString()
  lat: string;

  @IsOptional()
  @IsString()
  lon: string;

  @ValidateIf((o) => !o.city && (o.lat === undefined || o.lon === undefined))
  @IsString({ message: 'Se requiere ciudad o coordenadas' })
  _?: never;
}
