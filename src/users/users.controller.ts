import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  Get,
  Render,
  Query,
} from '@nestjs/common';
import { UsersService } from './services/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.services';
import { LoggerService } from '../common/logger/logger.services';
import { MetricsService } from '../common/metrics/metrics.service';
import { RequestPasswordDto } from './dto/request-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
    private readonly metricsService: MetricsService, // Inyecta el MetricsService
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      this.logger.info(`Registrando usuario: ${JSON.stringify(createUserDto)}`);
      const user = await this.usersService.findOrCreate(createUserDto);
      this.metricsService.incrementRequests('POST', '/users/register', '200'); // Registra métrica
      return user;
    } catch (error) {
      this.logger.error('Error durante el registro del usuario: ' + error.message);
      this.metricsService.incrementRequests('POST', '/users/register', '500'); // Registra error
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  @Post('login')
  async login(@Body() userDto: any) {
    try {
      const user = await this.authService.validateUser(userDto.email, userDto.password);
      if (!user) {
        this.metricsService.incrementRequests('POST', '/users/login', '401'); // Registra login fallido
        return { message: 'Usuario o contraseña incorrecta' };
      }
      const tokens = await this.authService.login(user);
      this.metricsService.incrementRequests('POST', '/users/login', '200'); // Registra login exitoso
      return tokens;
    } catch (error) {
      this.logger.error('Error en login: ' + error.message);
      this.metricsService.incrementRequests('POST', '/users/login', '500'); // Registra error
      throw new InternalServerErrorException('Error en login');
    }
  }

  @Get('reset-password')
  @Render('reset-password')
  resetPasswordView(@Query('token') token: string) {
    try {
      this.logger.info(`Accediendo a la vista de reset-password con token: ${token}`);
      this.metricsService.incrementRequests('GET', '/users/reset-password', '200'); // Registra acceso exitoso
      return { token };
    } catch (error) {
      this.logger.error('Error al acceder a la vista de reset-password: ' + error.message);
      this.metricsService.incrementRequests('GET', '/users/reset-password', '500'); // Registra error
      throw new InternalServerErrorException('Error al acceder a la vista de restablecimiento de contraseña');
    }
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body() requestPasswordDto: RequestPasswordDto) {
    try {
      const token = await this.authService.generatePasswordResetToken(requestPasswordDto.email);
      this.logger.info(`Token de recuperación enviado a: ${requestPasswordDto.email}`);
      this.metricsService.incrementRequests('POST', '/users/request-password-reset', '200'); // Registra métrica
      return { message: 'Token de recuperación enviado', token };
    } catch (error) {
      this.logger.error('Error al solicitar recuperación de contraseña: ' + error.message);
      this.metricsService.incrementRequests('POST', '/users/request-password-reset', '500'); // Registra error
      throw new InternalServerErrorException('Error al solicitar recuperación de contraseña');
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      const result = await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
      this.logger.info('Contraseña restablecida correctamente');
      this.metricsService.incrementRequests('POST', '/users/reset-password', '200'); // Registra métrica
      return result;
    } catch (error) {
      this.logger.error('Error al restablecer la contraseña: ' + error.message);
      this.metricsService.incrementRequests('POST', '/users/reset-password', '500'); // Registra error
      throw new InternalServerErrorException('Error al restablecer la contraseña');
    }
  }

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    try {
      const newAccessToken = await this.authService.refreshToken(refreshToken);
      this.metricsService.incrementRequests('POST', '/users/refresh-token', '200'); // Registra métrica
      return newAccessToken;
    } catch (error) {
      this.logger.error('Error al refrescar el token: ' + error.message);
      this.metricsService.incrementRequests('POST', '/users/refresh-token', '400'); // Registra error
      throw new InternalServerErrorException('Error al refrescar el token');
    }
  }
}

