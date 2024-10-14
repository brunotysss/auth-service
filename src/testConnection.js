const mongoose = require('mongoose');
const { UserModel } = require('./users/models/users.model');

const uri = 'mongodb+srv://BRUNOTI:Cbfp4300@testbackend.qusl0lt.mongodb.net/auth-service?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
    return UserModel.findOne({});
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
    console.error('Error al conectar a MongoDB:', error);
  });
