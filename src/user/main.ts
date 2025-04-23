import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { UserModule } from './presentation/user.module';
import { 
  USER_SERVICE_EXCHANGE, 
  USER_SERVICE_QUEUE, 
  createRmqMicroserviceOptions,
  DEFAULT_USER_PORT
} from '@marketplace/config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  const configService = app.get(ConfigService);
  
  // Подключаем микросервис RabbitMQ
  app.connectMicroservice(
    createRmqMicroserviceOptions(
      configService as any,
      USER_SERVICE_QUEUE,
      USER_SERVICE_EXCHANGE
    )
  );

  // Запускаем микросервис
  await app.startAllMicroservices();
  
  const port = configService.get('PORT') || DEFAULT_USER_PORT;
  await app.listen(port);
  console.log(`User service is running on port ${port}`);
}

bootstrap(); 