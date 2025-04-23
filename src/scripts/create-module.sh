#!/bin/bash

# Устанавливаем цвета для вывода
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
CYAN="\033[0;36m"
NC="\033[0m" # No Color

# Проверяем наличие аргументов
if [ $# -lt 1 ]; then
  echo -e "${RED}Ошибка: Необходимо указать имя модуля${NC}"
  echo -e "Использование: $0 <имя_модуля> [опции]"
  echo -e "Опции:"
  echo -e "  --port <порт>             Порт для микросервиса (по умолчанию: подбирается автоматически)"
  echo -e "  --description <описание>  Описание модуля"
  echo -e "  --microservice            Настроить как микросервис с RabbitMQ"
  echo -e "  --rest-api                Настроить как REST API"
  echo -e "  --db <тип>                Добавить поддержку базы данных (mongodb, postgres)"
  exit 1
fi

# Путь к корню проекта
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SRC_DIR="$PROJECT_ROOT/src"
CONFIG_DIR="$PROJECT_ROOT/src/libs/config"

# Имя модуля (первый аргумент)
MODULE_NAME="$1"
shift

# Парсим опции
DESCRIPTION="Microservice for marketplace"
IS_MICROSERVICE=false
IS_REST_API=true
DB_TYPE=""
PORT=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --port)
      PORT="$2"
      shift 2
      ;;
    --description)
      DESCRIPTION="$2"
      shift 2
      ;;
    --microservice)
      IS_MICROSERVICE=true
      shift
      ;;
    --rest-api)
      IS_REST_API=true
      shift
      ;;
    --db)
      DB_TYPE="$2"
      shift 2
      ;;
    *)
      echo -e "${RED}Неизвестная опция: $1${NC}"
      exit 1
      ;;
  esac
done

# Преобразовываем имя модуля в нижний регистр
MODULE_NAME_LOWER=$(echo "$MODULE_NAME" | tr '[:upper:]' '[:lower:]')
MODULE_DIR="$SRC_DIR/$MODULE_NAME_LOWER"

# Проверяем существование директории модуля
if [ -d "$MODULE_DIR" ]; then
  echo -e "${RED}Ошибка: Модуль $MODULE_NAME_LOWER уже существует${NC}"
  exit 1
fi

# Создаем директорию модуля и базовую структуру
echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}=     Создание нового модуля: ${GREEN}$MODULE_NAME_LOWER${BLUE}     =${NC}"
echo -e "${BLUE}=========================================================${NC}"

echo -e "${YELLOW}Создание базовой структуры модуля...${NC}"
mkdir -p "$MODULE_DIR"
mkdir -p "$MODULE_DIR/presentation"
mkdir -p "$MODULE_DIR/application"
mkdir -p "$MODULE_DIR/domain"
mkdir -p "$MODULE_DIR/infrastructure"
mkdir -p "$MODULE_DIR/constants"

# Создаем базовый package.json
echo -e "${YELLOW}Создание package.json...${NC}"

# Определяем номер порта
if [ -z "$PORT" ]; then
  # Находим последний порт в service.constants.ts и увеличиваем на 1
  LAST_PORT=$(grep -E "DEFAULT_.*_PORT = [0-9]+" "$CONFIG_DIR/src/constants/service.constants.ts" | sort -r | head -n 1 | grep -o '[0-9]\+')
  PORT=$((LAST_PORT + 1))
  EXTERNAL_PORT=$((PORT + 1000))
fi

# Формируем имя сервиса для констант
SERVICE_NAME_CONST=$(echo "$MODULE_NAME_LOWER" | tr '-' '_' | tr '[:lower:]' '[:upper:]')

cat > "$MODULE_DIR/package.json" << EOF
{
  "name": "${MODULE_NAME_LOWER}-service",
  "version": "0.0.1",
  "description": "${DESCRIPTION}",
  "scripts": {
    "build": "tsc",
    "start": "node dist/main.js",
    "dev": "nodemon --config nodemon.json"
  },
  "dependencies": {
    "@marketplace/config": "file:../libs/config",
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^4.0.2",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/node": "^20.3.1",
    "nodemon": "^3.0.1",
    "ts-node": "^10.0.0",
    "typescript": "^5.1.3"
  }
}
EOF

