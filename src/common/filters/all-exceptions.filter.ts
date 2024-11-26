import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { LoggerService } from '../logger/logger.services';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    const errorResponse = {
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception instanceof HttpException ? exception.message : 'Internal Server Error',
    };

    this.logger.error(JSON.stringify(errorResponse));

    response.status(status).json(errorResponse);
  }
}
