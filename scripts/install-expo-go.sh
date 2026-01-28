#!/bin/bash

# 📱 Скрипт для установки Expo Go через терминал
# Поддерживает Android (через adb) и iOS (через xcodebuild)

set -e

echo "📱 Установка Expo Go через терминал для разработчиков"
echo ""

# Определяем платформу
detect_platform() {
  if command -v adb &> /dev/null; then
    # Проверяем, подключено ли Android устройство
    if adb devices | grep -q "device$"; then
      echo "✅ Обнаружено Android устройство"
      return 0
    fi
  fi
  
  if command -v xcrun &> /dev/null; then
    # Проверяем, подключено ли iOS устройство
    if xcrun devicectl list devices 2>/dev/null | grep -q "Connected"; then
      echo "✅ Обнаружено iOS устройство"
      return 1
    fi
  fi
  
  echo "⚠️  Устройство не обнаружено"
  return 2
}

# Установка Expo Go на Android
install_android() {
  echo ""
  echo "🤖 Установка Expo Go на Android..."
  
  # Проверяем подключение устройства
  if ! adb devices | grep -q "device$"; then
    echo "❌ Android устройство не подключено"
    echo "   Подключите устройство через USB и включите режим отладки"
    exit 1
  fi
  
  # Скачиваем APK Expo Go
  APK_URL="https://d1ahtucjixef4r.cloudfront.net/Exponent-2.31.0.apk"
  APK_FILE="/tmp/expo-go.apk"
  
  echo "📥 Скачивание Expo Go APK..."
  curl -L -o "$APK_FILE" "$APK_URL" || {
    echo "❌ Ошибка при скачивании APK"
    echo "   Попробуйте установить вручную через Google Play:"
    echo "   https://play.google.com/store/apps/details?id=host.exp.exponent"
    exit 1
  }
  
  echo "📦 Установка APK на устройство..."
  adb install -r "$APK_FILE" || {
    echo "❌ Ошибка при установке"
    echo "   Попробуйте: adb install -r $APK_FILE"
    exit 1
  }
  
  echo "✅ Expo Go успешно установлен на Android!"
  rm -f "$APK_FILE"
}

# Установка Expo Go на iOS (через TestFlight или App Store)
install_ios() {
  echo ""
  echo "🍎 Установка Expo Go на iOS..."
  
  # iOS требует установку через App Store или TestFlight
  # Через терминал можно только открыть App Store
  
  echo "📱 Открытие App Store для установки Expo Go..."
  
  # Открываем App Store с Expo Go
  open "https://apps.apple.com/app/expo-go/id982107779" || {
    echo "❌ Не удалось открыть App Store"
    echo "   Установите Expo Go вручную:"
    echo "   1. Откройте App Store на iPhone/iPad"
    echo "   2. Найдите 'Expo Go'"
    echo "   3. Установите приложение"
    exit 1
  }
  
  echo "✅ App Store открыт!"
  echo "   Нажмите 'Получить' или 'Установить' в App Store"
  echo ""
  echo "💡 Альтернатива: Установка через TestFlight (для разработчиков)"
  echo "   https://testflight.apple.com/join/..."
}

# Основная логика
main() {
  detect_platform
  PLATFORM=$?
  
  case $PLATFORM in
    0)
      install_android
      ;;
    1)
      install_ios
      ;;
    2)
      echo ""
      echo "❓ Не удалось определить платформу"
      echo ""
      echo "Для Android:"
      echo "  1. Подключите устройство через USB"
      echo "  2. Включите режим отладки по USB"
      echo "  3. Запустите скрипт снова"
      echo ""
      echo "Для iOS:"
      echo "  1. Подключите устройство через USB"
      echo "  2. Доверьтесь компьютеру на устройстве"
      echo "  3. Запустите скрипт снова"
      echo ""
      echo "Или установите вручную:"
      echo "  - Android: https://play.google.com/store/apps/details?id=host.exp.exponent"
      echo "  - iOS: https://apps.apple.com/app/expo-go/id982107779"
      exit 1
      ;;
  esac
  
  echo ""
  echo "🎉 Готово! Теперь можно запустить dev сервер:"
  echo "   bun run start:simple"
  echo ""
  echo "📱 После запуска отсканируйте QR код в Expo Go"
}

main "$@"
