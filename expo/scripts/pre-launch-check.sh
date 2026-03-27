#!/bin/bash

# 🚀 Проверка перед запуском проекта
# Использование: ./scripts/pre-launch-check.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info() { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; }

cd "$(dirname "$0")/.."

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 Проверка перед запуском проекта KIKU${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

ERRORS=0

# Проверка зависимостей
if ! command -v bun &> /dev/null; then
    error "Bun не установлен!"
    exit 1
fi
info "Bun: $(bun --version)"

# Проверка node_modules
if [ ! -d "node_modules" ]; then
    error "Зависимости не установлены. Запустите: bun install"
    exit 1
fi
info "Зависимости установлены"

# Быстрая проверка TypeScript
info "Проверка TypeScript..."
if bunx tsc --noEmit --skipLibCheck 2>&1 | head -20; then
    info "TypeScript: OK"
else
    warn "TypeScript: найдены ошибки (проект может не запуститься)"
    ((ERRORS++))
fi

# Проверка критических файлов
CRITICAL_FILES=("app/_layout.tsx" "package.json")
for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        error "Критический файл отсутствует: $file"
        exit 1
    fi
done
info "Критические файлы на месте"

# Очистка старых процессов
if pgrep -f "rork start" > /dev/null; then
    warn "Найден запущенный процесс Rork. Остановите его перед запуском."
fi

if pgrep -f "expo run:ios" > /dev/null; then
    warn "Найден запущенный процесс 'expo run:ios'. Остановите его перед запуском."
    EXPO_PIDS=$(pgrep -f "expo run:ios" | tr '\n' ' ')
    warn "PID процессов: $EXPO_PIDS"
fi

if pgrep -f "expo start" > /dev/null; then
    info "Найден запущенный процесс 'expo start' (это нормально для dev сервера)"
fi

if [ $ERRORS -eq 0 ]; then
    echo ""
    info "✅ Проект готов к запуску!"
    echo ""
    echo "Запуск:"
    echo "  bun run start"
    exit 0
else
    error "Найдено проблем: $ERRORS"
    exit 1
fi


