# 🔍 GitHub CLI - Проверка статуса репозитория

## ✅ Проверка авторизации

```bash
gh auth status
```

Если авторизация успешна, вы увидите информацию о вашем аккаунте.

## 📊 Команды для проверки репозитория

### Основная информация о репозитории

```bash
# Полная информация о репозитории
gh repo view tc7kxsszs5-cloud/rork-kiku

# JSON формат с конкретными полями
gh repo view tc7kxsszs5-cloud/rork-kiku --json name,description,url,isPrivate,stargazerCount,forkCount,openIssuesCount,updatedAt

# Через API
gh api repos/tc7kxsszs5-cloud/rork-kiku --jq '{stars: .stargazers_count, forks: .forks_count, open_issues: .open_issues_count, description: .description, topics: .topics, language: .language}'
```

### Статистика (если доступна)

```bash
# Просмотры (требует права владельца)
gh api repos/tc7kxsszs5-cloud/rork-kiku/traffic/views

# Клонирования (требует права владельца)
gh api repos/tc7kxsszs5-cloud/rork-kiku/traffic/clones

# Популярные пути (требует права владельца)
gh api repos/tc7kxsszs5-cloud/rork-kiku/traffic/popular/paths

# Референры (требует права владельца)
gh api repos/tc7kxsszs5-cloud/rork-kiku/traffic/popular/referrers
```

### Проверка Topics (тегов)

```bash
gh api repos/tc7kxsszs5-cloud/rork-kiku --jq '.topics'
```

### Проверка Releases

```bash
# Список релизов
gh release list

# Информация о последнем релизе
gh release view latest
```

### Проверка Issues и Pull Requests

```bash
# Список открытых issues
gh issue list

# Список открытых PR
gh pr list

# Статистика
gh api repos/tc7kxsszs5-cloud/rork-kiku --jq '{open_issues: .open_issues_count, open_prs: (.open_issues_count - .open_issues)}'
```

## 📈 Полная статистика через API

```bash
gh api repos/tc7kxsszs5-cloud/rork-kiku --jq '{
  name: .name,
  full_name: .full_name,
  description: .description,
  stars: .stargazers_count,
  forks: .forks_count,
  watchers: .watchers_count,
  open_issues: .open_issues_count,
  language: .language,
  topics: .topics,
  default_branch: .default_branch,
  created_at: .created_at,
  updated_at: .updated_at,
  pushed_at: .pushed_at,
  size: .size,
  license: .license.name,
  visibility: .visibility
}'
```

## 🔧 Полезные команды для управления

### Обновление описания репозитория

```bash
gh repo edit tc7kxsszs5-cloud/rork-kiku --description "🛡️ AI-powered child safety platform. Real-time threat detection, parental controls, SOS alerts, and predictive analytics to protect children online."
```

### Добавление Topics (тегов)

```bash
gh repo edit tc7kxsszs5-cloud/rork-kiku --add-topic react-native --add-topic expo --add-topic typescript --add-topic child-safety --add-topic ai --add-topic machine-learning --add-topic parental-control --add-topic child-protection --add-topic cyber-safety --add-topic mobile-app
```

### Создание Release

```bash
# Создать release с тегом v1.0.0
gh release create v1.0.0 --title "KIDS by KIKU v1.0.0 - Initial Release" --notes "Первая версия KIDS by KIKU с основными функциями безопасности"

# Или с файлом описания
gh release create v1.0.0 --title "KIDS by KIKU v1.0.0" --notes-file release-notes.md
```

## 📝 Скрипт для быстрой проверки

Создайте файл `check-github-status.sh`:

```bash
#!/bin/bash

echo "🔍 Проверка статуса репозитория KIDS by KIKU"
echo ""

# Основная информация
echo "📊 Основная информация:"
gh repo view tc7kxsszs5-cloud/rork-kiku --json name,description,stargazerCount,forkCount,openIssuesCount,updatedAt --jq '{
  Название: .name,
  Описание: .description,
  Звезды: .stargazerCount,
  Форки: .forkCount,
  Открытые Issues: .openIssuesCount,
  Обновлен: .updatedAt
}'

echo ""
echo "🏷️ Topics (теги):"
gh api repos/tc7kxsszs5-cloud/rork-kiku --jq '.topics | join(", ")'

echo ""
echo "📦 Releases:"
gh release list --limit 5

echo ""
echo "✅ Проверка завершена!"
```

Запуск:
```bash
chmod +x check-github-status.sh
./check-github-status.sh
```

## 🎯 Быстрая проверка

Для быстрой проверки всех ключевых метрик:

```bash
gh api repos/tc7kxsszs5-cloud/rork-kiku --jq '{
  "⭐ Звезды": .stargazers_count,
  "🍴 Форки": .forks_count,
  "👀 Watchers": .watchers_count,
  "📝 Открытые Issues": .open_issues_count,
  "🏷️ Topics": (.topics | join(", ")),
  "📅 Обновлен": .updated_at
}'
```

---

**Последнее обновление**: 2025-01-06


