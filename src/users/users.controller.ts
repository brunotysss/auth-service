import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  UseGuards,
  Req,
  Get,
  Render,
  Query,
} from '@nestjs/common';
import { UsersService } from './services/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.services';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';  // Importa el guard de JWT
import { RolesGuard } from '../auth/roles.guard';  // Importa el RolesGuard
import { Roles } from '../auth/roles.decorator';  // Importa el decorador Roles
import { RequestPasswordDto } from './dto/request-password.dto'; // Asegúrate de tener el DTO para la solicitud
import { ResetPasswordDto } from './dto/reset-password.dto'; // Asegú
import { LoggerService } from '../common/services/logger.services'; // Importa el LoggerService
import { MetricsService } from '../common/services/metrics.service'; // Importa el MetricsService

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly logger: LoggerService, // Inyecta el LoggerService
    private readonly metricsService: MetricsService, // Inyecta el MetricsService
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    this.logger.info(`Registrando usuario: ${JSON.stringify(createUserDto)}`);

    try {
      const user = await this.usersService.findOrCreate(createUserDto);
      return user;
    } catch (error) {
      this.logger.error('Error durante el registro del usuario: ' + error.message);
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  @Post('login')
  async login(@Body() userDto: any) {
    const user = await this.authService.validateUser(userDto.email, userDto.password);
    if (!user) {
      return { message: 'Usuario o contraseña incorrecta' };
    }
    return this.authService.login(user);
  }

  @Get('reset-password')
  @Render('reset-password')
  resetPasswordView(@Query('token') token: string) {
    try {
      this.logger.info('Accediendo a la vista de reset-password con token:', token);
      return { token }; // Pasa el token a la vista
    } catch (error) {
      this.logger.error('Error al acceder a la vista de reset-password: ' + error.message);
      throw new InternalServerErrorException('Error al acceder a la vista de restablecimiento de contraseña');
    }
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body() requestPasswordDto: RequestPasswordDto) {
    try {
      const token = await this.authService.generatePasswordResetToken(requestPasswordDto.email);
      this.logger.info(`Token de recuperación enviado a: ${requestPasswordDto.email}`);
      return { message: 'Token de recuperación enviado', token };
    } catch (error) {
      this.logger.error('Error al solicitar recuperación de contraseña: ' + error.message);
      throw new InternalServerErrorException('Error al solicitar recuperación de contraseña');
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      const result = await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
      this.logger.info('Contraseña restablecida correctamente');
      return result;
    } catch (error) {
      this.logger.error('Error al restablecer la contraseña: ' + error.message);
      throw new InternalServerErrorException('Error al restablecer la contraseña');
    }
  }
}
