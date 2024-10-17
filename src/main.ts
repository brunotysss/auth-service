import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';  // Importa Helmet para agregar seguridad
import * as cors from 'cors';  // Importa CORS para habilitar el acceso entre dominios
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';  // Swagger para documentar la API
import { join } from 'path'; // Para manejar rutas
import { NestExpressApplication } from '@nestjs/platform-express'; // Importa NestExpressApplication
import * as hbs from 'hbs'; // Importa Handlebars
import { LoggerService } from './common/services/logger.services'; // Importa el servicio de logger

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // Crea la aplicación como NestExpressApplication

  // Agrega Helmet para mejorar la seguridad
  app.use(helmet());

  // Habilita CORS para permitir el acceso desde otros dominios
  app.enableCors();

  // Configuración de Handlebars como motor de plantillas
  app.setViewEngine('hbs'); // Configura Handlebars
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // Establece la carpeta para las vistas

  // Configuración de Swagger para la documentación de la API
  const config = new DocumentBuilder()
    .setTitle('Auth API')  // Título de la API
    .setDescription('API de autenticación')  // Descripción de la API
    .setVersion('1.0')  // Versión de la API
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const logger = app.get(LoggerService); // Obtener instancia del logger
  logger.info('App started...'); // Usar el logger para registrar que la app ha iniciado

  await app.listen(3000);
}

bootstrap();


