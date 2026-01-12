#!/bin/bash

# 🔄 Автоматическая проверка и исправление ошибок проекта KIKU
# Использование: ./scripts/auto-check-and-fix.sh [--fix]

set -e

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

AUTO_FIX=${1:-""}

info() { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; }
section() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

ERRORS=0
FIXED=0

cd "$(dirname "$0")/.."

section "🔍 Автоматическая проверка и исправление проекта KIKU"

# 1. Проверка зависимостей
section "1. Проверка зависимостей"
if ! command -v bun &> /dev/null; then
    error "Bun не установлен!"
    exit 1
fi
info "Bun установлен: $(bun --version)"

# 2. Очистка кеша
section "2. Очистка кешей"
info "Очистка кешей Metro, Expo, Node..."
rm -rf node_modules/.cache .expo .metro .rork 2>/dev/null || true
info "Кеши очищены"

# 3. Установка зависимостей
section "3. Проверка зависимостей"
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    warn "Обновление зависимостей..."
    bun install
    info "Зависимости обновлены"
else
    info "Зависимости актуальны"
fi

# 4. TypeScript проверка
section "4. TypeScript проверка типов"
if bunx tsc --noEmit 2>&1 | tee /tmp/tsc-errors.log; then
    info "TypeScript: ошибок не найдено"
else
    ERROR_OUTPUT=$(cat /tmp/tsc-errors.log)
    if [ "$AUTO_FIX" = "--fix" ]; then
        warn "Попытка автоматического исправления TypeScript ошибок..."
        # Здесь можно добавить автоматические исправления
        ((ERRORS++))
    else
        error "TypeScript: найдены ошибки"
        echo "$ERROR_OUTPUT"
        ((ERRORS++))
    fi
fi

# 5. ESLint проверка
section "5. ESLint проверка кода"
if [ "$AUTO_FIX" = "--fix" ]; then
    if bun run lint -- --fix 2>&1; then
        info "ESLint: ошибки исправлены автоматически"
        ((FIXED++))
    else
        warn "ESLint: некоторые ошибки требуют ручного исправления"
        ((ERRORS++))
    fi
else
    if bun run lint 2>&1; then
        info "ESLint: ошибок не найдено"
    else
        error "ESLint: найдены ошибки (используйте --fix для автоисправления)"
        ((ERRORS++))
    fi
fi

# 6. Проверка импортов
section "6. Проверка дублирующихся импортов"
DUPLICATE_IMPORTS=$(grep -r "import.*AnalyticsProvider" app/ constants/ 2>/dev/null | wc -l | xargs)
if [ "$DUPLICATE_IMPORTS" -gt 1 ]; then
    error "Найдены возможные дублирующиеся импорты AnalyticsProvider"
    grep -r "import.*AnalyticsProvider" app/ constants/ 2>/dev/null || true
    ((ERRORS++))
else
    info "Дублирующиеся импорты не найдены"
fi

# 7. Проверка структуры проекта
section "7. Проверка структуры проекта"
REQUIRED_FILES=(
    "app/_layout.tsx"
    "package.json"
    "tsconfig.json"
    "constants/AnalyticsContext.tsx"
    "constants/UserContext.tsx"
)
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        info "✓ $file"
    else
        error "✗ $file отсутствует"
        ((ERRORS++))
    fi
done

# 8. Проверка контекстов
section "8. Проверка Context Providers"
CONTEXT_FILES=$(find constants -name "*Context.tsx" 2>/dev/null | wc -l | xargs)
info "Найдено Context файлов: $CONTEXT_FILES"

# 9. Итоги
section "📊 Итоги проверки"
if [ $ERRORS -eq 0 ]; then
    info "✅ Все проверки пройдены успешно!"
    if [ $FIXED -gt 0 ]; then
        info "Исправлено автоматически: $FIXED"
    fi
    exit 0
else
    error "Найдено ошибок: $ERRORS"
    if [ "$AUTO_FIX" != "--fix" ]; then
        echo ""
        warn "Запустите с флагом --fix для автоматического исправления:"
        echo "  ./scripts/auto-check-and-fix.sh --fix"
    fi
    exit 1
fi


