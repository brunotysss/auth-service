import { Global, Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';

@Global() // Permite que esté disponible globalmente
@Module({
  providers: [MetricsService],
  exports: [MetricsService], // Lo exporta para que otros módulos puedan usarlo
  controllers: [MetricsController],

})
export class MetricsModule {}
