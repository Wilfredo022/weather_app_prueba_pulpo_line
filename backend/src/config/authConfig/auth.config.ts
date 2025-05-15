import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET || 'secret-key-dev-only',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
}));
