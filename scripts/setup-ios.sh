#!/bin/bash
# Скрипт для настройки iOS окружения

set -e

echo "🍎 Настройка iOS окружения для KIKU..."

# Проверка Xcode
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Xcode не найден. Установите Xcode из App Store."
    exit 1
fi

echo "✅ Xcode найден: $(xcodebuild -version | head -1)"

# Проверка CocoaPods
if ! command -v pod &> /dev/null; then
    echo "📦 Установка CocoaPods..."
    sudo gem install cocoapods
else
    echo "✅ CocoaPods найден: $(pod --version)"
fi

# Установка Ruby gems (если нужно)
echo "💎 Проверка Ruby gems..."
if ! gem list | grep -q ffi; then
    echo "📦 Установка ffi gem..."
    sudo gem install ffi || {
        echo "⚠️  Не удалось установить ffi через sudo. Попробуйте:"
        echo "   gem install ffi --user-install"
        echo "   или используйте rbenv/rvm для управления Ruby версиями"
    }
fi

# Переход в папку ios
cd "$(dirname "$0")/../ios"

# Установка pods
echo "📦 Установка CocoaPods зависимостей..."
pod install

echo "✅ iOS окружение настроено!"
echo ""
echo "Теперь вы можете запустить:"
echo "  bun run ios        - для нативного запуска"
echo "  bun run ios:sim    - для симулятора через Expo"
