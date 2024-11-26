import { Schema, Document, model } from 'mongoose';
import { MetricsService } from '../../common/metrics/metrics.service'; // Asegúrate de ajustar la ruta

const metricsService = new MetricsService(); // Instancia temporal para métricas

export interface User extends Document {
  username: string;
  email: string;
  passwordHash: string;
  roles: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  appId: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    phone?: string;
  };
}

export const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: ['user'] },  // Múltiples roles
  isActive: { type: Boolean, default: true },    // Controla si el usuario está activo
  createdAt: { type: Date, default: Date.now },  // Fecha de creación
  updatedAt: { type: Date, default: Date.now },  // Fecha de última actualización
  lastLogin: { type: Date },                     // Fecha de último inicio de sesión
  appId: { type: String, required: true },       // Identificador de la app
  profile: {
    firstName: { type: String },
    lastName: { type: String },
    avatar: { type: String },
    phone: { type: String },
  },
});

// Crear índices únicos en `email` y `username`
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });

// Middleware para registrar métricas
// Middleware para registrar métricas en creación
UserSchema.post('save', function () {
  metricsService.incrementRequests('CREATE', 'UserModel', '200');
});

// Middleware para registrar métricas en actualización
UserSchema.post('updateOne', function () {
  metricsService.incrementRequests('UPDATE', 'UserModel', '200');
});

UserSchema.post('findOneAndUpdate', function () {
  metricsService.incrementRequests('FIND_AND_UPDATE', 'UserModel', '200');
});

UserSchema.post('updateMany', function () {
  metricsService.incrementRequests('BULK_UPDATE', 'UserModel', '200');
});

// Middleware para registrar métricas en eliminación
UserSchema.post('deleteOne', function () {
  metricsService.incrementRequests('DELETE', 'UserModel', '200');
});
export const UserModel = model<User>('User', UserSchema, 'users');
