#!/bin/bash

# Точные команды для коммитов улучшений кода
# Проверено и готово к выполнению

set -e  # Остановка при ошибке

echo "🚀 Начинаем структурированные коммиты..."
echo ""

# Проверка статуса перед началом
echo "📊 Текущий статус git:"
git status --short | head -10
echo ""

# ============================================
# КОММИТ 1: Унификация логирования
# ============================================
echo "📝 [1/4] Коммит: Унификация логирования..."

# Проверяем, есть ли изменения в этих файлах
if git diff --name-only | grep -qE "(MonitoringContext|AnalyticsContext|UserContext|ParentalControlsContext|AuthContext|ChatBackgroundsContext|ThemeContext|AIModerationService|_layout|chat/\[chatId\])"; then
  git add constants/MonitoringContext.tsx \
    constants/AnalyticsContext.tsx \
    constants/UserContext.tsx \
    constants/ParentalControlsContext.tsx \
    constants/AuthContext.tsx \
    constants/ChatBackgroundsContext.tsx \
    constants/ThemeContext.tsx \
    constants/AIModerationService.ts \
    app/_layout.tsx \
    app/chat/\[chatId\].tsx 2>/dev/null || true

  git commit -m "feat: unify logging - replace console.* with logger.*" \
    -m "- Replace all console.log/error/warn/info with structured logger" \
    -m "- Add context and action metadata to all log entries" \
    -m "- Improve debugging and monitoring capabilities" \
    -m "- ~60+ replacements across constants/ and app/ directories"
  
  echo "✅ Коммит 1 выполнен"
else
  echo "⚠️ Коммит 1 пропущен (нет изменений в файлах логирования)"
fi
echo ""

# ============================================
# КОММИТ 2: Централизованная обработка ошибок
# ============================================
echo "📝 [2/4] Коммит: Централизованная обработка ошибок..."

# Проверяем наличие errorHandler.ts
if [ -f "utils/errorHandler.ts" ]; then
  # Добавляем новый файл errorHandler.ts
  git add utils/errorHandler.ts
  
  # Добавляем изменения в контекстах (если есть)
  if git diff --name-only | grep -qE "(MonitoringContext|ParentalControlsContext|UserContext)"; then
    git add constants/MonitoringContext.tsx \
      constants/ParentalControlsContext.tsx \
      constants/UserContext.tsx 2>/dev/null || true
  fi

  git commit -m "feat: add centralized error handling with i18n support" \
    -m "- Create utils/errorHandler.ts with user-friendly error messages" \
    -m "- Integrate errorHandler into MonitoringContext, ParentalControlsContext, UserContext" \
    -m "- Add i18n support for error messages (en/ru)" \
    -m "- Add showUserFriendlyError, handleErrorSilently, withErrorHandling functions"
  
  echo "✅ Коммит 2 выполнен"
else
  echo "⚠️ Коммит 2 пропущен (errorHandler.ts не найден)"
fi
echo ""

# ============================================
# КОММИТ 3: Переводы ошибок
# ============================================
echo "📝 [3/4] Коммит: Переводы ошибок..."

if git diff --name-only | grep -qE "locales/(en|ru)\.ts"; then
  git add constants/locales/en.ts constants/locales/ru.ts

  git commit -m "feat: add error message translations to i18n" \
    -m "- Add common.errors section to English and Russian locales" \
    -m "- Support for network, sync, load, save, permission, storage, analysis, SOS, auth errors" \
    -m "- Default error message for fallback cases"
  
  echo "✅ Коммит 3 выполнен"
else
  echo "⚠️ Коммит 3 пропущен (нет изменений в локализациях)"
fi
echo ""

# ============================================
# КОММИТ 4: Документация
# ============================================
echo "📝 [4/4] Коммит: Документация..."

# Собираем все файлы документации, которые существуют
DOC_FILES=""
for file in "СТАТУС_УЛУЧШЕНИЙ.md" \
            "ИТОГОВЫЙ_ОТЧЕТ_УЛУЧШЕНИЙ.md" \
            "ФИНАЛЬНЫЙ_ОТЧЕТ_УЛУЧШЕНИЙ.md" \
            "ОБНОВЛЕНИЕ_ERRORHANDLER_I18N.md" \
            "ПЛАН_КОММИТОВ.md" \
            "КОММИТЫ_ГОТОВЫ.md" \
            "КОММИТЫ_ТОЧНЫЕ.sh"; do
  if [ -f "$file" ]; then
    DOC_FILES="$DOC_FILES $file"
  fi
done

if [ -n "$DOC_FILES" ]; then
  git add $DOC_FILES

  git commit -m "docs: add code quality improvement reports" \
    -m "- Add status and final reports for logging unification" \
    -m "- Document errorHandler i18n integration" \
    -m "- Include improvement metrics and results"
  
  echo "✅ Коммит 4 выполнен"
else
  echo "⚠️ Коммит 4 пропущен (нет файлов документации)"
fi
echo ""

# ============================================
# ИТОГОВЫЙ СТАТУС
# ============================================
echo "📊 Итоговый статус:"
echo ""
git status --short
echo ""
echo "📝 Последние коммиты:"
git log --oneline -5
echo ""
echo "✅ Все коммиты выполнены!"
echo ""
echo "🚀 Для отправки на сервер выполните:"
echo "   git push origin main"
