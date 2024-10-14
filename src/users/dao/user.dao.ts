// src/users/dao/user.dao.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserModel } from '../models/user.model';

@Injectable()
export class UserDao {
  async createUser(createUserDto: CreateUserDto) {
    return await UserModel.create(createUserDto);  // Aquí se utiliza la colección `users`
  }

  async findUserByGoogleId(googleId: string) {
    return await UserModel.findOne({ googleId }).exec();  // Busca en la colección `users`
  }

  async findUserByEmail(email: string) {
    return await UserModel.findOne({ email }).exec();  // Busca en la colección `users`
  }
}
