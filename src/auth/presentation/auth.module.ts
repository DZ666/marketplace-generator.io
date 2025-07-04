import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from '../application/auth.service';
import { RabbitMQController } from '../infrastructure/messaging/rabbitmq.controller';
import { EnvironmentModule, RabbitMQModule, AUTH_SERVICE_EXCHANGE, AUTH_SERVICE_QUEUE } from '@marketplace/config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    EnvironmentModule,
    RabbitMQModule.forRoot(AUTH_SERVICE_EXCHANGE, AUTH_SERVICE_QUEUE),
    ConfigModule
  ],
  controllers: [AuthController, RabbitMQController],
  providers: [AuthService],
})
export class AuthModule {} 