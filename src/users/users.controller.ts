import { Controller, Post, Body, InternalServerErrorException, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.services';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';  // Importa el guard de JWT
import { RolesGuard } from '../auth/roles.guard';  // Importa el RolesGuard
import { Roles } from '../auth/roles.decorator';  // Importa el decorador Roles
import { RequestPasswordDto } from './dto/request-password.dto'; // Asegúrate de tener el DTO para la solicitud
import { ResetPasswordDto } from './dto/reset-password.dto'; // Asegú
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('Registrando usuario:', createUserDto);

    try {
      const user = await this.usersService.findOrCreate(createUserDto);
      return user;
    } catch (error) {
      console.error('Error during user registration:', error);
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

  @Post('protected')
  @UseGuards(JwtAuthGuard)  // Usa el guard de JWT para proteger esta ruta
  async getProtected(@Req() req: any) {
    return req.user;
  }

  // Ruta protegida solo para admins
  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)  // Usa JwtAuthGuard y RolesGuard
  @Roles('admin')  // Solo accesible para admins
  async adminOnlyRoute(@Req() req: any) {
    return { message: 'Solo los admins pueden ver esto' };
  }

// rutas para resetear la contraseña y obtener link para el correo
@Post('request-password-reset')
  async requestPasswordReset(@Body() requestPasswordDto: RequestPasswordDto) {
    try {
      const token = await this.authService.generatePasswordResetToken(requestPasswordDto.email);
      return { message: 'Token de recuperación enviado', token };
    } catch (error) {
      throw new InternalServerErrorException('Error al solicitar recuperación de contraseña');
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      const result = await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error al restablecer la contraseña');
    }
  }

}
