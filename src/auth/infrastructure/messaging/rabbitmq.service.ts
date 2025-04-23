import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE_EXCHANGE, VALIDATE_USER_PATTERN } from '../../constants/rabbit-mq.constants';

@Injectable()
export class RabbitMQService {
  constructor(@Inject('RABBITMQ_CLIENT') private readonly client: ClientProxy) {}

  async validateUser(userId: number, token: string) {
    return this.client.send(
      { exchange: AUTH_SERVICE_EXCHANGE, routingKey: VALIDATE_USER_PATTERN },
      { userId, token }
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