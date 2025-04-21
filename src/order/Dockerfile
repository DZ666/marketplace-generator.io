FROM node:20-alpine

WORKDIR /app

# В режиме разработки монтируем volume с кодом,
# а зависимости проверяем через скрипт
COPY package*.json ./

# Копируем исходный код только для non-dev окружений
# В dev режиме код будет монтироваться через volume
COPY . .

EXPOSE 3003

# В dev режиме используем скрипт для проверки node_modules
# В production - просто устанавливаем зависимости и запускаем
CMD [ "sh", "-c", "if [ \"$NODE_ENV\" = \"development\" ]; then /scripts/check-install-deps.sh npm run dev; else npm cache clean --force && npm install && npm run start; fi" ]