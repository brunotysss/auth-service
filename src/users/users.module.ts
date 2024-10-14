import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';
import { UserDao } from './dao/user.dao';  // Si tienes un DAO, inclúyelo
import { UserModel, UserSchema } from './models/users.model';  // Importa tu modelo de Mongoose

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),  // Vincula tu modelo de Mongoose
  ],
  controllers: [UsersController],  // Define el controlador para manejar las rutas de usuarios
  providers: [UsersService, UserDao],  // Define los servicios y DAOs como proveedores
  exports: [UsersService],  // Si necesitas que otros módulos accedan a UsersService, expórtalo
})
export class UsersModule {}
