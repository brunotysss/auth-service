import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AppGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // JWT token debe decodificar esto.
    const appId = request.headers['app-id']; // Validar el appId en el header.
    return user && appId && user.appId === appId; // Devuelve true si es válido.
  }
}
