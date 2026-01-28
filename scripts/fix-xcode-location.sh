#!/bin/bash
# Исправление проблемы с расположением Xcode
# Использование: ./scripts/fix-xcode-location.sh

set +e
cd "$(dirname "$0")/.."

echo "🔧 Проверка расположения Xcode..."
echo ""

# Проверяем текущий путь
CURRENT_PATH=$(xcode-select -p 2>&1)
echo "📍 Текущий путь xcode-select: $CURRENT_PATH"
echo ""

# Проверяем, что установлено
if [[ "$CURRENT_PATH" == *"CommandLineTools"* ]]; then
    echo "⚠️  Установлены только Command Line Tools, а не полный Xcode"
    echo "   💡 Для работы с симуляторами нужен полный Xcode.app"
    echo ""
elif [[ "$CURRENT_PATH" == *"Xcode.app"* ]]; then
    echo "✅ xcode-select указывает на Xcode.app"
    echo ""
fi

# Проверяем, где находится Xcode
# Сначала проверяем стандартное расположение
if [ -d "/Applications/Xcode.app" ]; then
    echo "✅ Xcode найден в /Applications/Xcode.app (правильное расположение)"
    EXPECTED_PATH="/Applications/Xcode.app/Contents/Developer"
# Проверяем альтернативные расположения
elif [ -d "/Users/mac/Downloads/Xcode.app" ]; then
    echo "⚠️  Xcode найден в /Users/mac/Downloads/Xcode.app (нестандартное расположение)"
    echo "   💡 Рекомендуется переместить в /Applications:"
    echo "      sudo mv /Users/mac/Downloads/Xcode.app /Applications/Xcode.app"
    EXPECTED_PATH="/Users/mac/Downloads/Xcode.app/Contents/Developer"
# Пытаемся найти Xcode через xcodebuild
elif command -v xcodebuild >/dev/null 2>&1 && xcodebuild -version >/dev/null 2>&1; then
    XCODE_PATH=$(xcodebuild -version 2>&1 | head -1)
    echo "⚠️  Xcode установлен, но не найден в стандартных местах"
    echo "   Версия: $XCODE_PATH"
    echo "   💡 Проверяем текущий путь xcode-select..."
    # Пытаемся определить путь из xcode-select
    CURRENT_XCODE_PATH=$(xcode-select -p 2>&1)
    if [[ "$CURRENT_XCODE_PATH" == *"Xcode.app"* ]]; then
        EXPECTED_PATH="$CURRENT_XCODE_PATH"
        echo "   ✅ Найден путь: $EXPECTED_PATH"
    else
        echo "   ❌ Не удалось определить путь к Xcode"
        echo "   💡 Установите Xcode через App Store или скачайте с developer.apple.com"
        exit 1
    fi
else
    echo "❌ Xcode не найден ни в /Applications, ни в /Users/mac/Downloads"
    echo "   💡 Установите Xcode через App Store или скачайте с developer.apple.com"
    exit 1
fi

# Проверяем, правильно ли настроен xcode-select
if [ "$CURRENT_PATH" != "$EXPECTED_PATH" ]; then
    echo ""
    echo "⚠️  xcode-select указывает на неправильный путь"
    echo "   Текущий: $CURRENT_PATH"
    echo "   Ожидаемый: $EXPECTED_PATH"
    echo ""
    
    # Проверяем, существует ли путь
    if [ ! -d "$EXPECTED_PATH" ]; then
        echo "   ❌ Путь $EXPECTED_PATH не существует"
        echo "   💡 Проверьте, что Xcode установлен правильно"
        echo ""
        echo "   Попробуйте найти Xcode:"
        echo "   find /Applications -maxdepth 1 -name '*Xcode*' -type d"
        exit 1
    fi
    
    echo "🔄 Переключаем xcode-select..."
    echo "   ⚠️  Требуется пароль администратора"
    echo ""
    
    sudo xcode-select --switch "$EXPECTED_PATH" 2>&1
    if [ $? -eq 0 ]; then
        echo "   ✅ xcode-select переключен"
        # Обновляем CURRENT_PATH для дальнейших проверок
        CURRENT_PATH=$(xcode-select -p 2>&1)
    else
        echo "   ❌ Не удалось переключить xcode-select"
        echo "   💡 Попробуйте вручную: sudo xcode-select --switch $EXPECTED_PATH"
        echo "   💡 Или проверьте, что Xcode действительно установлен в $EXPECTED_PATH"
        exit 1
    fi
else
    echo "✅ xcode-select настроен правильно"
fi

echo ""
echo "📝 Принимаем лицензию Xcode..."
sudo xcodebuild -license accept 2>&1 || {
    echo "   ⚠️  Не удалось принять лицензию автоматически"
    echo "   💡 Попробуйте вручную: sudo xcodebuild -license accept"
}

echo ""
echo "🔍 Проверяем версию Xcode..."
xcodebuild -version 2>&1

echo ""
echo "✅ Проверка завершена!"
echo ""

# Финальная проверка
FINAL_PATH=$(xcode-select -p 2>&1)
if [[ "$FINAL_PATH" == *"Xcode.app"* ]]; then
    echo "✅ Xcode настроен правильно!"
    echo "   Путь: $FINAL_PATH"
    echo ""
    echo "🚀 Теперь можно запускать симулятор:"
    echo "   bun run ios:sim"
else
    echo "⚠️  Xcode не настроен правильно"
    echo "   Текущий путь: $FINAL_PATH"
    echo ""
    echo "💡 Если вы переместили Xcode в /Applications, выполните:"
    echo "   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer"
    echo "   sudo xcodebuild -license accept"
fi
