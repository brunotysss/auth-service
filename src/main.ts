import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';  // Importa Helmet para agregar seguridad
import * as cors from 'cors';  // Importa CORS para habilitar el acceso entre dominios
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';  // Swagger para documentar la API

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Agrega Helmet para mejorar la seguridad
  app.use(helmet());

  // Habilita CORS para permitir el acceso desde otros dominios
  app.enableCors();

  // Configuración de Swagger para la documentación de la API
  const config = new DocumentBuilder()
    .setTitle('Auth API')  // Título de la API
    .setDescription('API de autenticación')  // Descripción de la API
    .setVersion('1.0')  // Versión de la API
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
