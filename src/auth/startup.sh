#!/bin/sh

set -e

# Переходим в директорию приложения
cd /app

# Компилируем библиотеку config
cd /workspace/src/libs/config && npm install && npm run build

# Настраиваем симлинк на библиотеку @marketplace/config
cd /app
mkdir -p /app/node_modules/@marketplace
rm -rf /app/node_modules/@marketplace/config
ln -s /workspace/src/libs/config/dist /app/node_modules/@marketplace/config

# Регенерируем Prisma-клиент
npx prisma generate

# Устанавливаем bcrypt если он отсутствует
if [ ! -d "/app/node_modules/bcrypt" ]; then
  echo "Установка bcrypt и типов..."
  npm install bcrypt @types/bcrypt --legacy-peer-deps
fi

# Запускаем сервис
exec npm run dev 