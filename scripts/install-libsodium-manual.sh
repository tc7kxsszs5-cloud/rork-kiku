#!/bin/bash

# 📦 Установка libsodium вручную (если Homebrew не работает)

set -e

echo "📦 Установка libsodium вручную..."
echo ""

# Создаем временную директорию
TMP_DIR="/tmp/libsodium-install"
mkdir -p "$TMP_DIR"
cd "$TMP_DIR"

echo "📥 Скачивание libsodium 1.0.21..."
echo "   (это может занять несколько минут из-за медленного соединения)"

# Пробуем скачать с несколькими попытками и увеличенным таймаутом
MAX_ATTEMPTS=3
ATTEMPT=1
SUCCESS=false

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "   Попытка $ATTEMPT из $MAX_ATTEMPTS..."
    
    if curl -L --max-time 300 --connect-timeout 30 \
        -o libsodium-1.0.21.tar.gz \
        "https://download.libsodium.org/libsodium/releases/libsodium-1.0.21.tar.gz" 2>&1; then
        SUCCESS=true
        break
    fi
    
    echo "   Не удалось, повторяю через 5 секунд..."
    sleep 5
    ATTEMPT=$((ATTEMPT + 1))
done

if [ "$SUCCESS" = false ]; then
    echo "❌ Не удалось скачать libsodium после $MAX_ATTEMPTS попыток"
    echo ""
    echo "💡 Альтернативные решения:"
    echo "   1. Используйте Expo Go (libsodium не нужен)"
    echo "   2. Попробуйте позже, когда соединение будет лучше"
    echo "   3. Используйте VPN или другое интернет-соединение"
    exit 1
fi

echo "✅ Файл скачан"
echo ""

echo "📦 Распаковка..."
tar -xzf libsodium-1.0.21.tar.gz
cd libsodium-1.0.21

echo "🔧 Конфигурация..."
./configure --prefix=/usr/local

echo "🔨 Компиляция (это может занять 2-5 минут)..."
make -j$(sysctl -n hw.ncpu)

echo "📥 Установка..."
sudo make install

echo ""
echo "✅ libsodium успешно установлен!"
echo ""
echo "Проверка:"
/usr/local/bin/libsodium-config --version || echo "⚠️  libsodium-config не найден, но библиотека установлена"

# Очистка
cd /
rm -rf "$TMP_DIR"

echo ""
echo "🎉 Готово! Теперь можно продолжить установку зависимостей."
