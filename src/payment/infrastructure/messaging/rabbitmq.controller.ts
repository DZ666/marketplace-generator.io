import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PaymentService } from '../../application/payment.service';

@Controller()
export class RabbitMQController {
  constructor(private readonly paymentService: PaymentService) {}

  @EventPattern('payment.event')
  async handleEvent(@Payload() data: any) {
    console.log('Received message:', data);
    // Обработка событий из очереди
    return this.paymentService.processEvent(data);
  }
}
