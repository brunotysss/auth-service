import { Injectable } from '@nestjs/common';
import { AuditLogModel } from './audit-log.model';

@Injectable()
export class AuditLogService {
  async logAction(action: string, userId: string | null, appId: string, details?: any) {
    await AuditLogModel.create({
      action,
      userId,
      appId,
      details,
      timestamp: new Date(),
    });
  }
}
