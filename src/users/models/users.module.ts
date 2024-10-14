// src/users/models/user.model.ts
import { Schema, Document, model } from 'mongoose';

export interface User extends Document {
  username: string;
  email: string;
  passwordHash: string;
}

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

export const UserModel = model<User>('User', UserSchema);
