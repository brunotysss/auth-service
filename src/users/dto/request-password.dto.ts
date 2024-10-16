// src/auth/dto/request-password.dto.ts
import { IsEmail } from 'class-validator';

export class RequestPasswordDto {
  @IsEmail()
  email: string; // El correo electrónico del usuario
}
