import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { SearchWeatherDto } from './dto/search-weather.dto';
import { JwtAuthGuard } from 'src/config/guards/jwt-auth.guard';

@Controller('weather')
@UseGuards(JwtAuthGuard)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  search(@Query() searchDto: SearchWeatherDto) {
    console.log(searchDto);
    if (searchDto.lat !== undefined && searchDto.lon !== undefined) {
      return this.weatherService.searchByCoordinates(
        searchDto.lat,
        searchDto.lon,
        searchDto.lang,
      );
    }
    return this.weatherService.searchCity(searchDto);
  }
}
