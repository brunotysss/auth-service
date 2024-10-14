export class CreateUserDto {
  username: string;
  email: string;
  password?: string;  // Puede ser opcional si estás usando Google
  googleId?: string;   // Este campo debe estar aquí si estás buscando por googleId
}
