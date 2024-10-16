// src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsString({ each: true }) // Validar que roles sea un array de strings
  roles?: string[];

  @IsString() // Asegúrate de que sea un string
  appId: string; // Agrega esta línea si no está presente

  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  googleId?: string;
}



/*
export class CreateUserDto {
  username: string;
  email: string;
  password: string;  // Este será el password sin hash, luego será hasheado antes de guardarse
  roles?: string[];   // Opcional, por defecto será ['user']
  isActive?: boolean;
  appId: string;      // Identificador de la app, siempre necesario
  profile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    phone?: string;
  };
}
*/



/*export class CreateUserDto {
  username: string;
  email: string;
  password?: string;
  googleId?: string;
}*/