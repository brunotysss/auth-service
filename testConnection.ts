import { UserModel } from './src/users/models/users.model';
import mongoose from 'mongoose';

mongoose.connect(uri)
  .then(() => {
    console.log('Conexión exitosa a MongoDB');

    // Crear un nuevo usuario
    const newUser = new UserModel({
      username: 'JohnDoe',
      email: 'johndoe@example.com',
      passwordHash: 'hashedpassword'
    });

    // Guardar el usuario en la base de datos
    return newUser.save();
  })
  .then((user) => {
    console.log('Usuario creado:', user);

    // Buscar el usuario por email
    return UserModel.findOne({ email: 'johndoe@example.com' });
  })
  .then((user) => {
    if (user) {
      console.log('Usuario encontrado:', user);
    } else {
      console.log('No se encontraron usuarios.');
    }
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error:', error);
  });
