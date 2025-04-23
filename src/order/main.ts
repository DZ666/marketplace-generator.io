import { NestFactory } from '@nestjs/core';
import { OrderModule } from './presentation/order.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  const port = process.env.PORT || 3003;
  await app.listen(port);
  console.log(`Order service is running on port ${port}`);
}

bootstrap(); 