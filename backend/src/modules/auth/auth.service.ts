// src/auth/services/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  // Credenciales mock (en producción usaría una base de datos)
  private readonly mockUser = {
    email: 'test@test.com',
    password: '123456',
    userId: 1,
  };

  constructor(private readonly jwtService: JwtService) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    // Validación de credenciales mock
    if (email === this.mockUser.email && password === this.mockUser.password) {
      const { password, ...result } = this.mockUser;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { email: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
      userId: this.mockUser.userId,
    };
  }
}
