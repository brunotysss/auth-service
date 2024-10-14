// src/users/services/users.service.ts
import { Injectable } from '@nestjs/common';
import { UserDao } from '../dao/user.dao';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userDao: UserDao) {}

  // Método para buscar o crear un usuario
  async findOrCreate(createUserDto: CreateUserDto) {
    // Verifica si el usuario ya existe por su googleId o email
    let user = await this.userDao.findUserByGoogleId(createUserDto.googleId);
    
    if (!user) {
      // Si no existe, crea uno nuevo en la base de datos
      user = await this.userDao.createUser(createUserDto);
    }
    
    return user;  // Devuelve el usuario existente o recién creado
  }

  // Otros métodos como encontrar por googleId, email, etc.
  async findUserByGoogleId(googleId: string) {
    return this.userDao.findUserByGoogleId(googleId);
  }

  async findUserByEmail(email: string) {
    return this.userDao.findUserByEmail(email);
  }
}
