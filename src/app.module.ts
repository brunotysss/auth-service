import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import mongoose from 'mongoose';
import { ThrottlerModule } from '@nestjs/throttler'; // Importa el ThrottlerModule para Rate Limiting
import { LoggerService } from './common/services/logger.services'; // Asegúrate de ajustar la ruta

//import { APP_GUARD } from '@nestjs/core';
//import { JwtAuthGuard } from './auth/jwt-auth.guard';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        const connection = await mongoose.connect(uri);
        connection.connection.on('connected', () => {
          console.log('Mongoose conectado correctamente.');
        });
        connection.connection.on('error', (err) => {
          console.error('Error en la conexión de Mongoose:', err);
        });
        return { uri };
      },
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]),
    AuthModule,
    UsersModule,
  ],/*
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Usa JwtAuthGuard como guard por defecto
    },
  ],*/
  providers: [LoggerService],
  exports: [LoggerService], // Asegúrate de exportar el servicio
})
export class AppModule {}

