#!/bin/bash
# Запуск ios:sim с сохранением полного вывода ошибки.
# Использование: ./scripts/ios-sim-debug.sh
# Результат: ios-sim-output.txt в корне проекта

cd "$(dirname "$0")/.."
OUTPUT_FILE="ios-sim-output.txt"

echo "🔧 Запуск ios:sim с сохранением вывода в $OUTPUT_FILE ..."
echo ""

# Освобождаем порты
bun run kill-ports 2>&1 || true
echo ""

echo "=== Команда: EXPO_USE_DEV_CLIENT=false bunx expo start --ios ===" | tee "$OUTPUT_FILE"
echo "=== Старт: $(date) ===" | tee -a "$OUTPUT_FILE"
echo "" | tee -a "$OUTPUT_FILE"

# Запускаем и пишем в файл + консоль. Код выхода — от expo.
set -o pipefail
EXPO_USE_DEV_CLIENT=false bunx expo start --ios 2>&1 | tee -a "$OUTPUT_FILE"
EXIT_CODE=$?

echo "" | tee -a "$OUTPUT_FILE"
echo "=== Код выхода: $EXIT_CODE ===" | tee -a "$OUTPUT_FILE"
echo "=== Конец: $(date) ===" | tee -a "$OUTPUT_FILE"
echo ""
echo "📄 Полный вывод сохранён в: $OUTPUT_FILE"
echo "📌 Код выхода: $EXIT_CODE"
exit $EXIT_CODE
