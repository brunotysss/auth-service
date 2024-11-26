import { Schema, model, Document } from 'mongoose';

export interface AuditLog extends Document {
  action: string;
  userId?: string;
  details: any;
  timestamp: Date;
}

export const AuditLogSchema = new Schema({
  action: { type: String, required: true },
  userId: { type: String },
  details: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
});

export const AuditLogModel = model<AuditLog>('AuditLog', AuditLogSchema, 'audit_logs');
