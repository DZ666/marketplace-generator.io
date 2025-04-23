#!/bin/sh

# Проверяем наличие node_modules в примонтированной директории
if [ ! -d "/workspace/src/libs/config/node_modules" ]; then
  echo "Установка зависимостей для @marketplace/config..."
  cd /workspace/src/libs/config && npm install && npm run build
fi

# Проверяем наличие общих зависимостей в /workspace
if [ ! -d "/workspace/node_modules/@nestjs" ]; then
  echo "Установка общих зависимостей в /workspace..."
  cd /workspace && npm install @nestjs/common @nestjs/core @nestjs/config @nestjs/microservices --legacy-peer-deps
fi

# Запускаем приложение
cd /app && npm run start:dev 