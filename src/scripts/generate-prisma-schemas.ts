import { promises as fs } from 'fs';
import * as path from 'path';

const BASE_SCHEMA = (modelName: string) => `generator client {
  provider = "prisma-client-js"
}

generator zod {
  provider = "zod-prisma-types"
  output   = "../zod"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model ${modelName} {
  id    String @id @default(uuid())
  name  String
}
`;

const SERVICE_MODELS: Record<string, string> = {
  user: 'User',
  product: 'Product',
  order: 'Order',
  analytics: 'Analytics',
  payment: 'Payment',
  auth: 'Auth',
};

async function main() {
  const srcDir = path.resolve(__dirname, '../');
  const services = Object.keys(SERVICE_MODELS);

  for (const service of services) {
    const prismaDir = path.join(srcDir, service, 'prisma');
    const schemaPath = path.join(prismaDir, 'schema.prisma');
    try {
      await fs.access(schemaPath);
      console.log(`[${service}] schema.prisma уже существует, пропускаю.`);
    } catch {
      // Файла нет — создаём
      await fs.mkdir(prismaDir, { recursive: true });
      await fs.writeFile(schemaPath, BASE_SCHEMA(SERVICE_MODELS[service]));
      console.log(`[${service}] schema.prisma создан.`);
    }
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}); 