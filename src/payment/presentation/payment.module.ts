import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from '../application/payment.service';
import { PaymentRepository } from '../infrastructure/repository/payment.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from '../domain/schema/payment.schema';
import { RabbitMQController } from '../infrastructure/messaging/rabbitmq.controller';
import { EnvironmentModule, RabbitMQModule, PAYMENT_SERVICE_EXCHANGE, PAYMENT_SERVICE_QUEUE } from '@marketplace/config';

@Module({
  imports: [
    EnvironmentModule,
    RabbitMQModule.forRoot(PAYMENT_SERVICE_EXCHANGE, PAYMENT_SERVICE_QUEUE),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }])
  ],
  controllers: [PaymentController, RabbitMQController],
  providers: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
