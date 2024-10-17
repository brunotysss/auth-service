import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      error: exception instanceof HttpException ? exception.getResponse() : 'Internal Server Error',
    });
  }
}
