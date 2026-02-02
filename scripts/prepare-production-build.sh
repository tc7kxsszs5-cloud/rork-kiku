#!/bin/bash
# Подготовка к продакшен-сборке для iOS и Android
# Запуск: ./scripts/prepare-production-build.sh [--skip-tests]
# После успешного прохождения можно запускать: eas build --platform all --profile production

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; }
head()  { echo -e "\n${BLUE}$1${NC}"; }

SKIP_TESTS=false
for arg in "$@"; do
  [ "$arg" = "--skip-tests" ] && SKIP_TESTS=true
done

cd "$(dirname "$0")/.."
ROOT="$(pwd)"
ERRORS=0

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  KIKU: подготовка к сборке (iOS + Android)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# 1. Зависимости и окружение
head "1. Зависимости"
if ! command -v bun &> /dev/null; then
  error "Bun не установлен. Установите: https://bun.sh"
  ((ERRORS++))
else
  info "Bun: $(bun --version)"
fi

if [ ! -d "$ROOT/node_modules" ]; then
  error "Зависимости не установлены. Запустите: bun install"
  ((ERRORS++))
else
  info "node_modules на месте"
fi

if ! command -v eas &> /dev/null; then
  warn "EAS CLI не установлен глобально. Установите: npm install -g eas-cli"
else
  info "EAS CLI: $(eas --version 2>/dev/null || true)"
fi

# 2. Иконка уведомлений (Android)
head "2. Ресурсы уведомлений"
NOTIF_ICON="$ROOT/local/assets/notification_icon.png"
if [ ! -f "$NOTIF_ICON" ]; then
  if [ -f "$ROOT/assets/images/icon.png" ]; then
    mkdir -p "$ROOT/local/assets"
    cp "$ROOT/assets/images/icon.png" "$NOTIF_ICON"
    info "Создан local/assets/notification_icon.png из assets/images/icon.png"
  else
    warn "Нет local/assets/notification_icon.png и assets/images/icon.png — сборка Android может ругаться на плагин expo-notifications"
  fi
else
  info "local/assets/notification_icon.png есть"
fi

if [ ! -f "$ROOT/local/assets/notification_sound.wav" ]; then
  warn "Нет local/assets/notification_sound.wav (звук уведомлений)"
else
  info "local/assets/notification_sound.wav есть"
fi

# 3. app.json — версии и идентификаторы
head "3. Конфигурация app.json"
APP_JSON="$ROOT/app.json"
if [ ! -f "$APP_JSON" ]; then
  error "app.json не найден"
  ((ERRORS++))
else
  if grep -q '"bundleIdentifier"' "$APP_JSON" && grep -q '"package"' "$APP_JSON"; then
    info "iOS bundleIdentifier и Android package заданы"
  else
    error "В app.json должны быть ios.bundleIdentifier и android.package"
    ((ERRORS++))
  fi
  if grep -q '"buildNumber"' "$APP_JSON"; then
    info "iOS buildNumber задан"
  else
    warn "Добавьте ios.buildNumber в app.json для App Store"
  fi
  if grep -q '"versionCode"' "$APP_JSON"; then
    info "Android versionCode задан"
  else
    warn "Добавьте android.versionCode в app.json для Google Play"
  fi
  if grep -q '"projectId"' "$APP_JSON"; then
    info "EAS projectId задан (push-уведомления)"
  else
    warn "В extra.eas задайте projectId для push"
  fi
fi

# 4. eas.json
head "4. Конфигурация eas.json"
EAS_JSON="$ROOT/eas.json"
if [ ! -f "$EAS_JSON" ]; then
  error "eas.json не найден. Создайте: eas build:configure"
  ((ERRORS++))
else
  if grep -q '"production"' "$EAS_JSON" && grep -q '"ios"' "$EAS_JSON" && grep -q '"android"' "$EAS_JSON"; then
    info "Профиль production для iOS и Android есть"
  else
  error "В eas.json нужен build.production с настройками ios и android"
  ((ERRORS++))
  fi
fi

# 5. TypeScript
head "5. TypeScript"
if bunx tsc --noEmit 2>/dev/null; then
  info "TypeScript: без ошибок"
else
  error "TypeScript: есть ошибки. Запустите: bun run typecheck"
  ((ERRORS++))
fi

# 6. Линтер
head "6. Линтер"
if bun run lint 2>/dev/null; then
  info "Линтер: без ошибок"
else
  warn "Линтер: есть замечания. По желанию: bun run lint:fix"
fi

# 7. Тесты (опционально)
if [ "$SKIP_TESTS" = false ]; then
  head "7. Тесты"
  if bun run test:unit -- --passWithNoTests --silent 2>/dev/null; then
    info "Unit-тесты: прошли"
  else
    warn "Часть unit-тестов не прошла. Для сборки можно запустить с --skip-tests"
  fi
else
  head "7. Тесты"
  info "Пропущены (--skip-tests)"
fi

# 8. Переменные окружения / EAS Secrets
head "8. Переменные и секреты"
if [ -f "$ROOT/.env.production" ]; then
  info "Файл .env.production есть (для локальной сборки с env)"
else
  warn "Нет .env.production — для EAS Build используйте EAS Secrets: eas secret:list"
fi
echo "   Напоминание: для продакшена добавьте секреты: OPENAI_API_KEY, DATABASE_URL, JWT_SECRET, SENTRY_DSN (см. .env.production.example)"

# Итог
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ $ERRORS -eq 0 ]; then
  info "Подготовка завершена. Можно собирать билды."
  echo ""
  echo "  iOS (production):    eas build --platform ios    --profile production"
  echo "  Android (production): eas build --platform android --profile production"
  echo "  Оба сразу:            eas build --platform all   --profile production"
  echo ""
  echo "  Внутреннее тестирование (APK / симулятор):"
  echo "  eas build --platform android --profile preview   # APK"
  echo "  eas build --platform ios    --profile preview   # симулятор iOS"
  echo ""
  exit 0
else
  error "Найдено проблем: $ERRORS. Исправьте их перед сборкой."
  exit 1
fi
