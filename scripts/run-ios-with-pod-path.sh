#!/bin/bash
# Запуск expo run:ios с PATH, в котором гарантированно есть pod (обход ошибки "Unable to install CocoaPods via Homebrew")
# Использование: ./scripts/run-ios-with-pod-path.sh [аргументы для expo run:ios]

cd "$(dirname "$0")/.."

# Собираем PATH: все типичные места, где может быть pod
EXTRA_PATH="/usr/local/bin:/opt/homebrew/bin"
[ -d "/opt/homebrew/opt/ruby/bin" ] && EXTRA_PATH="/opt/homebrew/opt/ruby/bin:$EXTRA_PATH"
# gem --user-install кладёт в ~/.gem/ruby/*/bin
for dir in "$HOME/.gem/ruby"/[0-9]*/bin; do
  [ -d "$dir" ] && EXTRA_PATH="$dir:$EXTRA_PATH"
done
# Явно ищем pod и добавляем его каталог
POD_PATH=$(command -v pod 2>/dev/null || true)
[ -z "$POD_PATH" ] && [ -x "/usr/local/bin/pod" ] && POD_PATH="/usr/local/bin/pod"
[ -z "$POD_PATH" ] && [ -x "/opt/homebrew/bin/pod" ] && POD_PATH="/opt/homebrew/bin/pod"
if [ -n "$POD_PATH" ]; then
  EXTRA_PATH="$(dirname "$POD_PATH"):$EXTRA_PATH"
fi

export PATH="$EXTRA_PATH:$PATH"

# Проверка: если pod всё ещё не найден — не запускать expo, чтобы не получить ошибку Homebrew
if ! command -v pod >/dev/null 2>&1; then
  echo ""
  echo "⚠️  CocoaPods (pod) не найден в PATH. Expo тогда попытается установить его через Homebrew и выдаст ошибку."
  echo ""
  echo "Сделайте одно из двух:"
  echo "  1) Установите CocoaPods вручную:  sudo gem install cocoapods"
  echo "  2) Или запускайте без нативной сборки:  bun run start  → затем нажмите i для iOS"
  echo ""
  exit 1
fi

# Явно передаём PATH дочернему процессу (на случай, если bun/node его не наследуют)
exec env PATH="$EXTRA_PATH:$PATH" bunx expo run:ios "$@"
