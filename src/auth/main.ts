import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, RmqOptions } from '@nestjs/microservices';
import { AuthModule } from './presentation/auth.module';
import { 
  AUTH_SERVICE_EXCHANGE, 
  AUTH_SERVICE_QUEUE, 
  createRmqMicroserviceOptions,
  DEFAULT_AUTH_PORT
} from '@marketplace/config';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  
  // Подключаем микросервис RabbitMQ
  app.connectMicroservice(
    createRmqMicroserviceOptions(
      configService as any,
      AUTH_SERVICE_QUEUE,
      AUTH_SERVICE_EXCHANGE
    )
  );

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'supersecret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24, // 1 день
        sameSite: 'lax',
      },
    }),
  );

  // Запускаем микросервис
  await app.startAllMicroservices();
  
  const port = configService.get('PORT') || DEFAULT_AUTH_PORT;
  await app.listen(port);
  console.log(`Auth service is running on port ${port}`);
}

bootstrap(); 