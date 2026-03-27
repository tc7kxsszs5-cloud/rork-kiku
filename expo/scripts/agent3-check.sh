#!/bin/bash
# Скрипт для автоматических проверок Агента 3
# Использование: ./scripts/agent3-check.sh [checkpoint_number]

set -e

CHECKPOINT=${1:-"auto"}
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
REPO_ROOT="/Users/mac/Desktop/rork-kiku"

cd "$REPO_ROOT"

echo "🔍 АГЕНТ 3 - Проверка #${CHECKPOINT}"
echo "Время: ${TIMESTAMP}"
echo "=================================="
echo ""

# 1. Unit тесты
echo "📊 Запуск unit тестов..."
TEST_OUTPUT=$(bun run test:unit 2>&1 | tee /tmp/agent3-test-output.txt || true)
TEST_PASSED=$(echo "$TEST_OUTPUT" | grep -oP 'Tests:\s+\K\d+(?=\s+passed)' || echo "0")
TEST_FAILED=$(echo "$TEST_OUTPUT" | grep -oP 'Tests:\s+\d+\s+failed,\s+\K\d+(?=\s+passed)' || echo "0")
TEST_TOTAL=$(echo "$TEST_OUTPUT" | grep -oP 'Tests:\s+\d+\s+failed,\s+\d+\s+passed,\s+\K\d+(?=\s+total)' || echo "643")
SUITE_PASSED=$(echo "$TEST_OUTPUT" | grep -oP 'Test Suites:\s+\K\d+(?=\s+failed)' || echo "0")
SUITE_FAILED=$(echo "$TEST_OUTPUT" | grep -oP 'Test Suites:\s+\d+\s+failed,\s+\K\d+(?=\s+passed)' || echo "0")
SUITE_TOTAL=$(echo "$TEST_OUTPUT" | grep -oP 'Test Suites:\s+\d+\s+failed,\s+\d+\s+passed,\s+\K\d+(?=\s+total)' || echo "42")

echo "  ✅ Тесты: ${TEST_PASSED}/${TEST_TOTAL} (passed)"
echo "  ❌ Тесты: ${TEST_FAILED}/${TEST_TOTAL} (failed)"
echo "  📦 Suites: ${SUITE_PASSED}/${SUITE_TOTAL} (passed)"
echo ""

# 2. TypeScript
echo "🔷 Проверка TypeScript..."
TSC_OUTPUT=$(bun run typecheck 2>&1 | tee /tmp/agent3-tsc-output.txt || true)
TSC_ERRORS=$(echo "$TSC_OUTPUT" | grep -c "error TS" || echo "0")
if [ "$TSC_ERRORS" -eq 0 ]; then
  echo "  ✅ TypeScript: OK"
else
  echo "  ❌ TypeScript: ${TSC_ERRORS} ошибок"
fi
echo ""

# 3. Линтер
echo "🔍 Проверка линтера..."
LINT_OUTPUT=$(bun run lint 2>&1 | tee /tmp/agent3-lint-output.txt || true)
LINT_ERRORS=$(echo "$LINT_OUTPUT" | grep -c "error" || echo "0")
LINT_WARNINGS=$(echo "$LINT_OUTPUT" | grep -c "warning" || echo "0")
if [ "$LINT_ERRORS" -eq 0 ] && [ "$LINT_WARNINGS" -eq 0 ]; then
  echo "  ✅ Линтер: OK"
elif [ "$LINT_ERRORS" -eq 0 ]; then
  echo "  ⚠️  Линтер: ${LINT_WARNINGS} предупреждений"
else
  echo "  ❌ Линтер: ${LINT_ERRORS} ошибок, ${LINT_WARNINGS} предупреждений"
fi
echo ""

# 4. Проверка изменений в prod коде
echo "🔍 Проверка изменений в prod коде..."
PROD_CHANGES=$(git diff HEAD --name-status | grep -E '^(M|A|D).*(app|constants|utils|components)/' | grep -v '__tests__' | wc -l | tr -d ' ')
if [ "$PROD_CHANGES" -eq 0 ]; then
  echo "  ✅ Prod код: Без изменений"
else
  echo "  ⚠️  Prod код: ${PROD_CHANGES} измененных файлов"
  git diff HEAD --name-status | grep -E '^(M|A|D).*(app|constants|utils|components)/' | grep -v '__tests__' | head -10
fi
echo ""

# 5. Расчет прогресса
TEST_PERCENT=$(awk "BEGIN {printf \"%.1f\", ($TEST_PASSED/$TEST_TOTAL)*100}")
SUITE_PERCENT=$(awk "BEGIN {printf \"%.1f\", ($SUITE_PASSED/$SUITE_TOTAL)*100}")

echo "=================================="
echo "📈 ИТОГИ ПРОВЕРКИ #${CHECKPOINT}"
echo "=================================="
echo "Тесты: ${TEST_PASSED}/${TEST_TOTAL} (${TEST_PERCENT}%)"
echo "Suites: ${SUITE_PASSED}/${SUITE_TOTAL} (${SUITE_PERCENT}%)"
echo "TypeScript: $([ "$TSC_ERRORS" -eq 0 ] && echo "✅ OK" || echo "❌ ${TSC_ERRORS} ошибок")"
echo "Линтер: $([ "$LINT_ERRORS" -eq 0 ] && echo "✅ OK" || echo "⚠️  ${LINT_WARNINGS} warnings")"
echo "Prod код: $([ "$PROD_CHANGES" -eq 0 ] && echo "✅ Без изменений" || echo "⚠️  ${PROD_CHANGES} файлов")"
echo ""

# Сохранение результатов
echo "Результаты сохранены в:"
echo "  - /tmp/agent3-test-output.txt"
echo "  - /tmp/agent3-tsc-output.txt"
echo "  - /tmp/agent3-lint-output.txt"