# Создаем tsconfig.json
echo -e "${YELLOW}Создание tsconfig.json...${NC}"
cat > "$MODULE_DIR/tsconfig.json" << EOF
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2017",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}
EOF

# Создаем nodemon.json
echo -e "${YELLOW}Создание nodemon.json...${NC}"
cat > "$MODULE_DIR/nodemon.json" << EOF
{
  "watch": ["*.ts"],
  "ignore": ["node_modules"],
  "exec": "ts-node main.ts"
}
EOF

# Создаем .dockerignore
echo -e "${YELLOW}Создание .dockerignore...${NC}"
cat > "$MODULE_DIR/.dockerignore" << EOF
node_modules
npm-debug.log
dist
EOF

# Создаем Dockerfile
echo -e "${YELLOW}Создание Dockerfile...${NC}"
cat > "$MODULE_DIR/Dockerfile" << EOF
FROM node:20-alpine

WORKDIR /app

# В режиме разработки монтируем volume с кодом,
# а зависимости проверяем через скрипт
COPY package*.json ./

# Копируем исходный код только для non-dev окружений
# В dev режиме код будет монтироваться через volume
COPY . .

EXPOSE $PORT

# В dev режиме используем скрипт для проверки node_modules
# В production - просто устанавливаем зависимости и запускаем
CMD [ "sh", "-c", "if [ \"\$NODE_ENV\" = \"development\" ]; then /scripts/check-install-deps.sh npm run dev; else npm cache clean --force && npm install && npm run start; fi" ]
EOF

# Добавляем зависимости в package.json если выбран RabbitMQ
if [ "$IS_MICROSERVICE" = true ]; then
  echo -e "${YELLOW}Настройка модуля как микросервиса с RabbitMQ...${NC}"
  
  # Создаем директорию для messaging
  mkdir -p "$MODULE_DIR/infrastructure/messaging"
  
  # Добавляем зависимости для RabbitMQ
  # Используем sed для добавления новых зависимостей перед последней скобкой в секции dependencies
  sed -i '/"dependencies": {/,/}/{s/"rxjs": "\^7.8.1"/"rxjs": "\^7.8.1",\n    "@nestjs\/microservices": "\^10.4.17",\n    "amqp-connection-manager": "\^4.1.14",\n    "amqplib": "\^0.10.3"/}' "$MODULE_DIR/package.json"
  
  # Создаем RabbitMQ контроллер
  cat > "$MODULE_DIR/infrastructure/messaging/rabbitmq.controller.ts" << EOF
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ${MODULE_NAME}Service } from '../../application/${MODULE_NAME_LOWER}.service';

@Controller()
export class RabbitMQController {
  constructor(private readonly ${MODULE_NAME_LOWER}Service: ${MODULE_NAME}Service) {}

  @EventPattern('${MODULE_NAME_LOWER}.event')
  async handleEvent(@Payload() data: any) {
    console.log('Received message:', data);
    // Обработка событий из очереди
    return this.${MODULE_NAME_LOWER}Service.processEvent(data);
  }
}
EOF
fi

# Добавляем поддержку базы данных, если указана
if [ -n "$DB_TYPE" ]; then
  echo -e "${YELLOW}Добавление поддержки базы данных: ${DB_TYPE}...${NC}"
  
  # Создаем директорию для репозитория
  mkdir -p "$MODULE_DIR/infrastructure/repository"
  
  case "$DB_TYPE" in
    mongodb)
      # Добавляем зависимости для MongoDB
      sed -i '/"dependencies": {/,/}/{s/"rxjs": "\^7.8.1"/"rxjs": "\^7.8.1",\n    "@nestjs\/mongoose": "\^10.0.1",\n    "mongoose": "\^7.6.3"/}' "$MODULE_DIR/package.json"
      
      # Создаем схему для MongoDB
      mkdir -p "$MODULE_DIR/domain/schema"
      cat > "$MODULE_DIR/domain/schema/${MODULE_NAME_LOWER}.schema.ts" << EOF
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ${MODULE_NAME}Document = ${MODULE_NAME} & Document;

