import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '../application/user.service';
import { RabbitMQController } from '../infrastructure/messaging/rabbitmq.controller';
import { EnvironmentModule, RabbitMQModule, USER_SERVICE_EXCHANGE, USER_SERVICE_QUEUE } from '@marketplace/config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    EnvironmentModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dev', '.env.prod', '.env.test'],
    }),
    RabbitMQModule.forRoot(USER_SERVICE_EXCHANGE, USER_SERVICE_QUEUE)
  ],
  controllers: [UserController, RabbitMQController],
  providers: [UserService],
})
export class UserModule {} 