#!/bin/bash

# Устанавливаем цвета для вывода
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
CYAN="\033[0;36m"
NC="\033[0m" # No Color

# Путь к корню проекта (относительно скрипта)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SRC_DIR="$PROJECT_ROOT/src"

# Проверяем аргументы для флага --no-perms
NO_PERMS=false
for arg in "$@"; do
  if [ "$arg" = "--no-perms" ]; then
    NO_PERMS=true
    echo -e "${YELLOW}Режим без проверки прав доступа активирован${NC}"
  fi
done

# Флаги npm для установки
if [ "$NO_PERMS" = true ]; then
  NPM_FLAGS="--legacy-peer-deps --no-bin-links --unsafe-perm=true --allow-root --no-audit --force"
else
  NPM_FLAGS="--legacy-peer-deps --no-bin-links --unsafe-perm=true --allow-root"
fi

echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}=   Автоматическая установка зависимостей для модулей    =${NC}"
echo -e "${BLUE}=========================================================${NC}"

# Массив для хранения всех обнаруженных модулей
declare -a MODULES
declare -a PRIORITY_MODULES

# Функция для обнаружения всех модулей (каталогов с package.json)
find_modules() {
  echo -e "${YELLOW}Поиск всех модулей в проекте...${NC}"
  
  # Находим все package.json файлы, исключая node_modules и dist
  while IFS= read -r module_path; do
    module_dir=$(dirname "$module_path")
    module_name="$(basename "$module_dir")"
    module_rel_path="$(realpath --relative-to="$PROJECT_ROOT" "$module_dir")"
    
    # Пропускаем node_modules и dist
    if [[ "$module_dir" == *"node_modules"* ]] || [[ "$module_dir" == *"dist"* ]]; then
      continue
    fi
    
    # Добавляем в массив модулей
    MODULES+=("$module_dir")
    echo -e "  ${CYAN}Обнаружен модуль:${NC} $module_rel_path"
    
    # Проверяем является ли модуль базовой библиотекой
    if [[ "$module_dir" == *"/libs/"* ]] || [[ "$module_dir" == *"config"* ]]; then
      PRIORITY_MODULES+=("$module_dir")
    fi
  done < <(find "$PROJECT_ROOT" -name "package.json" -not -path "*/node_modules/*" -not -path "*/dist/*" | sort)
  
  echo -e "${GREEN}Найдено ${#MODULES[@]} модулей${NC}"
  echo
  
  if [ ${#PRIORITY_MODULES[@]} -gt 0 ]; then
    echo -e "${GREEN}Найдено ${#PRIORITY_MODULES[@]} приоритетных модулей${NC}"
    echo
    for module in "${PRIORITY_MODULES[@]}"; do
      echo -e "${GREEN}Обнаружена базовая библиотека:${NC} $(realpath --relative-to="$PROJECT_ROOT" "$module")"
    done
  fi
}

# Функция для создания директорий и установки прав
create_and_fix_dirs() {
  local dir="$1"
  
  # Проверяем, существуют ли необходимые директории
  if [ ! -d "$dir/node_modules" ]; then
    mkdir -p "$dir/node_modules" 2>/dev/null || true
  fi
  
  if [ ! -d "$dir/dist" ]; then
    mkdir -p "$dir/dist" 2>/dev/null || true
  fi
  
  # Устанавливаем права на директории если флаг --no-perms не указан
  if [ "$NO_PERMS" = false ]; then
    echo -e "  ${YELLOW}Установка прав доступа...${NC}"
    chmod -R 777 "$dir/node_modules" 2>/dev/null || true
    chmod -R 777 "$dir/dist" 2>/dev/null || true
  fi
}

# Функция для установки зависимостей в одном модуле
install_module_deps() {
  local dir="$1"
  local module_rel_path="$(realpath --relative-to="$PROJECT_ROOT" "$dir")"
  
  echo -e "${BLUE}--------------------------------------------------${NC}"
  echo -e "${YELLOW}Установка зависимостей для модуля:${NC} ${GREEN}$module_rel_path${NC}"
  
  # Переходим в директорию модуля
  cd "$dir" || return
  
  # Создаем директории и устанавливаем права
  create_and_fix_dirs "$dir"
  
  # Проверка, есть ли локальная зависимость @marketplace
  if grep -q "@marketplace" package.json; then
    echo -e "  ${YELLOW}Обнаружена локальная зависимость ${GREEN}@marketplace/config${NC}"
    
    # Устанавливаем основные зависимости
    echo -e "  ${YELLOW}Установка основных зависимостей...${NC}"
    if [ "$NO_PERMS" = true ]; then
      npm install $NPM_FLAGS || echo -e "  ${RED}Ошибка при установке основных зависимостей${NC}"
    else
      npm install $NPM_FLAGS || echo -e "  ${RED}Ошибка при установке основных зависимостей${NC}"
    fi
    
    # Устанавливаем локальную зависимость
    if [ -d "$PROJECT_ROOT/src/libs/config" ]; then
      echo -e "  ${YELLOW}Установка локальной зависимости ${GREEN}@marketplace/config${NC}"
      npm install $NPM_FLAGS "$PROJECT_ROOT/src/libs/config" || echo -e "  ${RED}Ошибка при установке @marketplace/config${NC}"
      echo -e "  ${GREEN}Локальная зависимость @marketplace/config установлена.${NC}"
    else
      echo -e "  ${RED}Не удалось найти локальную зависимость по пути $PROJECT_ROOT/src/libs/config${NC}"
    fi
  else
    # Если нет локальных зависимостей, просто устанавливаем все
    echo -e "  ${YELLOW}Установка зависимостей...${NC}"
    npm install $NPM_FLAGS || echo -e "  ${RED}Ошибка при установке зависимостей${NC}"
  fi
  
  # Если есть скрипт build, запускаем его (только для библиотек)
  if [[ "$module_rel_path" == *"libs/"* ]] && grep -q "\"build\"" package.json; then
    echo -e "  ${YELLOW}Сборка модуля...${NC}"
    # Если используется режим без проверки прав, добавляем --force
    if [ "$NO_PERMS" = true ]; then
      npm run build --force || echo -e "  ${RED}Ошибка при сборке модуля${NC}"
    else
      npm run build || echo -e "  ${RED}Ошибка при сборке модуля${NC}"
    fi
  fi
  
  echo -e "  ${GREEN}Зависимости для модуля $module_rel_path установлены.${NC}"
  
  # Возвращаемся в корневую директорию
  cd "$PROJECT_ROOT" || exit
}

# Основная функция для установки всех зависимостей
install_all_deps() {
  # Сначала находим все модули
  find_modules
  
  # Сначала устанавливаем приоритетные модули
  echo -e "${BLUE}=========================================================${NC}"
  echo -e "${YELLOW}Установка приоритетных модулей...${NC}"
  
  for module_dir in "${PRIORITY_MODULES[@]}"; do
    install_module_deps "$module_dir"
  done
  
  # Затем устанавливаем корневой модуль
  echo -e "${BLUE}=========================================================${NC}"
  echo -e "${YELLOW}Установка зависимостей для корневого проекта...${NC}"
  cd "$PROJECT_ROOT" || exit
  
  # Создаем директории и устанавливаем права
  create_and_fix_dirs "$PROJECT_ROOT"
  
  npm install $NPM_FLAGS || echo -e "${RED}Ошибка при установке зависимостей корневого проекта${NC}"
  echo -e "${GREEN}Зависимости для корневого проекта установлены.${NC}"
  
  # Затем устанавливаем все остальные модули
  echo -e "${BLUE}=========================================================${NC}"
  echo -e "${YELLOW}Установка оставшихся модулей...${NC}"
  
  for module_dir in "${MODULES[@]}"; do
    # Пропускаем приоритетные модули, которые уже установлены
    if [[ " ${PRIORITY_MODULES[*]} " == *" $module_dir "* ]]; then
      continue
    fi
    
    # Пропускаем корневой модуль, который уже установлен
    if [[ "$module_dir" == "$PROJECT_ROOT" ]]; then
      continue
    fi
    
    install_module_deps "$module_dir"
  done
}

# Запуск установки
install_all_deps

echo -e "${BLUE}=========================================================${NC}"
echo -e "${GREEN}Установка зависимостей завершена для всех модулей!${NC}"
echo -e "${BLUE}=========================================================${NC}"

# Возвращаемся в корневую директорию
cd "$PROJECT_ROOT" || exit 