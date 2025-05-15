import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadGatewayException,
  GatewayTimeoutException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SearchWeatherDto } from './dto/search-weather.dto';

@Injectable()
export class WeatherService {
  constructor(private configService: ConfigService) {}

  async searchCity(dto: SearchWeatherDto) {
    const apiKey = this.configService.get('API_WEATHER_API');
    const baseUrl = this.configService.get('API_WEATHER_BASE_URL');

    if (!apiKey || !baseUrl) {
      throw new InternalServerErrorException(
        'Configuración del servicio de clima no disponible',
      );
    }

    if (!dto?.city?.trim()) {
      throw new BadRequestException('El nombre de la ciudad es requerido');
    }

    try {
      const request = await fetch(
        `${baseUrl}current.json?key=${apiKey}&q=${encodeURIComponent(
          dto.city,
        )}&lang=${dto.lang ? dto.lang : 'es'}&aqi=no`,
        {
          signal: AbortSignal.timeout(5000), // Timeout de 5 segundos
        },
      );

      if (!request.ok) {
        // Manejo de errores HTTP
        const errorData = await request.json().catch(() => ({}));

        if (request.status === 404 || errorData.error?.code === 1006) {
          throw new NotFoundException(`Ciudad "${dto.city}" no encontrada`);
        }

        if (request.status === 400) {
          throw new BadRequestException(
            'Solicitud inválida al servicio de clima',
          );
        }

        if (request.status === 401) {
          throw new InternalServerErrorException(
            'Problema de autenticación con el servicio de clima',
          );
        }

        if (request.status === 403) {
          throw new InternalServerErrorException(
            'Acceso denegado al servicio de clima',
          );
        }

        if (request.status >= 500) {
          throw new BadGatewayException(
            'El servicio de clima no está disponible',
          );
        }
      }

      const response = await request.json();

      // Validación de la estructura de la respuesta
      if (!response?.location || !response?.current) {
        console.error('Respuesta inválida:', {
          response,
          hasLocation: !!response?.location,
          hasCurrent: !!response?.current,
          keys: Object.keys(response || {}),
        });
        throw new BadGatewayException(
          'Respuesta inválida del servicio de clima',
        );
      }

      // Mapeo seguro de datos con valores por defecto
      return {
        location: {
          name: response.location?.name || 'Desconocido',
          country: response.location?.country || 'Desconocido',
          localtime: response.location?.localtime || null,
          lat: response.location?.lat ?? 0,
          lon: response.location?.lon ?? 0,
          localtime_epoch: response.location?.localtime_epoch ?? 0,
        },
        current: {
          temp_c: response.current?.temp_c ?? 0,
          temp_f: response.current?.temp_f ?? 0,
          condition: {
            code: response.current?.condition?.code ?? 0,
            text: response.current?.condition?.text || 'Desconocido',
            icon: response.current?.condition?.icon || '',
          },
          wind_kph: response.current?.wind_kph ?? 0,
          humidity: response.current?.humidity ?? 0,
        },
      };
    } catch (error) {
      console.error('Error en searchCity:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error; // Reenviar errores ya manejados
      }

      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        throw new GatewayTimeoutException(
          'El servicio de clima no respondió a tiempo',
        );
      }

      if (
        error instanceof TypeError &&
        error.message.includes('fetch failed')
      ) {
        throw new BadGatewayException(
          'No se pudo conectar al servicio de clima',
        );
      }

      throw new InternalServerErrorException(
        'Error al consultar la información del clima',
      );
    }
  }

  async searchByCoordinates(lat: string, lon: string, lang?: string) {
    const apiKey = this.configService.get('API_WEATHER_API');
    const baseUrl = this.configService.get('API_WEATHER_BASE_URL');

    // Validaciones iniciales
    if (!apiKey || !baseUrl) {
      throw new InternalServerErrorException(
        'Configuración del servicio de clima no disponible',
      );
    }

    if (!lat || !lon) {
      throw new BadRequestException(
        'Las coordenadas (latitud y longitud) son requeridas',
      );
    }

    // Validar formato de coordenadas
    if (isNaN(Number(lat)) || isNaN(Number(lon))) {
      throw new BadRequestException(
        'Las coordenadas deben ser valores numéricos',
      );
    }

    const numLat = parseFloat(lat);
    const numLon = parseFloat(lon);

    if (numLat < -90 || numLat > 90) {
      throw new BadRequestException(
        'La latitud debe estar entre -90 y 90 grados',
      );
    }

    if (numLon < -180 || numLon > 180) {
      throw new BadRequestException(
        'La longitud debe estar entre -180 y 180 grados',
      );
    }

    try {
      const request = await fetch(
        `${baseUrl}current.json?key=${apiKey}&q=${numLat},${numLon}&lang=${
          lang || 'es'
        }&aqi=no`,
      );

      console.log(request);

      if (!request.ok) {
        const errorData = await request.json().catch(() => ({}));

        if (request.status === 400 || errorData.error?.code === 1006) {
          throw new NotFoundException(
            'No se encontraron datos para las coordenadas proporcionadas',
          );
        }

        if (request.status === 401) {
          throw new InternalServerErrorException(
            'Problema de autenticación con el servicio de clima',
          );
        }

        if (request.status === 403) {
          throw new InternalServerErrorException(
            'Acceso denegado al servicio de clima',
          );
        }

        if (request.status >= 500) {
          throw new BadGatewayException(
            'El servicio de clima no está disponible',
          );
        }
      }

      const response = await request.json();

      // Validación de la estructura de la respuesta
      if (!response?.location || !response?.current) {
        throw new BadGatewayException(
          'Respuesta inválida del servicio de clima',
        );
      }

      console.log(response);

      // Mapeo seguro de datos con valores por defecto
      return {
        location: {
          name: response.location?.name || 'Ubicación desconocida',
          country: response.location?.country || 'Desconocido',
          localtime: response.location?.localtime || null,
          lat: response.location?.lat ?? numLat, // Usar la original si no viene
          lon: response.location?.lon ?? numLon, // Usar la original si no viene
          localtime_epoch: response.location?.localtime_epoch ?? 0,
        },
        current: {
          temp_c: response.current?.temp_c ?? 0,
          temp_f: response.current?.temp_f ?? 0,
          condition: {
            code: response.current?.condition?.code ?? 0,
            text: response.current?.condition?.text || 'Condición desconocida',
            icon: response.current?.condition?.icon || '',
          },
          wind_kph: response.current?.wind_kph ?? 0,
          humidity: response.current?.humidity ?? 0,
        },
      };
    } catch (error) {
      console.error('Error en searchByCoordinates:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        throw new GatewayTimeoutException(
          'El servicio de clima no respondió a tiempo',
        );
      }

      if (
        error instanceof TypeError &&
        error.message.includes('fetch failed')
      ) {
        throw new BadGatewayException(
          'No se pudo conectar al servicio de clima',
        );
      }

      throw new InternalServerErrorException(
        'Error al consultar la información del clima por coordenadas',
      );
    }
  }
}
