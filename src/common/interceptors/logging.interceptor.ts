import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();

    console.log(`Handling request: ${request.method} ${request.url}`);

    return next.handle().pipe(
      tap(() =>
        console.log(`Finished handling request in ${Date.now() - now}ms`),
      ),
    );
  }
}
