// src/favorites/favorites.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { JwtAuthGuard } from 'src/config/guards/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create(@Body() dto: CreateFavoriteDto) {
    return this.favoritesService.createFavorite(dto);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.favoritesService.getUserFavorites(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favoritesService.deleteFavorite(id);
  }
}
