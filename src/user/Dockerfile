FROM node:20-alpine

WORKDIR /app

# Создаем package.json если он еще не существует
COPY package.json ./

# Установка зависимостей
RUN npm cache clean --force
RUN npm install

# Копируем исходный код
COPY . .

# Для разработки - пропускаем этап сборки, т.к. будем использовать ts-node
# Компиляция TypeScript в JavaScript только для продакшн
RUN if [ "$NODE_ENV" != "development" ]; then npm run build; fi

EXPOSE 3001

# Настраиваем переменную CMD на основе окружения
CMD [ "npm", "run", "start" ]