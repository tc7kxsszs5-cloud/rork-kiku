#!/bin/bash

# Скрипт для коммитов незакоммиченных файлов
# Группировка по логическим категориям

set -e

echo "🚀 Начинаем коммиты незакоммиченных файлов..."
echo ""

# ============================================
# КОММИТ 1: CI/CD и конфигурация
# ============================================
echo "📝 [1/6] Коммит: CI/CD и конфигурация..."
git add .github/workflows/ci.yml .gitignore jest.config.js jest.setup.js bun.lock
git commit -m "chore: update CI/CD and configuration files" \
  -m "- Update GitHub Actions workflow" \
  -m "- Update .gitignore" \
  -m "- Update Jest configuration" \
  -m "- Update bun.lock" || echo "⚠️ Коммит 1 пропущен"
echo ""

# ============================================
# КОММИТ 2: Документация (основная)
# ============================================
echo "📝 [2/6] Коммит: Основная документация..."
git add README.md TESTING_GUIDE.md __tests__/README.md
git commit -m "docs: update project documentation" \
  -m "- Update README.md" \
  -m "- Update TESTING_GUIDE.md" \
  -m "- Update tests README" || echo "⚠️ Коммит 2 пропущен"
echo ""

# ============================================
# КОММИТ 3: Тесты
# ============================================
echo "📝 [3/6] Коммит: Тесты..."
git add __tests__/unit/utils/versioning.test.ts
git commit -m "test: update versioning tests" \
  -m "- Update versioning test file" || echo "⚠️ Коммит 3 пропущен"
echo ""

# ============================================
# КОММИТ 4: Типы
# ============================================
echo "📝 [4/6] Коммит: Типы..."
git add constants/types.ts
git commit -m "feat: update type definitions" \
  -m "- Update constants/types.ts" || echo "⚠️ Коммит 4 пропущен"
echo ""

# ============================================
# КОММИТ 5: Backend (tRPC)
# ============================================
echo "📝 [5/6] Коммит: Backend tRPC..."
git add backend/trpc/app-router.ts backend/trpc/routes/notifications/send-push.ts
git commit -m "feat: update backend tRPC routes" \
  -m "- Update app-router.ts" \
  -m "- Update send-push notification route" || echo "⚠️ Коммит 5 пропущен"
echo ""

# ============================================
# КОММИТ 6: UI компоненты (tabs)
# ============================================
echo "📝 [6/6] Коммит: UI компоненты (tabs)..."
git add app/(tabs)/_layout.tsx app/(tabs)/analytics.tsx app/(tabs)/index.tsx app/(tabs)/profile.tsx
git commit -m "feat: update tab screens" \
  -m "- Update tabs layout" \
  -m "- Update analytics screen" \
  -m "- Update index screen" \
  -m "- Update profile screen" || echo "⚠️ Коммит 6 пропущен"
echo ""

# ============================================
# КОММИТ 7: Новые компоненты (опционально)
# ============================================
echo "📝 [7/7] Коммит: Новые компоненты..."
if [ -f "components/ChatBackgroundPicker.tsx" ] && [ -f "components/SyncStatusIndicator.tsx" ]; then
  git add components/ChatBackgroundPicker.tsx components/SyncStatusIndicator.tsx
  git commit -m "feat: add new components" \
    -m "- Add ChatBackgroundPicker component" \
    -m "- Add SyncStatusIndicator component" || echo "⚠️ Коммит 7 пропущен"
else
  echo "⚠️ Коммит 7 пропущен (файлы не найдены)"
fi
echo ""

# ============================================
# КОММИТ 8: Новые утилиты (опционально)
# ============================================
echo "📝 [8/8] Коммит: Новые утилиты..."
if [ -f "utils/aiService.ts" ] && [ -f "utils/syncService.ts" ]; then
  git add utils/aiService.ts utils/syncService.ts
  git commit -m "feat: add utility services" \
    -m "- Add aiService.ts" \
    -m "- Add syncService.ts" || echo "⚠️ Коммит 8 пропущен"
else
  echo "⚠️ Коммит 8 пропущен (файлы не найдены)"
fi
echo ""

# ============================================
# ИТОГОВЫЙ СТАТУС
# ============================================
echo "📊 Итоговый статус:"
echo ""
git status --short | head -20
echo ""
echo "📝 Последние коммиты:"
git log --oneline -8
echo ""
echo "✅ Коммиты выполнены!"
echo ""
echo "🚀 Для отправки на сервер: git push origin main"
