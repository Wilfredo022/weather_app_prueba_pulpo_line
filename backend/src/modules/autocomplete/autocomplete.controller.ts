import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AutocompleteService } from './autocomplete.service';
import { JwtAuthGuard } from 'src/config/guards/jwt-auth.guard';

@Controller('autocomplete')
@UseGuards(JwtAuthGuard)
export class AutocompleteController {
  constructor(private readonly autocompleteService: AutocompleteService) {}

  @Get()
  autocomplete(@Query('query') query: string) {
    return this.autocompleteService.getAutocomplete(query);
  }
}
