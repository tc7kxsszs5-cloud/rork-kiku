#!/bin/bash

# Скрипт для выполнения коммитов улучшений кода

set -e

echo "🚀 Начинаем коммиты улучшений кода..."

# Коммит 1: Унификация логирования
echo "📝 Коммит 1: Унификация логирования..."
git add constants/MonitoringContext.tsx \
  constants/AnalyticsContext.tsx \
  constants/UserContext.tsx \
  constants/ParentalControlsContext.tsx \
  constants/AuthContext.tsx \
  constants/ChatBackgroundsContext.tsx \
  constants/ThemeContext.tsx \
  constants/AIModerationService.ts \
  app/_layout.tsx \
  app/chat/[chatId].tsx

git commit -m "feat: unify logging - replace console.* with logger.*" \
  -m "- Replace all console.log/error/warn/info with structured logger" \
  -m "- Add context and action metadata to all log entries" \
  -m "- Improve debugging and monitoring capabilities" \
  -m "- ~60+ replacements across constants/ and app/ directories" || echo "⚠️ Коммит 1 пропущен (нет изменений)"

# Коммит 2: Централизованная обработка ошибок
echo "📝 Коммит 2: Централизованная обработка ошибок..."
git add utils/errorHandler.ts \
  constants/MonitoringContext.tsx \
  constants/ParentalControlsContext.tsx \
  constants/UserContext.tsx

git commit -m "feat: add centralized error handling with i18n support" \
  -m "- Create utils/errorHandler.ts with user-friendly error messages" \
  -m "- Integrate errorHandler into MonitoringContext, ParentalControlsContext, UserContext" \
  -m "- Add i18n support for error messages (en/ru)" \
  -m "- Add showUserFriendlyError, handleErrorSilently, withErrorHandling functions" || echo "⚠️ Коммит 2 пропущен (нет изменений)"

# Коммит 3: Переводы ошибок
echo "📝 Коммит 3: Переводы ошибок..."
git add constants/locales/en.ts constants/locales/ru.ts

git commit -m "feat: add error message translations to i18n" \
  -m "- Add common.errors section to English and Russian locales" \
  -m "- Support for network, sync, load, save, permission, storage, analysis, SOS, auth errors" \
  -m "- Default error message for fallback cases" || echo "⚠️ Коммит 3 пропущен (нет изменений)"

# Коммит 4: Документация (опционально)
echo "📝 Коммит 4: Документация..."
git add СТАТУС_УЛУЧШЕНИЙ.md \
  ИТОГОВЫЙ_ОТЧЕТ_УЛУЧШЕНИЙ.md \
  ФИНАЛЬНЫЙ_ОТЧЕТ_УЛУЧШЕНИЙ.md \
  ОБНОВЛЕНИЕ_ERRORHANDLER_I18N.md \
  ПЛАН_КОММИТОВ.md \
  КОММИТЫ_ГОТОВЫ.md 2>/dev/null || echo "⚠️ Некоторые файлы документации не найдены"

git commit -m "docs: add code quality improvement reports" \
  -m "- Add status and final reports for logging unification" \
  -m "- Document errorHandler i18n integration" \
  -m "- Include improvement metrics and results" || echo "⚠️ Коммит 4 пропущен (нет изменений)"

echo "✅ Все коммиты выполнены!"
echo ""
echo "📊 Статус:"
git status --short
echo ""
echo "📝 Последние коммиты:"
git log --oneline -4
echo ""
echo "🚀 Готово к push: git push origin main"
