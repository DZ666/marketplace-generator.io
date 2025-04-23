import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, RmqOptions } from '@nestjs/microservices';
import { AnalyticsModule } from './presentation/analytics.module';
import { 
  ANALYTICS_SERVICE_EXCHANGE, 
  ANALYTICS_SERVICE_QUEUE, 
  createRmqMicroserviceOptions,
  DEFAULT_ANALYTICS_PORT
} from '@marketplace/config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AnalyticsModule);
  const configService = app.get(ConfigService);
  
  // Подключаем микросервис RabbitMQ
  app.connectMicroservice(
    createRmqMicroserviceOptions(
      configService as any,
      ANALYTICS_SERVICE_QUEUE,
      ANALYTICS_SERVICE_EXCHANGE
    )
  );

  // Запускаем микросервис
  await app.startAllMicroservices();
  
  const port = configService.get('PORT') || DEFAULT_ANALYTICS_PORT;
  await app.listen(port);
  console.log(`Analytics service is running on port ${port}`);
}

bootstrap();
