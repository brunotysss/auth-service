import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.services';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
