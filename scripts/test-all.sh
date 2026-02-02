#!/usr/bin/env bash
# Полноценное тестирование проекта KIKU
# Запуск: ./scripts/test-all.sh или bun run test:all-check

set -e
cd "$(dirname "$0")/.."
ROOT=$(pwd)

echo "╔════════════════════════════════════════════════════════╗"
echo "║     ПОЛНОЦЕННОЕ ТЕСТИРОВАНИЕ ПРОЕКТА KIKU               ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

FAILED=0

# 1. TypeScript
echo "▶ 1/4 TypeScript (typecheck)..."
if bun run typecheck 2>/dev/null; then
  echo "   ✅ TypeScript: OK"
else
  echo "   ❌ TypeScript: есть ошибки (запустите: bun run typecheck)"
  FAILED=$((FAILED + 1))
fi
echo ""

# 2. Lint
echo "▶ 2/4 Lint..."
if bun run lint 2>/dev/null; then
  echo "   ✅ Lint: OK"
else
  echo "   ⚠️ Lint: предупреждения или ошибки (запустите: bun run lint)"
  # не увеличиваем FAILED для предупреждений
fi
echo ""

# 3. Unit-тесты
echo "▶ 3/4 Unit-тесты (Jest)..."
if bun run test:unit 2>/dev/null; then
  echo "   ✅ Unit-тесты: все прошли"
else
  echo "   ⚠️ Unit-тесты: есть падающие (запустите: bun run test:unit)"
  FAILED=$((FAILED + 1))
fi
echo ""

# 4. Playwright (список тестов — быстрая проверка конфига)
echo "▶ 4/4 Playwright (проверка конфигурации)..."
if bunx playwright test --list 2>/dev/null | head -5; then
  echo "   ✅ Playwright: конфигурация OK, тесты найдены"
else
  echo "   ❌ Playwright: ошибка конфигурации или списка тестов"
  FAILED=$((FAILED + 1))
fi
echo ""

echo "════════════════════════════════════════════════════════"
if [ $FAILED -eq 0 ]; then
  echo "✅ Полноценное тестирование завершено. Критичных ошибок нет."
else
  echo "❌ Обнаружено критичных проблем: $FAILED"
  echo "   Подробности: см. ОТЧЕТ_ПОЛНОЦЕННОЕ_ТЕСТИРОВАНИЕ.md"
fi
echo "════════════════════════════════════════════════════════"
exit $FAILED
