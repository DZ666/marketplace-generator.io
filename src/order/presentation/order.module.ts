import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from '../application/order.service';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {} 