import { Schema, model, Document } from 'mongoose';

export interface TokenBlacklist extends Document {
  token: string;
  expiresAt: Date;
}

export const TokenBlacklistSchema = new Schema({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export const TokenBlacklistModel = model<TokenBlacklist>(
  'TokenBlacklist',
  TokenBlacklistSchema,
  'token_blacklist',
);
