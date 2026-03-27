#!/bin/bash
# Обход ошибки "launchd_sim may have crashed / could not bind to session":
# Сначала открываем Simulator вручную, потом запускаем Expo БЕЗ --ios.
# Expo не вызывает simctl boot → ошибки нет. В меню нажимаете «i».
#
# Использование: bun run ios:sim:safe

set +e  # Не останавливаться на ошибках
cd "$(dirname "$0")/.."

echo "🍎 iOS Simulator (обход launchd_sim)"
echo ""

# Освобождаем порты (без ошибок если не работает)
bun run kill-ports 2>&1 >/dev/null || true
echo ""

# Закрываем зависшие процессы (мягко, без -9)
echo "1️⃣  Очищаем зависшие процессы..."
killall Simulator 2>/dev/null || true
sleep 1
killall com.apple.CoreSimulator.CoreSimulatorService 2>/dev/null || true
sleep 1
# Только если процессы действительно зависли
pkill -f launchd_sim 2>/dev/null || true
sleep 2
echo "   ✓ Процессы очищены"
echo ""

echo "2️⃣  Выключаем все симуляторы..."
xcrun simctl shutdown all 2>/dev/null || true
sleep 2
echo "   ✓ Симуляторы выключены"
echo ""

echo "3️⃣  Открываем Simulator (boot делаем мы, не Expo)..."
open -a Simulator 2>/dev/null || {
    echo "   ⚠️  Не удалось открыть Simulator автоматически"
    echo "   💡 Откройте Simulator вручную: Xcode → Open Developer Tool → Simulator"
    echo "   ⏳ Нажмите Enter когда симулятор будет открыт..."
    read -r
}
echo "   ⏳ Ждём 10 секунд, пока симулятор полностью поднимется..."
sleep 10
echo "   ✓ Simulator запущен"
echo ""

echo "4️⃣  Запускаем Expo (без --ios, без simctl boot)..."
echo ""
echo "   ⬇️  Когда появится меню Expo — нажмите ** i ** для iOS."
echo ""

EXPO_USE_DEV_CLIENT=false bunx expo start --lan
