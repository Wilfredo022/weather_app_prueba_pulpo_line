import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { ConfigModule } from '@nestjs/config';
import authConfig from 'src/config/authConfig/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [authConfig],
    }),
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
