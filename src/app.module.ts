import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import mongoose from 'mongoose';
import { ThrottlerModule } from '@nestjs/throttler'; // Módulo para Rate Limiting
import { LoggerModule } from './common/logger/logger.module'; // Importa el LoggerModule
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'; // Para excepciones globales e interceptores
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'; // Filtro global de excepciones
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'; // Interceptor para logging
import { MetricsService } from './common/metrics/metrics.service'; // Servicio de métricas
import { MetricsModule } from './common/metrics/metrics.module';

@Module({
  imports: [
    MetricsModule, // Importa el módulo de métricas

    // Configuración global para variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Conexión a MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI'); // Lee la URI desde las variables de entorno
        const connection = await mongoose.connect(uri);

        // Listeners para conexión exitosa o errores
        connection.connection.on('connected', () => {
          console.log('Mongoose conectado correctamente.');
        });
        connection.connection.on('error', (err) => {
          console.error('Error en la conexión de Mongoose:', err);
        });

        return { uri };
      },
    }),

    // Rate Limiting para proteger la API
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 3 },
      { name: 'medium', ttl: 10000, limit: 20 },
      { name: 'long', ttl: 60000, limit: 100 },
    ]),

    // Módulos principales de la aplicación
    AuthModule,
    UsersModule,

    // Logger global para toda la aplicación
    LoggerModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter, // Usa el filtro global de excepciones
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor, // Usa el interceptor global de logging
    },
    MetricsService, // Servicio de métricas, inyectado donde sea necesario
  ],
  exports: [
    MetricsService, // Exporta servicios que puedan ser usados por otros módulos
  ],
})
export class AppModule {}
