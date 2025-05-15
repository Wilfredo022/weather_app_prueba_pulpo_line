import { Test } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { ConfigService } from '@nestjs/config';

import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  GatewayTimeoutException,
} from '@nestjs/common';

global.fetch = jest.fn();

describe('WeatherService', () => {
  let weatherService: WeatherService;
  let configService: ConfigService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    weatherService = moduleRef.get<WeatherService>(WeatherService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  const data = { city: 'Madrid', lang: 'es', lat: '', lon: '' };
  const noData = { city: '', lang: 'es', lat: '', lon: '' };
  const cityRandom = {
    city: 'dasjfajsfaksjdalk',
    lang: 'es',
    lat: '',
    lon: '',
  };

  describe('searchCity', () => {
    it('should throw error if API configuration is missing', async () => {
      (configService.get as jest.Mock).mockReturnValue(undefined);

      await expect(weatherService.searchCity(data)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw error if no city is provided', async () => {
      (configService.get as jest.Mock).mockImplementation((key) =>
        key === 'API_WEATHER_API' ? 'test-key' : 'http://test.url/',
      );

      await expect(weatherService.searchCity(noData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return weather data for a valid city', async () => {
      (configService.get as jest.Mock).mockImplementation((key) =>
        key === 'API_WEATHER_API' ? 'test-key' : 'http://test.url/',
      );

      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({
          location: {
            name: 'Madrid',
            country: 'Spain',
            lat: 40.4,
            lon: -3.7,
            localtime: '2023-05-15 12:00',
            localtime_epoch: 1684147200,
          },
          current: {
            temp_c: 22,
            temp_f: 71.6,
            condition: {
              text: 'Sunny',
              icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
              code: 1000,
            },
            wind_kph: 10,
            humidity: 50,
          },
        }),
      };

      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await weatherService.searchCity(data);

      expect(result).toEqual({
        location: {
          name: 'Madrid',
          country: 'Spain',
          lat: 40.4,
          lon: -3.7,
          localtime: '2023-05-15 12:00',
          localtime_epoch: 1684147200,
        },
        current: {
          temp_c: 22,
          temp_f: 71.6,
          condition: {
            code: 1000,
            text: 'Sunny',
            icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
          },
          wind_kph: 10,
          humidity: 50,
        },
      });
    });

    it('should handle city not found', async () => {
      (configService.get as jest.Mock).mockImplementation((key) =>
        key === 'API_WEATHER_API' ? 'test-key' : 'http://test.url/',
      );

      const mockResponse = {
        ok: false,
        status: 404,
        json: async () => ({
          error: { code: 1006, message: 'No matching location found.' },
        }),
      };

      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(weatherService.searchCity(cityRandom)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle API timeouts', async () => {
      (configService.get as jest.Mock).mockImplementation((key) =>
        key === 'API_WEATHER_API' ? 'test-key' : 'http://test.url/',
      );

      (fetch as jest.Mock).mockImplementation(() => {
        throw { name: 'AbortError' };
      });

      await expect(weatherService.searchCity(data)).rejects.toThrow(
        GatewayTimeoutException,
      );
    });
  });

  describe('searchByCoordinates', () => {
    it('debería validar coordenadas numéricas', async () => {
      (configService.get as jest.Mock).mockImplementation((key) =>
        key === 'API_WEATHER_API' ? 'test-key' : 'http://test.url/',
      );

      await expect(
        weatherService.searchByCoordinates('invalid', 'invalid'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should validate latitude and longitude ranges', async () => {
      (configService.get as jest.Mock).mockImplementation((key) =>
        key === 'API_WEATHER_API' ? 'test-key' : 'http://test.url/',
      );

      await expect(
        weatherService.searchByCoordinates('91', '0'),
      ).rejects.toThrow(BadRequestException);

      await expect(
        weatherService.searchByCoordinates('0', '181'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return weather data for valid coordinates', async () => {
      (configService.get as jest.Mock).mockImplementation((key) =>
        key === 'API_WEATHER_API' ? 'test-key' : 'http://test.url/',
      );

      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({
          location: {
            name: 'Madrid',
            country: 'Spain',
            lat: 40.4,
            lon: -3.7,
            localtime: '2023-05-15 12:00',
            localtime_epoch: 1684147200,
          },
          current: {
            temp_c: 22,
            temp_f: 71.6,
            condition: {
              text: 'Sunny',
              icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
              code: 1000,
            },
            wind_kph: 10,
            humidity: 50,
          },
        }),
      };

      (fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await weatherService.searchByCoordinates('40.4', '-3.7');

      expect(result.location.lat).toBe(40.4);
      expect(result.location.lon).toBe(-3.7);
    });
  });
});
