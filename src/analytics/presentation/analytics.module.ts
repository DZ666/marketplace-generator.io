import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from '../application/analytics.service';
import { RabbitMQController } from '../infrastructure/messaging/rabbitmq.controller';
import { EnvironmentModule, RabbitMQModule, ANALYTICS_SERVICE_EXCHANGE, ANALYTICS_SERVICE_QUEUE } from '@marketplace/config';

@Module({
  imports: [
    EnvironmentModule,
    RabbitMQModule.forRoot(ANALYTICS_SERVICE_EXCHANGE, ANALYTICS_SERVICE_QUEUE)
  ],
  controllers: [AnalyticsController, RabbitMQController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {} 
