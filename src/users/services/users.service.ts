// src/users/services/users.service.ts
import { Injectable , InternalServerErrorException } from '@nestjs/common';
import { UserDao } from '../dao/user.dao';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UsersService {
  constructor(private readonly userDao: UserDao) {}

  // Método para buscar o crear un usuario
  /*async findOrCreate(createUserDto: CreateUserDto) {
    try { 
      console.log('Buscando usuario por Google ID o Email');

    // Verifica si el usuario ya existe por su googleId o email
   let user = await this.userDao.findUserByGoogleId(createUserDto.googleId);
    //console.log('xd');

    if (!user) {
      console.log('Usuario no encontrado, creando uno nuevo');
      
      user = await this.userDao.createUser(createUserDto);
    }
    return user;

  } catch (error) {
    console.error('Error in UsersService.createUser:', error);
    throw new InternalServerErrorException('Error creating user');
  }
  }*/
  async findOrCreate(createUserDto: CreateUserDto) {
    try {
        console.log('Buscando usuario por email');
        // Busca al usuario por email
        let user = await this.userDao.findUserByEmail(createUserDto.email);
        
        if (user) {
            console.log('El usuario ya existe:', user);
            throw new InternalServerErrorException('El usuario ya existe');
        }

        console.log('Creando nuevo usuario:', createUserDto);
        user = await this.userDao.createUser(createUserDto);
        return user;
    } catch (error) {
        console.error('Error in UsersService.findOrCreate:', error);
        throw new InternalServerErrorException('Error al registrar el usuario');
    }
}
  // Otros métodos como encontrar por googleId, email, etc.
  async findUserByGoogleId(googleId: string) {
    return this.userDao.findUserByGoogleId(googleId);
  }

  async findUserByEmail(email: string) {
    return this.userDao.findUserByEmail(email);
  }



}





