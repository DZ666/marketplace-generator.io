import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AnalyticsService } from '../../application/analytics.service';

@Controller()
export class RabbitMQController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @EventPattern('analytics.event')
  async handleEvent(@Payload() data: any) {
    console.log('Received message:', data);
    // Обработка событий из очереди
    return this.analyticsService.processEvent(data);
  }
}
