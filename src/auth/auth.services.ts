// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/services/users.service';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { RefreshTokenModel } from '../auth/models/refresh-token.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      return user;
    }
    return null;
  }
  
/*
  async login(user: any) {
    const payload = { email: user.email, sub: user._id };  // Si usas _id en MongoDB
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}*/
/*
async login(user: any) {
  const payload = { email: user.email, sub: user._id, roles: user.roles };
  return {
    access_token: this.jwtService.sign(payload),
  };
}
*/
async login(user: any) {
  const accessToken = this.jwtService.sign(
    { email: user.email, sub: user._id, roles: user.roles },
    { secret: process.env.JWT_SECRET, expiresIn: '15m' } // Token de acceso de corta duración
  );

  const refreshToken = this.jwtService.sign(
    { sub: user._id },
    { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '7d' } // Token de refresco válido por 7 días
  );

  // Guardar el Refresh Token en la base de datos
  await RefreshTokenModel.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken,
    refreshToken,
  };
}


async refreshToken(refreshToken: string) {
  const storedToken = await RefreshTokenModel.findOne({ token: refreshToken });
  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new Error('Refresh token inválido o expirado');
  }

  const newAccessToken = this.jwtService.sign(
    { sub: storedToken.userId },
    { secret: process.env.JWT_SECRET, expiresIn: '15m' }
  );

  return { accessToken: newAccessToken };
}




// para recuperar contraseña
async generatePasswordResetToken(email: string) {
  const user = await this.usersService.findUserByEmail(email);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  const payload = { sub: user._id, email: user.email };
  const resetToken = this.jwtService.sign(payload, {
    secret: process.env.JWT_SECRET,
    expiresIn: '60m', // El token de recuperación expirará en 15 minutos
  });
 // Envía el correo electrónico
 await this.sendPasswordResetEmail(email, resetToken);  // <-- Llama aquí
  // Aquí puedes agregar lógica para enviar el token por correo electrónico
  return resetToken;
}

async resetPassword(token: string, newPassword: string) {
  try {
    const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    const user = await this.usersService.findUserByEmail(decoded.email);
    if (!user) {
      throw new Error('Token inválido o expirado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashedPassword;
    await user.save();

    return { message: 'Contraseña restablecida correctamente' };
  } catch (error) {
    throw new Error('Token inválido o expirado');
  } }

  async sendPasswordResetEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // O el servicio que estés utilizando
        auth: {
            user: process.env.EMAIL_USER, // Tu correo electrónico
            pass: process.env.EMAIL_PASS,  // Tu contraseña de aplicación o contraseña de correo
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Recuperación de Contraseña',
        text: `Usa este enlace para restablecer tu contraseña: http://localhost:3000/users/reset-password?token=${token}`,
      };

    return transporter.sendMail(mailOptions);
}

}