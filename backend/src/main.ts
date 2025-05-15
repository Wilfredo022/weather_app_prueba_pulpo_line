import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });
  app.enableCors({
    origin: true,
    methods: ['GET', 'DELETE', 'POST'],
    allowedHeaders: 'Content-Type,Authorization',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
