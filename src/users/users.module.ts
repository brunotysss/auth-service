import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';
import { UserDao } from './dao/user.dao';
import { UserModel, UserSchema } from './models/users.model';
import { AuthModule } from '../auth/auth.module';  // Importa el AuthModule
import { LoggerService } from '../common/logger/logger.services'; // Importa el LoggerService

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    forwardRef(() => AuthModule), // Importa el AuthModule con forwardRef
  ],
  controllers: [UsersController],
  providers: [UsersService, UserDao,LoggerService],
  exports: [UsersService],
})
export class UsersModule {}
