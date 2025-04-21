import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from './rabbitmq.service';
import { USER_SERVICE_EXCHANGE } from '../../constants/rabbit-mq.constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://user:password@rabbitmq:5672'],
          queue: 'user_service_queue',
          queueOptions: {
            durable: true,
          },
          exchanges: [
            {
              name: USER_SERVICE_EXCHANGE,
              type: 'topic',
            },
          ],
        },
      },
    ]),
  ],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {} 