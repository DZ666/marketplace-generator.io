import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USER_SERVICE_EXCHANGE, USER_CREATED_PATTERN, USER_UPDATED_PATTERN } from '../../constants/rabbit-mq.constants';
import { Observable } from 'rxjs';

@Injectable()
export class RabbitMQService {
  constructor(@Inject('RABBITMQ_CLIENT') private readonly client: ClientProxy) {}

  async publishUserCreated(user: any) {
    return this.client.emit(
      { exchange: USER_SERVICE_EXCHANGE, routingKey: USER_CREATED_PATTERN },
      user
    );
  }

  async publishUserUpdated(user: any) {
    return this.client.emit(
      { exchange: USER_SERVICE_EXCHANGE, routingKey: USER_UPDATED_PATTERN },
      user
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