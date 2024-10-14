import { Schema, Document, model } from 'mongoose';

export interface User extends Document {
  username: string;
  email: string;
  passwordHash: string;
}

export const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

// Si deseas usar el modelo también, exporta UserModel
export const UserModel = model<User>('User', UserSchema, 'users');
