// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../../config/strategies/jwt.strategy'; // Nueva ruta
import authConfig from '../../config/authConfig/auth.config'; // Configuración centralizada

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwtSecret'),
        signOptions: {
          expiresIn: configService.get<string>('auth.jwtExpiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy, // Ahora viene de /config
  ],
})
export class AuthModule {}
