import { Module } from '@nestjs/common';
import { TokenBlacklistService } from './token-blacklist.service';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  providers: [TokenBlacklistService, RefreshTokenService],
  exports: [TokenBlacklistService, RefreshTokenService],
})
export class TokenModule {}
