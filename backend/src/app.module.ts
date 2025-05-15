import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { WeatherModule } from './modules/weather/weather.module';
import { AutocompleteModule } from './modules/autocomplete/autocomplete.module';
import { PersistenceModule } from './persistence/persistence.module';
import authConfig from './config/authConfig/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [authConfig],
    }),
    AuthModule,
    FavoritesModule,
    WeatherModule,
    AutocompleteModule,
    PersistenceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
