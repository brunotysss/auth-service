import { Injectable } from '@nestjs/common';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly requestsCounter: Counter<string>;
  private readonly responseTimeHistogram: Histogram<string>;

  constructor() {
    this.requestsCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route'],
    });

    this.responseTimeHistogram = new Histogram({
      name: 'http_response_time_seconds',
      help: 'Response time in seconds',
      labelNames: ['method', 'route'],
    });
  }

  incrementRequests(method: string, route: string, duration: number) {
    this.requestsCounter.inc({ method, route });
    this.responseTimeHistogram.observe({ method, route }, duration / 1000); // Convierte milisegundos a segundos
  }
}
