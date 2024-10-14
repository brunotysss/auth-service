import { Module } from '@nestjs/common';
import { AuthService } from './auth.services';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,   // Importa tu módulo de usuarios
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],  // Asegúrate de importar ConfigModule aquí
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),  // Obtén la clave secreta de .env
        signOptions: { expiresIn: '60m' },  // Configura el tiempo de expiración del token
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],  // Asegúrate de tener el servicio y estrategia de JWT
  exports: [AuthService],  // Exporta el AuthService para que esté disponible en otros módulos
})
export class AuthModule {}
