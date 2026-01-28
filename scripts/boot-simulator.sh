#!/bin/bash
# Загрузка симулятора вручную с проверками
# Использование: ./scripts/boot-simulator.sh [device-name]

set +e
cd "$(dirname "$0")/.."

DEVICE_NAME="${1:-iPhone 14}"

echo "📱 Загрузка iOS Simulator: $DEVICE_NAME"
echo ""

# 1. Проверяем доступные устройства
echo "1️⃣  Проверяем доступные устройства..."
DEVICE_ID=$(xcrun simctl list devices available | grep "$DEVICE_NAME" | head -1 | grep -oE '\([A-F0-9-]+\)' | tr -d '()')

if [ -z "$DEVICE_ID" ]; then
    echo "   ⚠️  Устройство '$DEVICE_NAME' не найдено"
    echo "   📋 Доступные устройства:"
    xcrun simctl list devices available | grep "iPhone\|iPad" | head -5
    echo ""
    echo "   💡 Используйте: ./scripts/boot-simulator.sh 'iPhone 15'"
    exit 1
fi

echo "   ✓ Найдено устройство: $DEVICE_NAME ($DEVICE_ID)"
echo ""

# 2. Выключаем все симуляторы
echo "2️⃣  Выключаем все симуляторы..."
xcrun simctl shutdown all 2>/dev/null || true
sleep 2
echo "   ✓ Симуляторы выключены"
echo ""

# 3. Закрываем процессы Simulator (если открыт)
echo "3️⃣  Закрываем процессы Simulator..."
killall Simulator 2>/dev/null || true
sleep 2
echo "   ✓ Процессы закрыты"
echo ""

# 4. Загружаем конкретное устройство
echo "4️⃣  Загружаем устройство $DEVICE_NAME..."
xcrun simctl boot "$DEVICE_ID" 2>&1
BOOT_STATUS=$?

if [ $BOOT_STATUS -ne 0 ]; then
    echo "   ⚠️  Не удалось загрузить через simctl boot"
    echo "   💡 Пробуем открыть Simulator вручную..."
    open -a Simulator
    sleep 5
    echo "   📱 Откройте устройство вручную: File → Open Simulator → $DEVICE_NAME"
    echo "   ⏳ Нажмите Enter когда устройство будет открыто..."
    read -r
else
    echo "   ✓ Устройство загружено"
    sleep 3
fi
echo ""

# 5. Открываем Simulator приложение
echo "5️⃣  Открываем Simulator приложение..."
open -a Simulator 2>/dev/null || true
sleep 3
echo "   ✓ Simulator открыт"
echo ""

# 6. Проверяем статус
echo "6️⃣  Проверяем статус..."
sleep 2
DEVICE_STATUS=$(xcrun simctl list devices | grep "$DEVICE_NAME" | grep -i "Booted" || echo "")

if [ -z "$DEVICE_STATUS" ]; then
    echo "   ⚠️  Устройство не загружено автоматически"
    echo "   💡 Выберите устройство вручную в Simulator:"
    echo "      File → Open Simulator → $DEVICE_NAME"
    echo ""
    echo "   ⏳ Нажмите Enter когда устройство будет загружено..."
    read -r
else
    echo "   ✅ Устройство успешно загружено: $DEVICE_STATUS"
fi
echo ""

echo "✅ Готово! Теперь можно запустить проект:"
echo "   bun run start:simple"
echo "   (затем нажмите 'i' в терминале)"
echo ""
