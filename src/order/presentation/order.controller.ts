import { Controller, Get } from '@nestjs/common';
import { OrderService } from '../application/order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getOrders() {
    return this.orderService.getOrders();
  }
} 