import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import mongoose from 'mongoose';

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
        
        // Eliminar opciones obsoletas
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
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}