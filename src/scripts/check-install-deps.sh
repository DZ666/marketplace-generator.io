#!/bin/sh

# Позволяем задавать флаги для npm через переменную окружения
NPM_FLAGS=${NPM_FLAGS:-"--legacy-peer-deps"}

echo "📦 Проверка зависимостей..."

# Устанавливаем локальные пакеты, если они есть в зависимостях
check_and_install_local_deps() {
  # Проверяем наличие локальных зависимостей в package.json
  if grep -q '"@marketplace/config"' package.json; then
    echo "🔍 Обнаружена локальная зависимость @marketplace/config"
    
    # Проверяем существование libs/config
    if [ -d "../../libs/config" ]; then
      echo "🔄 Устанавливаем локальную зависимость @marketplace/config"
      
      # Проверяем, установлена ли уже эта зависимость правильно
      if [ ! -d "node_modules/@marketplace/config" ] || [ ! -f "node_modules/@marketplace/config/package.json" ]; then
        npm install $NPM_FLAGS ../../libs/config
        echo "✅ Локальная зависимость @marketplace/config установлена."
      else
        echo "✅ Локальная зависимость @marketplace/config уже установлена."
      fi
    else
      echo "⚠️ Не удалось найти локальную зависимость по пути ../../libs/config"
    fi
  fi
}

# Проверяем существование директории node_modules
if [ ! -d "node_modules" ]; then
  echo "🔄 node_modules не существует. Устанавливаем зависимости..."
  npm install $NPM_FLAGS
  # Копируем package-lock.json и package.json для отслеживания изменений
  mkdir -p node_modules/.cache
  cp package-lock.json node_modules/.cache/.package-lock.json 2>/dev/null || true
  cp package.json node_modules/.cache/.package.json
  
  # Проверяем и устанавливаем локальные зависимости
  check_and_install_local_deps
  
  echo "✅ Зависимости установлены."
# Проверяем, изменился ли package.json или package-lock.json
elif [ ! -f "node_modules/.cache/.package-lock.json" ] || \
     [ ! -f "node_modules/.cache/.package.json" ] || \
     [ "package.json" -nt "node_modules/.cache/.package.json" ] || \
     [ "package-lock.json" -nt "node_modules/.cache/.package-lock.json" ] 2>/dev/null; then
  echo "🔄 Файлы package.json или package-lock.json изменились. Обновляем зависимости..."
  npm install $NPM_FLAGS
  # Обновляем кешированные копии
  mkdir -p node_modules/.cache
  cp package-lock.json node_modules/.cache/.package-lock.json 2>/dev/null || true
  cp package.json node_modules/.cache/.package.json
  
  # Проверяем и устанавливаем локальные зависимости
  check_and_install_local_deps
  
  echo "✅ Зависимости обновлены."
else
  echo "✅ node_modules существует и актуален."
  
  # Проверяем и устанавливаем локальные зависимости, даже если npm не запустился
  check_and_install_local_deps
fi

# Выводим информацию о том, какую команду запускаем
echo "🚀 Запускаем: $@"

# Запускаем команду, переданную в аргументах
exec "$@" 