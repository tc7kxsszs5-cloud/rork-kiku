#!/bin/bash
# Проверка конфликтов между агентами

set -e

echo "🔍 Проверка конфликтов между агентами..."
echo ""

# Проверить активные lock файлы
LOCK_FILES=$(find .agents -name "*.lock" 2>/dev/null | wc -l | tr -d ' ')

if [ "$LOCK_FILES" -eq 0 ]; then
  echo "✅ Нет активных агентов"
  exit 0
fi

echo "⚠️  Активных агентов: $LOCK_FILES"
echo ""

# Проверить пересекающиеся файлы
declare -A AGENT_FILES

for lock in .agents/*.lock; do
  if [ -f "$lock" ]; then
    agent=$(jq -r '.agent // "unknown"' "$lock" 2>/dev/null || echo "unknown")
    branch=$(jq -r '.branch // "unknown"' "$lock" 2>/dev/null || echo "unknown")
    
    echo "📋 Агент: $agent"
    echo "   Branch: $branch"
    
    # Получить список файлов
    files=$(jq -r '.files[]?' "$lock" 2>/dev/null || echo "")
    
    if [ ! -z "$files" ]; then
      echo "   Файлы:"
      echo "$files" | while read -r file; do
        if [ ! -z "$file" ]; then
          echo "     - $file"
          AGENT_FILES["$file"]="${AGENT_FILES[$file]} $agent"
        fi
      done
    fi
    echo ""
  fi
done

# Проверить git конфликты
echo "🔍 Проверка git конфликтов..."
git fetch origin 2>/dev/null || true

CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "develop" ] && [ "$CURRENT_BRANCH" != "main" ]; then
  echo "   Текущая ветка: $CURRENT_BRANCH"
  
  # Проверить изменения относительно develop
  CHANGED_FILES=$(git diff --name-only origin/develop...HEAD 2>/dev/null | wc -l | tr -d ' ')
  
  if [ "$CHANGED_FILES" -gt 0 ]; then
    echo "   ⚠️  Изменено файлов относительно develop: $CHANGED_FILES"
    echo "   Файлы:"
    git diff --name-only origin/develop...HEAD 2>/dev/null | head -10 | while read -r file; do
      echo "     - $file"
    done
  else
    echo "   ✅ Нет изменений относительно develop"
  fi
fi

echo ""
echo "✅ Проверка завершена"
