// src/users/factory/user.factory.ts
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

export class UserFactory {
  static create(createUserDto: CreateUserDto) {
    const hashedPassword = this.hashPassword(createUserDto.password);

    const user = {
      username: createUserDto.username, // Nombre de usuario
      email: createUserDto.email, // Correo electrónico
      passwordHash: hashedPassword, // Contraseña hasheada
      roles: ['user'], // Rol predeterminado
      isActive: true, // El usuario está activo por defecto
      createdAt: new Date(), // Fecha de creación
      updatedAt: new Date(), // Fecha de última actualización
      lastLogin: null, // Último inicio de sesión (null por defecto)
      appId: createUserDto.appId, // Identificador de la aplicación
    };

    return user;
  }

  private static hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
}
