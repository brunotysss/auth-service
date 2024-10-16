// src/users/factory/user.factory.ts
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

export class UserFactory {
  static create(createUserDto: CreateUserDto) {
    const hashedPassword = this.hashPassword(createUserDto.password);
    
    const user = {
      username: createUserDto.username,
      email: createUserDto.email,
      passwordHash: hashedPassword,
      roles: ['user'],  // Rol por defecto
      isActive: true,   // Por defecto, el usuario está activo
      createdAt: new Date(),  // Fecha de creación
      updatedAt: new Date(),  // Fecha de actualización
      lastLogin: null,  // El último inicio de sesión puede ser null hasta que el usuario inicie sesión por primera vez
      appId: createUserDto.appId, // Asegúrate de que appId se pase aquí
      profile: {  // Información adicional del perfil del usuario
        firstName: createUserDto.firstName || '',
        lastName: createUserDto.lastName || '',
        avatar: createUserDto.avatar || '',
        phone: createUserDto.phone || '',
      }
    };
    
    return user;
  }

  private static hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt); 
  }
}
