import { Schema, Document, model } from 'mongoose';

export interface RefreshToken extends Document {
  userId: string;  // Usuario asociado al token
  token: string;   // El Refresh Token generado
  expiresAt: Date; // Fecha de expiración
}

export const RefreshTokenSchema = new Schema({
  userId: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export const RefreshTokenModel = model<RefreshToken>('RefreshToken', RefreshTokenSchema, 'refresh_tokens');