@Schema()
export class ${MODULE_NAME} {
  @Prop({ required: true })
  name: string;
  
  @Prop()
  description: string;
  
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ${MODULE_NAME}Schema = SchemaFactory.createForClass(${MODULE_NAME});
EOF
      
      # Создаем репозиторий для MongoDB
      cat > "$MODULE_DIR/infrastructure/repository/${MODULE_NAME_LOWER}.repository.ts" << EOF
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ${MODULE_NAME}, ${MODULE_NAME}Document } from '../../domain/schema/${MODULE_NAME_LOWER}.schema';

@Injectable()
export class ${MODULE_NAME}Repository {
  constructor(
    @InjectModel(${MODULE_NAME}.name)
    private ${MODULE_NAME_LOWER}Model: Model<${MODULE_NAME}Document>,
  ) {}

  async findAll(): Promise<${MODULE_NAME}[]> {
    return this.${MODULE_NAME_LOWER}Model.find().exec();
  }

  async findById(id: string): Promise<${MODULE_NAME}> {
    return this.${MODULE_NAME_LOWER}Model.findById(id).exec();
  }

  async create(data: Partial<${MODULE_NAME}>): Promise<${MODULE_NAME}> {
    const new${MODULE_NAME} = new this.${MODULE_NAME_LOWER}Model(data);
    return new${MODULE_NAME}.save();
  }

  async update(id: string, data: Partial<${MODULE_NAME}>): Promise<${MODULE_NAME}> {
    return this.${MODULE_NAME_LOWER}Model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<${MODULE_NAME}> {
    return this.${MODULE_NAME_LOWER}Model.findByIdAndDelete(id).exec();
  }
}
EOF
      ;;
      
    postgres)
      # Добавляем зависимости для PostgreSQL
      sed -i '/"dependencies": {/,/}/{s/"rxjs": "\^7.8.1"/"rxjs": "\^7.8.1",\n    "@nestjs\/typeorm": "\^10.0.0",\n    "typeorm": "\^0.3.17",\n    "pg": "\^8.11.3"/}' "$MODULE_DIR/package.json"
      
      # Создаем сущность для TypeORM
      mkdir -p "$MODULE_DIR/domain/entity"
      cat > "$MODULE_DIR/domain/entity/${MODULE_NAME_LOWER}.entity.ts" << EOF
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class ${MODULE_NAME} {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
EOF
      
      # Создаем репозиторий для PostgreSQL
      cat > "$MODULE_DIR/infrastructure/repository/${MODULE_NAME_LOWER}.repository.ts" << EOF
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${MODULE_NAME} } from '../../domain/entity/${MODULE_NAME_LOWER}.entity';

@Injectable()
export class ${MODULE_NAME}Repository {
  constructor(
    @InjectRepository(${MODULE_NAME})
    private ${MODULE_NAME_LOWER}Repository: Repository<${MODULE_NAME}>,
  ) {}

  async findAll(): Promise<${MODULE_NAME}[]> {
    return this.${MODULE_NAME_LOWER}Repository.find();
  }

  async findById(id: string): Promise<${MODULE_NAME}> {
    return this.${MODULE_NAME_LOWER}Repository.findOneBy({ id });
  }

  async create(data: Partial<${MODULE_NAME}>): Promise<${MODULE_NAME}> {
    const new${MODULE_NAME} = this.${MODULE_NAME_LOWER}Repository.create(data);
    return this.${MODULE_NAME_LOWER}Repository.save(new${MODULE_NAME});
  }

  async update(id: string, data: Partial<${MODULE_NAME}>): Promise<${MODULE_NAME}> {
    await this.${MODULE_NAME_LOWER}Repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.${MODULE_NAME_LOWER}Repository.delete(id);
  }
}
EOF
      ;;
      
    *)
      echo -e "${RED}Неподдерживаемый тип базы данных: ${DB_TYPE}${NC}"
      ;;
  esac
fi

