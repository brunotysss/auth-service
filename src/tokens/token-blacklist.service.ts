import { Injectable } from '@nestjs/common';
import { TokenBlacklistModel } from './token-blacklist.model';

@Injectable()
export class TokenBlacklistService {
  async addToBlacklist(token: string, expiresAt: Date): Promise<void> {
    await TokenBlacklistModel.create({ token, expiresAt });
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await TokenBlacklistModel.findOne({ token });
    return !!result;
  }
}