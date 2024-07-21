import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2'); // Para añadir un prefijo global a mi API

  app.useGlobalPipes( // Validacion de global pipes para los decoradores de class validator
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  await app.listen(3000);
}
bootstrap();
