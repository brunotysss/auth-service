// src/auth/dto/reset-password.dto.ts
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token: string; // El token para restablecer la contraseña

  @IsString()
  @MinLength(6)
  newPassword: string; // La nueva contraseña
}
