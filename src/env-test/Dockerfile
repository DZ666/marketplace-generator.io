FROM node:20-alpine

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей с флагом --legacy-peer-deps
RUN npm cache clean --force
RUN npm install --legacy-peer-deps

# Копируем исходный код
COPY . .

# Используем наши тесты для окружения
CMD ["npm", "test", "--", "src/libs/config/test"] 