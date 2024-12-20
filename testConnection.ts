import mongoose from 'mongoose';
import { UserModel } from './src/users/models/users.model';


mongoose.connect(uri)
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
    return UserModel.findOne({ googleId: 'someGoogleId123' });
  })
  .then((user) => {
    if (user) {
     // console.log('Usuario encontrado:', user);
    } else {
      console.log('No se encontraron usuarios.');
    }
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
  });
