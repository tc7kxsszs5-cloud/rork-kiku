#!/bin/bash
echo "🔧 Удаляю все поврежденные iPhone 14 устройства..."

# Удалить все поврежденные iPhone 14
xcrun simctl delete "iPhone 14" 2>/dev/null
xcrun simctl delete "iPhone 14 Plus" 2>/dev/null  
xcrun simctl delete "iPhone 14 Pro" 2>/dev/null
xcrun simctl delete "iPhone 14 Pro Max" 2>/dev/null

echo ""
echo "✅ Поврежденные устройства удалены"
echo ""
echo "📱 Создаю новое устройство iPhone 14..."
xcrun simctl create "iPhone 14" "iPhone 14" "com.apple.CoreSimulator.SimRuntime.iOS-16-0" 2>&1

echo ""
echo "✅ Готово! Теперь запустите:"
echo "   xcrun simctl boot 'iPhone 14' && open -a Simulator"
