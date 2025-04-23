import { NestFactory } from '@nestjs/core';
import { adminModule } from './presentation/admin.module';
import { DEFAULT_ADMIN_PORT } from '@marketplace/config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(adminModule);
  const configService = app.get(ConfigService);
  
  const port = configService.get('PORT') || DEFAULT_ADMIN_PORT;
  await app.listen(port);
  console.log(`admin service is running on port ${port}`);
}

bootstrap();
