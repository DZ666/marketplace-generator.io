После проведения определенных для тебя пабот, на пример, после создания или изменения более 100 строк актуализируй этот файл
# Контекст проекта (для ИИ)

## Общая суть
- Проект — микросервисная система на NestJS, каждый сервис — отдельный Docker-контейнер.
- Есть общая библиотека src/libs/config для констант, настроек, модулей RabbitMQ и переменных окружения.
- Взаимодействие между сервисами — через RabbitMQ (exchange + очереди, имена стандартизированы).
- Каждый сервис реализует бизнес-логику, API (REST/GraphQL/WebSocket) и слушает события RabbitMQ.

## Сервисы
- auth — аутентификация и авторизация
- user — пользователи
- product — товары
- order — заказы
- analytics — аналитика
- payment — платежи

## Слои в каждом сервисе
- presentation — контроллеры (REST, GraphQL, WebSocket), обработчики RabbitMQ
- application — бизнес-сервисы, обработка событий
- domain — бизнес-сущности, value objects
- infrastructure — работа с БД (Prisma/Mongoose/TypeORM), RabbitMQ, интеграции
- constants — константы для очередей, exchange, routing key

## Технологии
- NestJS 10+
- TypeScript 5+
- RabbitMQ (через @nestjs/microservices)
- Prisma (PostgreSQL, не везде)
- Mongoose (MongoDB, например, payment)
- TypeORM (поддержка генератором)
- Zod (валидация DTO), Joi (валидация env)
- GraphQL (резолверы в presentation)
- WebSocket (реалтайм, ws-endpoints)
- Docker, Docker Compose
- Jest (тесты)

## Взаимодействие
- Каждый сервис подключается к своему exchange/очереди через общий модуль RabbitMQModule из config.
- Для отправки событий: client.emit({ exchange, routingKey }, message)
- Для RPC: client.send({ exchange, routingKey }, message)
- Для обработки: @EventPattern(PATTERN) async handle(@Payload() data) { ... }

## Работа с БД
- Prisma: schema.prisma, миграции, CRUD через сервисы
- Mongoose: схемы через декораторы, CRUD через Model
- TypeORM: сущности через декораторы, CRUD через Repository

## Конфигурация
- ConfigModule глобально, схема env через Joi
- .env, .env.dev, .env.prod, .env.test — для разных сред
- docker-compose.yml — все сервисы, переменные окружения, volume, depends_on

## Генерация новых сервисов
- Скрипт create-module.sh: быстро создаёт сервис с нужной БД, микросервисной логикой, REST/GraphQL/ws, автогенерирует структуру и зависимости

## Примеры кода
- RabbitMQ: client.emit/send, @EventPattern/@MessagePattern
- Mongoose: @Schema, @Prop, @InjectModel
- TypeORM: @Entity, @Column, @InjectRepository

## Особенности
- Вся конфигурация и константы централизованы
- Легко расширять: добавить сервис или БД — просто
- Валидация и типизация на всех уровнях
- Тесты через Jest

// Этот файл — краткий и понятный контекст для ИИ, чтобы быстро ориентироваться в проекте и не терять детали архитектуры, технологий и паттернов. 