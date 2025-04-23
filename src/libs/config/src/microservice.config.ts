import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

export function createRmqMicroserviceOptions(
  configService: ConfigService<Record<string, unknown>, false>,
  queueName: string,
  exchangeName: string
) {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: queueName,
      queueOptions: {
        durable: true,
      },
    },
  };
} 