# Создаем сервис
echo -e "${YELLOW}Создание сервиса...${NC}"
cat > "$MODULE_DIR/application/${MODULE_NAME_LOWER}.service.ts" << EOF
import { Injectable } from '@nestjs/common';

@Injectable()
export class ${MODULE_NAME}Service {
  constructor(
    // Здесь можно добавить внедрение зависимостей
  ) {}

  getHello(): string {
    return 'Hello from ${MODULE_NAME} Service!';
  }
  
  processEvent(data: any): any {
    console.log('Processing event:', data);
    return { processed: true, data };
  }
}
EOF

# Создаем контроллер если нужен REST API
if [ "$IS_REST_API" = true ]; then
  echo -e "${YELLOW}Создание REST контроллера...${NC}"
  cat > "$MODULE_DIR/presentation/${MODULE_NAME_LOWER}.controller.ts" << EOF
import { Controller, Get } from '@nestjs/common';
import { ${MODULE_NAME}Service } from '../application/${MODULE_NAME_LOWER}.service';

@Controller('${MODULE_NAME_LOWER}')
export class ${MODULE_NAME}Controller {
  constructor(private readonly ${MODULE_NAME_LOWER}Service: ${MODULE_NAME}Service) {}

  @Get()
  getHello(): string {
    return this.${MODULE_NAME_LOWER}Service.getHello();
  }
}
EOF
fi

# Создаем модуль
echo -e "${YELLOW}Создание модуля...${NC}"

PROVIDERS_IMPORTS=""

# Добавляем репозиторий в провайдеры, если выбрана база данных
if [ -n "$DB_TYPE" ]; then
  PROVIDERS_IMPORTS="import { ${MODULE_NAME}Repository } from '../infrastructure/repository/${MODULE_NAME_LOWER}.repository';\n"
  
  case "$DB_TYPE" in
    mongodb)
      PROVIDERS_IMPORTS+="import { MongooseModule } from '@nestjs/mongoose';\n"
      PROVIDERS_IMPORTS+="import { ${MODULE_NAME}, ${MODULE_NAME}Schema } from '../domain/schema/${MODULE_NAME_LOWER}.schema';\n"
      MODULE_IMPORTS="MongooseModule.forFeature([{ name: ${MODULE_NAME}.name, schema: ${MODULE_NAME}Schema }])"
      PROVIDERS="${MODULE_NAME}Repository"
      ;;
    postgres)
      PROVIDERS_IMPORTS+="import { TypeOrmModule } from '@nestjs/typeorm';\n"
      PROVIDERS_IMPORTS+="import { ${MODULE_NAME} } from '../domain/entity/${MODULE_NAME_LOWER}.entity';\n"
      MODULE_IMPORTS="TypeOrmModule.forFeature([${MODULE_NAME}])"
      PROVIDERS="${MODULE_NAME}Repository"
      ;;
    *)
      MODULE_IMPORTS=""
      PROVIDERS=""
      ;;
  esac
fi

# Для микросервиса добавляем RabbitMQ
if [ "$IS_MICROSERVICE" = true ]; then
  PROVIDERS_IMPORTS+="import { RabbitMQController } from '../infrastructure/messaging/rabbitmq.controller';\n"
  PROVIDERS_IMPORTS+="import { EnvironmentModule, RabbitMQModule, ${SERVICE_NAME_CONST}_SERVICE_EXCHANGE, ${SERVICE_NAME_CONST}_SERVICE_QUEUE } from '@marketplace/config';\n"
  
  if [ -n "$MODULE_IMPORTS" ]; then
    MODULE_IMPORTS="EnvironmentModule,\n    RabbitMQModule.forRoot(${SERVICE_NAME_CONST}_SERVICE_EXCHANGE, ${SERVICE_NAME_CONST}_SERVICE_QUEUE),\n    $MODULE_IMPORTS"
  else
    MODULE_IMPORTS="EnvironmentModule,\n    RabbitMQModule.forRoot(${SERVICE_NAME_CONST}_SERVICE_EXCHANGE, ${SERVICE_NAME_CONST}_SERVICE_QUEUE)"
  fi
  
  CONTROLLERS="${MODULE_NAME}Controller, RabbitMQController"
