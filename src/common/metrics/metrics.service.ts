import { Injectable } from '@nestjs/common';
import { Counter, register } from 'prom-client';

@Injectable()
export class MetricsService {
  private static requestsCounter: Counter<string>;

  constructor() {
    // Comprueba si la métrica ya está registrada
    if (!MetricsService.requestsCounter) {
      MetricsService.requestsCounter = new Counter({
        name: 'http_requests_total',
        help: 'Total number of HTTP requests',
        labelNames: ['method', 'route', 'statusCode'],
      });
    }
  }

  incrementRequests(method: string, route: string, statusCode: string) {
    MetricsService.requestsCounter.inc({ method, route, statusCode });
  }
}
