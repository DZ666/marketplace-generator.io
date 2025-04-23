import { NestFactory } from '@nestjs/core';
import { ProductModule } from './presentation/product.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`Product service is running on port ${port}`);
}

bootstrap(); 