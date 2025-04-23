import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { PaymentModule } from './presentation/payment.module';
import { 
  PAYMENT_SERVICE_EXCHANGE, 
  PAYMENT_SERVICE_QUEUE, 
  createRmqMicroserviceOptions,
  DEFAULT_PAYMENT_PORT
} from '@marketplace/config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);
  const configService = app.get(ConfigService);
  
  // Подключаем микросервис RabbitMQ
  app.connectMicroservice(
    createRmqMicroserviceOptions(
      configService as any,
      PAYMENT_SERVICE_QUEUE,
      PAYMENT_SERVICE_EXCHANGE
    )
  );

  // Запускаем микросервис
  await app.startAllMicroservices();
  
  const port = configService.get('PORT') || DEFAULT_PAYMENT_PORT;
  await app.listen(port);
  console.log(`Payment service is running on port ${port}`);
}

bootstrap();
