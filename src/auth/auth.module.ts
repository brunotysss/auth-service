import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.services';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';  // Importa el RolesGuard
import { Reflector } from '@nestjs/core';    // Importa Reflector para manejar roles

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
    forwardRef(() => UsersModule), // Importa el UsersModule con forwardRef
  ],
  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,     // Asegúrate de añadir RolesGuard a los proveedores
    Reflector       // Añade Reflector a los proveedores
  ],
  exports: [AuthService],
})
export class AuthModule {}
