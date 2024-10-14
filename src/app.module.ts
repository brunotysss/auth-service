import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        autoCreate: false;
        connectTimeoutMS: 30000;  // Aumenta el tiempo de espera para la conexión
        socketTimeoutMS: 45000;   // Aumenta el tiempo de espera para las operacione
        console.log('MONGODB_URI:', uri);  // Esto debería imprimir la URI en la consola
        return { uri };
      },
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
