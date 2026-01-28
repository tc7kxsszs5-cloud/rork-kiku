# 📝 Команды для коммита GitHub Community Standards

## 🎯 Что будем коммитить

- `CONTRIBUTING.md` - Руководство для контрибьюторов
- `SECURITY.md` - Политика безопасности
- `CODE_OF_CONDUCT.md` - Обновленный кодекс поведения
- `.github/pull_request_template.md` - Шаблон для PR
- `.github/ISSUE_TEMPLATE/` - Шаблоны для Issues
- `GITHUB_COMMUNITY_STANDARDS_CHECKLIST.md` - Обновленный чеклист

---

## 📋 Команды (пошагово)

### Шаг 1: Проверить текущий статус
```bash
git status
```

### Шаг 2: Добавить файлы в staging area

**Вариант А: Все файлы одной командой**
```bash
git add CONTRIBUTING.md SECURITY.md CODE_OF_CONDUCT.md .github/ GITHUB_COMMUNITY_STANDARDS_CHECKLIST.md
```

**Вариант Б: По одному (если хотите больше контроля)**
```bash
git add CONTRIBUTING.md
git add SECURITY.md
git add CODE_OF_CONDUCT.md
git add .github/pull_request_template.md
git add .github/ISSUE_TEMPLATE/bug_report.md
git add .github/ISSUE_TEMPLATE/feature_request.md
git add .github/ISSUE_TEMPLATE/question.md
git add .github/ISSUE_TEMPLATE/config.yml
git add GITHUB_COMMUNITY_STANDARDS_CHECKLIST.md
```

**Вариант В: Использовать скрипт**
```bash
./COMMIT_COMMUNITY_STANDARDS.sh
```

### Шаг 3: Проверить, что добавлено
```bash
git status
```

### Шаг 4: Создать коммит

**Рекомендуемое сообщение коммита:**
```bash
git commit -m "docs: добавить GitHub Community Standards (CONTRIBUTING, SECURITY, templates)"
```

**Альтернативные варианты сообщения:**
```bash
# Более подробное
git commit -m "docs: добавить полный набор GitHub Community Standards

- Добавлен CONTRIBUTING.md с руководством для контрибьюторов
- Добавлен SECURITY.md с политикой безопасности
- Обновлен CODE_OF_CONDUCT.md
- Добавлены шаблоны для Issues и Pull Requests
- Обновлен GITHUB_COMMUNITY_STANDARDS_CHECKLIST.md

Проект теперь на 100% соответствует GitHub Community Standards"
```

### Шаг 5: Отправить в репозиторий

**Узнать название текущей ветки:**
```bash
git branch --show-current
```

**Отправить изменения:**
```bash
# Если ветка называется main
git push origin main

# Если ветка называется master
git push origin master

# Или автоматически (использует текущую ветку)
git push origin $(git branch --show-current)
```

---

## 🚀 Все команды одной строкой (для копирования)

```bash
git add CONTRIBUTING.md SECURITY.md CODE_OF_CONDUCT.md .github/ GITHUB_COMMUNITY_STANDARDS_CHECKLIST.md && \
git commit -m "docs: добавить GitHub Community Standards (CONTRIBUTING, SECURITY, templates)" && \
git push origin $(git branch --show-current)
```

---

## ✅ Проверка после push

1. **Проверить на GitHub:**
   - Откройте репозиторий: https://github.com/tc7kxsszs5-cloud/rork-kiku
   - Убедитесь, что файлы появились

2. **Проверить Community Standards:**
   - Перейдите: `Insights` → `Community`
   - Должен показаться граф с 100% соответствием

3. **Проверить Issue Templates:**
   - Нажмите "New Issue"
   - Должны появиться опции шаблонов

4. **Проверить PR Template:**
   - Создайте тестовый PR
   - Форма должна заполниться шаблоном

---

## ⚠️ Если что-то пошло не так

### Отменить последний коммит (но сохранить изменения):
```bash
git reset --soft HEAD~1
```

### Убрать файлы из staging area:
```bash
git reset HEAD <файл>
# или все файлы
git reset HEAD
```

### Посмотреть историю коммитов:
```bash
git log --oneline -5
```

---

## 📚 Дополнительная информация

- **Репозиторий:** https://github.com/tc7kxsszs5-cloud/rork-kiku
- **Документация активации:** `GITHUB_COMMUNITY_STANDARDS_ACTIVATION.md`
- **Чеклист стандартов:** `GITHUB_COMMUNITY_STANDARDS_CHECKLIST.md`

---

**Готово к использованию! 🚀**
