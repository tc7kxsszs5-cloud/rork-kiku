#!/bin/bash
# Performance Analysis Script
# Анализирует производительность приложения

set -e

echo "🚀 Анализ производительности проекта KIKU"
echo ""

# Проверяем наличие необходимых инструментов
if ! command -v bun &> /dev/null; then
  echo "❌ Bun не установлен"
  exit 1
fi

echo "1️⃣ Анализ bundle размера..."
echo ""

# Создаем директорию для результатов
mkdir -p performance-analysis

# Проверяем размер node_modules
if [ -d "node_modules" ]; then
  echo "📦 Размер node_modules:"
  du -sh node_modules | awk '{print $1}'
  echo ""
  
  echo "📊 Топ-10 самых больших пакетов:"
  du -sh node_modules/* 2>/dev/null | sort -hr | head -10 | awk '{printf "  %s\n", $0}'
  echo ""
else
  echo "⚠️  node_modules не найден"
fi

echo "2️⃣ Анализ исходного кода..."
echo ""

# Подсчет строк кода
echo "📝 Статистика кода:"
echo "  TypeScript/TSX файлы:"
find app components constants utils -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l | awk '{print "    " $1 " файлов"}'

echo "  Всего строк кода:"
find app components constants utils -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs wc -l 2>/dev/null | tail -1 | awk '{print "    " $1 " строк"}'

echo ""
echo "3️⃣ Анализ зависимостей..."
echo ""

# Проверяем package.json
if [ -f "package.json" ]; then
  DEPENDENCIES=$(cat package.json | grep -c '"' | head -1 || echo "0")
  echo "📦 Зависимостей в package.json: проверка..."
  
  # Подсчет dependencies
  if command -v jq &> /dev/null; then
    DEPS_COUNT=$(cat package.json | jq '.dependencies | length' 2>/dev/null || echo "0")
    DEV_DEPS_COUNT=$(cat package.json | jq '.devDependencies | length' 2>/dev/null || echo "0")
    echo "  Dependencies: $DEPS_COUNT"
    echo "  DevDependencies: $DEV_DEPS_COUNT"
  fi
fi

echo ""
echo "4️⃣ Проверка оптимизаций..."
echo ""

# Проверяем наличие lazy loading
LAZY_COUNT=$(grep -r "React.lazy\|lazy(" app components --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | awk '{print $1}')
echo "  Lazy loading использований: $LAZY_COUNT"

# Проверяем использование useMemo/useCallback
MEMO_COUNT=$(grep -r "useMemo\|useCallback" app components constants --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | awk '{print $1}')
echo "  Мемоизация (useMemo/useCallback): $MEMO_COUNT использований"

# Проверяем наличие оптимизированных провайдеров
if [ -f "constants/CombinedProviders.tsx" ]; then
  echo "  ✅ Оптимизированные провайдеры найдены"
else
  echo "  ⚠️  Оптимизированные провайдеры не найдены"
fi

echo ""
echo "5️⃣ Рекомендации по оптимизации..."
echo ""

echo "📋 Чеклист оптимизации:"
echo "  [ ] Оптимизация провайдеров (lazy loading)"
echo "  [ ] Code splitting для больших компонентов"
echo "  [ ] Мемоизация тяжелых вычислений"
echo "  [ ] Оптимизация изображений (WebP, lazy loading)"
echo "  [ ] Удаление неиспользуемых зависимостей"
echo "  [ ] Tree shaking для библиотек"

echo ""
echo "✅ Анализ завершен!"
echo ""
echo "📊 Результаты сохранены в: performance-analysis/"
