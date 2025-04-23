FROM node:20-alpine

# Установка необходимых зависимостей для Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Копируем package.json основного сервиса
COPY src/auth/package.json ./

# Копируем корневой package.json и локальную библиотеку config
COPY package.json /workspace/package.json
COPY src/libs/config /workspace/src/libs/config

# Устанавливаем зависимости и билдим локальную либу
RUN cd /workspace/src/libs/config && npm install && npm run build

# Устанавливаем общие зависимости в /workspace
RUN cd /workspace && npm install @nestjs/common @nestjs/core @nestjs/config @nestjs/microservices --legacy-peer-deps

# Устанавливаем зависимости основного сервиса включая Prisma с конкретной версией
RUN npm install --legacy-peer-deps --force && \
    npm install @nestjs/config @nestjs/microservices @prisma/client@5.10.2 bcrypt --legacy-peer-deps --force && \
    npm install express-session redis connect-redis --legacy-peer-deps --force && \
    npm install -D prisma@5.10.2 --force

# Копируем исходный код
COPY src/auth ./

# Создаем директорию prisma и копируем schema.prisma
RUN mkdir -p /app/prisma
COPY src/auth/prisma/schema.prisma /app/prisma/schema.prisma

# Проверяем, что директория существует и содержит файл schema.prisma
RUN ls -la /app/prisma

# Генерируем Prisma клиент с переменной окружения
ENV DATABASE_URL="postgresql://postgres:postgres@postgres:5432/marketplace?schema=public"
RUN npx prisma generate

# Заменяем установленный пакет @marketplace/config на симлинк
RUN rm -rf /app/node_modules/@marketplace/config && \
    mkdir -p /app/node_modules/@marketplace && \
    ln -s /workspace/src/libs/config/dist /app/node_modules/@marketplace/config

# Компиляция TypeScript в JavaScript
RUN npm run build

EXPOSE 3000

# Запуск скрипта, который подготовит конфигурацию перед стартом
COPY src/auth/startup.sh /startup.sh
RUN chmod +x /startup.sh

CMD [ "/startup.sh" ]