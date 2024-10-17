// metrics.service.ts
import { Injectable } from '@nestjs/common';
import { Counter } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly requestsCounter: Counter<string>;

  constructor() {
    this.requestsCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route'],
    });
  }

  incrementRequests(method: string, route: string) {
    this.requestsCounter.inc({ method, route });
  }
}
