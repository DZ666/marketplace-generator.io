FROM node:20-alpine

# Установка необходимых зависимостей для Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Копируем package.json основного сервиса
COPY src/user/package.json ./

# Копируем корневой package.json и локальную библиотеку config
COPY package.json /workspace/package.json
COPY src/libs/config /workspace/src/libs/config

# Устанавливаем зависимости и билдим локальную либу
RUN cd /workspace/src/libs/config && npm install && npm run build

# Устанавливаем общие зависимости в /workspace
RUN cd /workspace && npm install @nestjs/common @nestjs/core @nestjs/config @nestjs/microservices --legacy-peer-deps

# Устанавливаем зависимости основного сервиса
RUN npm install --legacy-peer-deps && \
    npm install @nestjs/config @nestjs/microservices bcrypt --legacy-peer-deps

# Копируем исходный код
COPY src/user ./

# Заменяем установленный пакет @marketplace/config на симлинк
RUN rm -rf /app/node_modules/@marketplace/config && \
    mkdir -p /app/node_modules/@marketplace && \
    ln -s /workspace/src/libs/config/dist /app/node_modules/@marketplace/config

# Компиляция TypeScript в JavaScript
RUN npm run build

EXPOSE 3001

# Запуск скрипта, который подготовит конфигурацию перед стартом
COPY src/user/startup.sh /startup.sh
RUN chmod +x /startup.sh

CMD [ "/startup.sh" ]