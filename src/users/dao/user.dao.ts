import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserModel } from '../models/users.model';
import { UserFactory } from '../factory/user.factory';

@Injectable()
export class UserDao {
  async createUser(createUserDto: CreateUserDto) {
    try {
      console.log('yella');
      const userToSave = UserFactory.create(createUserDto);  // Usa el factory para crear el usuario
      const newUser = await UserModel.create(userToSave);  // Inserta en MongoDB
      return newUser;
    } catch (error) {
      console.error('Error in UserDao.createUser:', error);  // Captura el error
      throw new Error('Error while saving user to the database');
    }
  }

  async findUserByGoogleId(googleId: string) {
    try {
      console.log('Buscando en MongoDB por googleId:', googleId);
      const user = await UserModel.findOne({ googleId });
      console.log('Usuario encontrado:', user);
      return user;
    } catch (error) {
      console.error('Error buscando usuario por googleId:', error);
      throw error;
    }
  }

  async findUserByEmail(email: string) {
    try {
      return await UserModel.findOne({ email }).exec();  // Busca en la colección `users`
    } catch (error) {
      console.error('Error buscando usuario por email:', error);
      throw error;
    }
  }
}
