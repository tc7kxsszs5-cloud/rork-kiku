#!/bin/bash
# Запускать ПОСЛЕ того как установили Ruby 3: brew install ruby
# Делает: PATH для Ruby 3 → gem install cocoapods → pod install → подсказка для bun run ios

set -e
cd "$(dirname "$0")/.."

RUBY_PATHS="/opt/homebrew/opt/ruby/bin /usr/local/opt/ruby/bin"
for r in $RUBY_PATHS; do
  if [ -x "$r/ruby" ]; then
    export PATH="$r:$PATH"
    break
  fi
done

echo "Ruby: $(which ruby) — $(ruby --version)"
if ! ruby --version | grep -q "3\."; then
  echo ""
  echo "Нужен Ruby 3. Установите: brew install ruby"
  echo "Затем снова запустите: ./scripts/setup-ios-after-ruby.sh"
  exit 1
fi

if ! command -v pod >/dev/null 2>&1; then
  echo "Устанавливаю CocoaPods..."
  gem install cocoapods
fi

echo "pod: $(which pod) — $(pod --version)"
echo "Запускаю pod install в ios/..."
(cd ios && pod install)

echo ""
echo "Готово. Запуск приложения:"
echo "  export PATH=\"$(dirname $(which ruby)):\$PATH\""
echo "  bun run ios"
echo ""
echo "Или одной строкой:"
echo "  cd $(pwd) && export PATH=\"$(dirname $(which ruby)):\$PATH\" && bun run ios"
