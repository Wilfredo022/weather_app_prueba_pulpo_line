// src/favorites/favorites.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { PrismaService } from 'src/persistence/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async createFavorite(dto: CreateFavoriteDto) {
    return this.prisma.favorites.create({
      data: {
        userId: dto.userId,
        city: dto.city,
        lat: dto.lat,
        lon: dto.lon,
      },
    });
  }

  async getUserFavorites(userId: string) {
    return this.prisma.favorites.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteFavorite(id: string) {
    try {
      return await this.prisma.favorites.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Favorite not found');
      }
      throw error;
    }
  }
}
