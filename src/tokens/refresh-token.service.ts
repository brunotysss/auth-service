import { Injectable } from '@nestjs/common';
import { RefreshTokenModel } from '../auth/models/refresh-token.model';

@Injectable()
export class RefreshTokenService {
  async createRefreshToken(userId: string, token: string, expiresAt: Date) {
    return RefreshTokenModel.create({ userId, token, expiresAt });
  }

  async revokeRefreshToken(token: string) {
    return RefreshTokenModel.deleteOne({ token });
  }

  async validateRefreshToken(token: string) {
    const storedToken = await RefreshTokenModel.findOne({ token });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }
    return storedToken;
  }
}
