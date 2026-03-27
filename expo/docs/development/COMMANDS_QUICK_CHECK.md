# 🚀 Быстрые команды для проверки

## 📊 Проверка статуса репозитория

```bash
# Статус репозитория
git status

# Последние коммиты
git log --oneline -10

# Проверка синхронизации с GitHub
git status -sb
```

## 📧 Проверка писем для инвесторов

```bash
# Количество готовых писем
find INVESTOR_OUTREACH -name "email.txt" -type f | wc -l

# Список всех писем
find INVESTOR_OUTREACH -name "email.txt" -type f

# Все email адреса
grep "^TO:" INVESTOR_OUTREACH/*/email.txt

# Открыть папку с письмами
open INVESTOR_OUTREACH/
```

## 🔍 Проверка кода (аналитика и метрики)

```bash
# Проверить новые события в AnalyticsContext
grep -E "app_installed|user_activated|session_started|feature_used|premium_" constants/AnalyticsContext.tsx | grep "export type"

# Проверить новые метрики
grep -A 10 "totalInstalls\|activationRate\|retention\|premiumSubscribers" constants/AnalyticsContext.tsx | head -20

# Проверить PremiumContext
head -30 constants/PremiumContext.tsx

# Проверить ActivationTracker
cat components/ActivationTracker.tsx
```

## 📋 Просмотр документации

```bash
# README для инвесторов
cat INVESTOR_OUTREACH/README.md

# Инвесторский пакет
cat INVESTOR_PACKAGE_COMPLETE.md | head -50

# Секция для инвесторов в главном README
grep -A 20 "Для инвесторов" README.md
```

## ✅ Быстрая проверка всего

```bash
echo "📊 Статус репозитория:"
git status -sb

echo ""
echo "📧 Готовых писем для инвесторов:"
find INVESTOR_OUTREACH -name "email.txt" -type f | wc -l

echo ""
echo "📋 Последние коммиты:"
git log --oneline -6

echo ""
echo "✅ Все готово к работе!"
```
