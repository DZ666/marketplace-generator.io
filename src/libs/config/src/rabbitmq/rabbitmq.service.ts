import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(@Inject('RABBITMQ_CLIENT') private readonly client: ClientProxy) {}

  async onModuleInit() {
    try {
      await this.client.connect();
      this.logger.log('Connected to RabbitMQ');
    } catch (error) {
      this.logger.error('Error connecting to RabbitMQ:', error);
    }
  }

  /**
   * Отправить событие (без ожидания ответа)
   */
  async emit<T>(exchange: string, routingKey: string, message: T) {
    return this.client.emit<T>(
      { exchange, routingKey },
      message
    );
  }

  /**
   * Отправить сообщение и ожидать ответ
   */
  async send<T, R>(exchange: string, routingKey: string, message: T) {
    return this.client.send<R, T>(
      { exchange, routingKey },
      message
    );
  }
} 