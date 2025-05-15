import { Module } from '@nestjs/common';
import { AutocompleteService } from './autocomplete.service';
import { AutocompleteController } from './autocomplete.controller';
import { ConfigModule } from '@nestjs/config';
import authConfig from 'src/config/authConfig/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [authConfig],
    }),
  ],
  controllers: [AutocompleteController],
  providers: [AutocompleteService],
})
export class AutocompleteModule {}
