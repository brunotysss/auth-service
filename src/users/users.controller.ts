import { Controller, Post, Body , InternalServerErrorException  } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
    const user = await this.usersService.findOrCreate(createUserDto);
    return user;
  } catch (error) {
    console.error('Error during user registration:', error);
    throw new InternalServerErrorException('Failed to register user');
  }
  }
}
