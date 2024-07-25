import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2'); // Para añadir un prefijo global a mi API

  app.useGlobalPipes( // Validacion de global pipes para los decoradores de class validator
    new ValidationPipe({

      /** va a forzar a  parametros enviados , que sean del tipo y del nombre indicado, sin admitir parametros extras*/
      whitelist: true, 
      forbidNonWhitelisted: true, 

      /** Transforma la data a su tipo segun solicitado en la interfaz** */
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
      
    }),
  )
  await app.listen(process.env.PORT);
  console.log(`Aplicacion corriendo en puerto ${ process.env.PORT }`)
}
bootstrap();
