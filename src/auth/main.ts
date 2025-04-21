import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AuthModule } from './presentation/auth.module';
import { 
  AUTH_SERVICE_EXCHANGE, 
  AUTH_SERVICE_QUEUE, 
  createRmqMicroserviceOptions,
  DEFAULT_AUTH_PORT
} from '@marketplace/config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  
  // Подключаем микросервис RabbitMQ
  app.connectMicroservice<MicroserviceOptions>(
    createRmqMicroserviceOptions(
      configService,
      AUTH_SERVICE_QUEUE,
      AUTH_SERVICE_EXCHANGE
    )
  );

  // Запускаем микросервис
  await app.startAllMicroservices();
  
  const port = configService.get('PORT') || DEFAULT_AUTH_PORT;
  await app.listen(port);
  console.log(`Auth service is running on port ${port}`);
}

bootstrap(); 