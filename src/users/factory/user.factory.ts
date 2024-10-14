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
    };
    return user;
  }

  private static hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt); 
  }
}
