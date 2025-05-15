import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AutocompleteService {
  constructor(private configService: ConfigService) {}
  async getAutocomplete(query: string) {
    const apiKey = this.configService.get('API_WEATHER_API');
    const baseUrl = this.configService.get('API_WEATHER_BASE_URL');

    try {
      const request = await fetch(
        `${baseUrl}search.json?key=${apiKey}&q=${query}`,
      );

      const response = await request.json();

      return response.map((city) => ({
        id: city.id,
        name: `${city.name}, ${city.country}`,
        lat: city.lat,
        lon: city.lon,
      }));
    } catch (error) {
      console.log(error);
    }
  }
}
