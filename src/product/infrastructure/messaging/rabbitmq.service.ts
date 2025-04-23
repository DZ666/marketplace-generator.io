import { Observable } from 'rxjs';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  PRODUCT_SERVICE_EXCHANGE,
  PRODUCT_CREATED_PATTERN,
  PRODUCT_UPDATED_PATTERN
} from '../../constants/rabbit-mq.constants';

@Injectable()
export class RabbitMQService {
  constructor(@Inject('RABBITMQ_CLIENT') private readonly client: ClientProxy) {}

  async publishProductCreated(product: any) {
    return this.client.emit(
      { exchange: PRODUCT_SERVICE_EXCHANGE, routingKey: PRODUCT_CREATED_PATTERN },
      product
    );
  }

  async publishProductUpdated(product) {
    return this.client.emit(
      { exchange: PRODUCT_SERVICE_EXCHANGE, routingKey: PRODUCT_UPDATED_PATTERN },
      product
    );
  }

  async onApplicationBootstrap() {
    try {
      await this.client.connect();
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.log('Error connecting to RabbitMQ', error);
    }
  }
} 