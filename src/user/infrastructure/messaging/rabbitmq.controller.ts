import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ORDER_CREATED_PATTERN } from '@marketplace/config';

@Controller()
export class RabbitMQController {
  constructor() {}

  @EventPattern(ORDER_CREATED_PATTERN)
  async handleOrderCreated(@Payload() data: any) {
    console.log('Order created event received in User service:', data);
    // Обработка события создания заказа в сервисе пользователя
    // Например, обновление статистики заказов пользователя
  }
} 