else
  PROVIDERS_IMPORTS+="import { EnvironmentModule } from '@marketplace/config';\n"
  
  if [ -n "$MODULE_IMPORTS" ]; then
    MODULE_IMPORTS="EnvironmentModule,\n    $MODULE_IMPORTS"
  else
    MODULE_IMPORTS="EnvironmentModule"
  fi
  
  CONTROLLERS="${MODULE_NAME}Controller"
fi

cat > "$MODULE_DIR/presentation/${MODULE_NAME_LOWER}.module.ts" << EOF
import { Module } from '@nestjs/common';
import { ${MODULE_NAME}Controller } from './${MODULE_NAME_LOWER}.controller';
import { ${MODULE_NAME}Service } from '../application/${MODULE_NAME_LOWER}.service';
${PROVIDERS_IMPORTS}

@Module({
  imports: [
    ${MODULE_IMPORTS}
  ],
  controllers: [${CONTROLLERS}],
  providers: [${MODULE_NAME}Service${PROVIDERS:+, }${PROVIDERS}],
})
export class ${MODULE_NAME}Module {} 
EOF

# Создаем main.ts
echo -e "${YELLOW}Создание точки входа main.ts...${NC}"

if [ "$IS_MICROSERVICE" = true ]; then
  cat > "$MODULE_DIR/main.ts" << EOF
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ${MODULE_NAME}Module } from './presentation/${MODULE_NAME_LOWER}.module';
import { 
  ${SERVICE_NAME_CONST}_SERVICE_EXCHANGE, 
  ${SERVICE_NAME_CONST}_SERVICE_QUEUE, 
  createRmqMicroserviceOptions,
  DEFAULT_${SERVICE_NAME_CONST}_PORT
} from '@marketplace/config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(${MODULE_NAME}Module);
  const configService = app.get(ConfigService);
  
  // Подключаем микросервис RabbitMQ
  app.connectMicroservice<MicroserviceOptions>(
    createRmqMicroserviceOptions(
      configService,
      ${SERVICE_NAME_CONST}_SERVICE_QUEUE,
      ${SERVICE_NAME_CONST}_SERVICE_EXCHANGE
    )
  );

  // Запускаем микросервис
  await app.startAllMicroservices();
  
  const port = configService.get('PORT') || DEFAULT_${SERVICE_NAME_CONST}_PORT;
  await app.listen(port);
  console.log(\`${MODULE_NAME} service is running on port \${port}\`);
}

bootstrap();
EOF
else
  cat > "$MODULE_DIR/main.ts" << EOF
import { NestFactory } from '@nestjs/core';
import { ${MODULE_NAME}Module } from './presentation/${MODULE_NAME_LOWER}.module';
import { DEFAULT_${SERVICE_NAME_CONST}_PORT } from '@marketplace/config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(${MODULE_NAME}Module);
  const configService = app.get(ConfigService);
  
  const port = configService.get('PORT') || DEFAULT_${SERVICE_NAME_CONST}_PORT;
  await app.listen(port);
  console.log(\`${MODULE_NAME} service is running on port \${port}\`);
}

bootstrap();
EOF
fi

# Добавляем константы в config библиотеку
echo -e "${YELLOW}Добавление констант в конфигурационную библиотеку...${NC}"

SERVICE_CONSTANTS_FILE="$CONFIG_DIR/src/constants/service.constants.ts"

# Функция для проверки наличия константы в файле
check_constant_exists() {
  local file="$1"
  local constant="$2"
  if grep -q "export const $constant" "$file"; then
    return 0  # Константа существует
  else
    return 1  # Константа не существует
  fi
}

# Добавляем имя сервиса в service.constants.ts, если оно не существует
if ! check_constant_exists "$SERVICE_CONSTANTS_FILE" "${SERVICE_NAME_CONST}_SERVICE"; then
  sed -i "/\/\/ Service names/a export const ${SERVICE_NAME_CONST}_SERVICE = '${MODULE_NAME_LOWER}-service';" "$SERVICE_CONSTANTS_FILE"
  echo -e "${GREEN}Добавлена константа: ${SERVICE_NAME_CONST}_SERVICE${NC}"
else
  echo -e "${YELLOW}Константа ${SERVICE_NAME_CONST}_SERVICE уже существует, пропускаем...${NC}"
fi

# Добавляем порт сервиса в service.constants.ts, если он не существует
if ! check_constant_exists "$SERVICE_CONSTANTS_FILE" "DEFAULT_${SERVICE_NAME_CONST}_PORT"; then
  sed -i "/\/\/ Default ports/a export const DEFAULT_${SERVICE_NAME_CONST}_PORT = $PORT;" "$SERVICE_CONSTANTS_FILE"
  echo -e "${GREEN}Добавлена константа: DEFAULT_${SERVICE_NAME_CONST}_PORT${NC}"
else
  echo -e "${YELLOW}Константа DEFAULT_${SERVICE_NAME_CONST}_PORT уже существует, пропускаем...${NC}"
fi

# Добавляем внешний порт сервиса в service.constants.ts, если он не существует
if ! check_constant_exists "$SERVICE_CONSTANTS_FILE" "EXTERNAL_${SERVICE_NAME_CONST}_PORT"; then
  sed -i "/\/\/ External ports/a export const EXTERNAL_${SERVICE_NAME_CONST}_PORT = $EXTERNAL_PORT;" "$SERVICE_CONSTANTS_FILE"
  echo -e "${GREEN}Добавлена константа: EXTERNAL_${SERVICE_NAME_CONST}_PORT${NC}"
else
  echo -e "${YELLOW}Константа EXTERNAL_${SERVICE_NAME_CONST}_PORT уже существует, пропускаем...${NC}"
fi

# Если это микросервис, добавляем константы для RabbitMQ
if [ "$IS_MICROSERVICE" = true ]; then
  # Проверяем существование файла констант RabbitMQ
  RABBITMQ_CONSTANTS_FILE="$CONFIG_DIR/src/constants/rabbit-mq.constants.ts"
  
  # Добавляем константы для очередей и обменов, если они не существуют
  if ! check_constant_exists "$RABBITMQ_CONSTANTS_FILE" "${SERVICE_NAME_CONST}_SERVICE_QUEUE"; then
    echo -e "export const ${SERVICE_NAME_CONST}_SERVICE_QUEUE = '${MODULE_NAME_LOWER}.queue';" >> "$RABBITMQ_CONSTANTS_FILE"
    echo -e "${GREEN}Добавлена константа: ${SERVICE_NAME_CONST}_SERVICE_QUEUE${NC}"
  else
    echo -e "${YELLOW}Константа ${SERVICE_NAME_CONST}_SERVICE_QUEUE уже существует, пропускаем...${NC}"
  fi
  
  if ! check_constant_exists "$RABBITMQ_CONSTANTS_FILE" "${SERVICE_NAME_CONST}_SERVICE_EXCHANGE"; then
    echo -e "export const ${SERVICE_NAME_CONST}_SERVICE_EXCHANGE = '${MODULE_NAME_LOWER}.exchange';" >> "$RABBITMQ_CONSTANTS_FILE"
    echo -e "${GREEN}Добавлена константа: ${SERVICE_NAME_CONST}_SERVICE_EXCHANGE${NC}"
  else
    echo -e "${YELLOW}Константа ${SERVICE_NAME_CONST}_SERVICE_EXCHANGE уже существует, пропускаем...${NC}"
  fi
fi

# Пересборка библиотеки config
echo -e "${YELLOW}Пересборка библиотеки config...${NC}"
cd "$CONFIG_DIR" && npm run build

echo -e "${GREEN}Модуль ${MODULE_NAME_LOWER} успешно создан!${NC}"
echo -e "${BLUE}=========================================================${NC}"
echo -e "${YELLOW}Для установки зависимостей выполните:${NC}"
echo -e "${CYAN}npm run install-modules${NC}"
echo -e "${YELLOW}Для запуска модуля выполните:${NC}"
echo -e "${CYAN}cd src/${MODULE_NAME_LOWER} && npm run dev${NC}"
echo -e "${BLUE}=========================================================${NC}" 