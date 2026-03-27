#!/bin/bash

# Скрипт для проверки функций проекта KIKU
# Использование: ./scripts/check-features.sh

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
info() {
    echo -e "${GREEN}[✓]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[!]${NC} $1"
}

error() {
    echo -e "${RED}[✗]${NC} $1"
}

section() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Счетчики
PASSED=0
FAILED=0
WARNINGS=0

# Проверка файла
check_file() {
    if [ -f "$1" ]; then
        info "$1 существует"
        ((PASSED++))
        return 0
    else
        error "$1 не найден"
        ((FAILED++))
        return 1
    fi
}

# Проверка директории
check_dir() {
    if [ -d "$1" ]; then
        info "$1 существует"
        ((PASSED++))
        return 0
    else
        error "$1 не найден"
        ((FAILED++))
        return 1
    fi
}

# Проверка импорта в файле
check_import() {
    if grep -q "$2" "$1" 2>/dev/null; then
        info "$1 импортирует $2"
        ((PASSED++))
        return 0
    else
        warn "$1 не импортирует $2"
        ((WARNINGS++))
        return 1
    fi
}

section "🔍 Проверка структуры проекта"

check_dir "app"
check_dir "constants"
check_dir "components"
check_dir "backend"
check_dir ".github/workflows"

section "📱 Проверка Mobile App"

check_file "app.json"
check_file "package.json"
check_file "eas.json"
check_file "app/_layout.tsx"

section "🛡️ Проверка Contexts (Функции)"

# Основные контексты
check_file "constants/MonitoringContext.tsx"
check_file "constants/UserContext.tsx"
check_file "constants/ParentalControlsContext.tsx"
check_file "constants/ThemeContext.tsx"
check_file "constants/NotificationsContext.tsx"

# Инновационные контексты
check_file "constants/AnalyticsContext.tsx"
check_file "constants/ABTestingContext.tsx"
check_file "constants/AgeComplianceContext.tsx"
check_file "constants/PersonalizedAIContext.tsx"
check_file "constants/GamificationContext.tsx"
check_file "constants/PredictiveAnalyticsContext.tsx"
check_file "constants/AIParentingAssistantContext.tsx"
check_file "constants/ReferralProgramContext.tsx"

# Сервисы
check_file "constants/AIModerationService.ts"
check_file "constants/i18n.ts"

section "🎨 Проверка Design System"

check_file "constants/Typography.tsx"
check_file "constants/ColorSystem.tsx"
check_file "components/Typography.tsx"
check_file "components/VisualEffects.tsx"
check_file "components/BackgroundEffects.tsx"
check_file "components/DepthContainer.tsx"

section "🔧 Проверка Backend"

check_file "backend/hono.ts"
check_file "backend/Dockerfile"
check_file "backend/trpc/app-router.ts"
check_file "docker-compose.yml"

# Проверка tRPC роутов
check_file "backend/trpc/routes/sync/chats.ts"
check_file "backend/trpc/routes/sync/alerts.ts"
check_file "backend/trpc/routes/sync/settings.ts"

section "📚 Проверка документации"

check_file "README.md"
check_file "DEPLOYMENT_GUIDE.md"
check_file "SPONSORS.md"
check_file "SPONSORSHIP_SETUP_GUIDE.md"
check_file "DESIGN_SYSTEM.md"

section "⚙️ Проверка конфигурации"

check_file ".github/FUNDING.yml"
check_file ".github/workflows/deploy-backend.yml"
check_file ".github/workflows/deploy-mobile.yml"

# Проверка .env файлов
if [ -f "backend/.env.example" ]; then
    info "backend/.env.example существует"
    ((PASSED++))
else
    warn "backend/.env.example не найден"
    ((WARNINGS++))
fi

if [ -f ".env.example" ]; then
    info ".env.example существует"
    ((PASSED++))
else
    warn ".env.example не найден"
    ((WARNINGS++))
fi

section "🔗 Проверка интеграций"

# Проверка импортов в _layout.tsx
if [ -f "app/_layout.tsx" ]; then
    check_import "app/_layout.tsx" "MonitoringProvider"
    check_import "app/_layout.tsx" "AnalyticsProvider"
    check_import "app/_layout.tsx" "PersonalizedAIProvider"
    check_import "app/_layout.tsx" "GamificationProvider"
fi

section "📊 Результаты проверки"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Успешно:${NC} $PASSED"
echo -e "${RED}Ошибки:${NC} $FAILED"
echo -e "${YELLOW}Предупреждения:${NC} $WARNINGS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $FAILED -eq 0 ]; then
    info "✅ Все основные проверки пройдены!"
    exit 0
else
    error "❌ Найдены проблемы. Пожалуйста, исправьте ошибки."
    exit 1
fi

