// src/auth/send-password-reset-email.ts
import * as nodemailer from 'nodemailer';

export async function sendPasswordResetEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperación de Contraseña',
    text: `Usa este enlace para restablecer tu contraseña: https://tu-app.com/reset-password?token=${token}`,
  };

  return transporter.sendMail(mailOptions);
}
