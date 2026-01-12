# 💻 Варианты коммита изменений

## 🎯 Вариант 1: Закоммитить ТОЛЬКО README.md (если добавили видео)

Если вы добавили видео в README.md и хотите закоммитить только его:

```bash
git add README.md
git commit -m "Add demo video to README"
git push
```

---

## 🎯 Вариант 2: Закоммитить ВСЕ изменения

Если хотите закоммитить все изменения сразу:

```bash
git add .
git commit -m "Update project: add demo video guides, improve colors, and documentation"
git push
```

⚠️ **Внимание:** Это закоммитит ВСЕ файлы (включая новые файлы документации, изменения в коде и т.д.)

---

## 🎯 Вариант 3: Закоммитить только новые файлы (документация)

Если хотите закоммитить только новые файлы документации (без изменений в коде):

```bash
# Добавить только новые MD файлы
git add *.md
git add .github/
git add backend/db/
git add backend/middleware/
git add utils/
git commit -m "Add documentation and new features"
git push
```

---

## 🎯 Вариант 4: Разделить на несколько коммитов (рекомендуется)

Закоммитить изменения по категориям:

### 1. Документация для видео и GitHub:

```bash
git add ADD_VIDEO_TO_GITHUB.md GITHUB_SIMPLE_SETUP.md TERMINAL_COMMANDS.md DEMO_VIDEO_SCRIPT.md SIMPLE_VIDEO_GUIDE.md QUICK_START_DEMO_VIDEO.md DEMO_VIDEO_GUIDE.md GITHUB_PRESENTATION.md GITHUB_AND_INVESTOR_SETUP.md INVESTOR_ATTRACTION_STRATEGY.md
git commit -m "Add demo video guides and GitHub presentation documentation"
```

### 2. Изменения цветов:

```bash
git add constants/ColorSystem.tsx app/\(tabs\)/index.tsx app/chat/\[chatId\].tsx app/security-settings.tsx
git commit -m "Update colors to brighter version for kids"
```

### 3. Остальные изменения:

```bash
git add .
git commit -m "Update project files and documentation"
```

### 4. Отправить все:

```bash
git push
```

---

## ✅ Рекомендуемый вариант для вашей ситуации

**Если вы только добавили видео в README.md:**

```bash
git add README.md
git commit -m "Add demo video to README"
git push
```

**Если вы хотите закоммитить всё (включая новую документацию и изменения):**

```bash
git add .
git commit -m "Add demo video guides, update colors, and improve documentation"
git push
```

---

## 🔍 Проверить, что будет закоммичено

Перед коммитом можно посмотреть:

```bash
# Посмотреть статус
git status

# Посмотреть изменения в README.md
git diff README.md

# Посмотреть, что будет добавлено
git add -n .
```

---

## ❓ Если нужна помощь

Скажите, что именно вы хотите закоммитить:
- Только README.md с видео?
- Все изменения?
- Только документацию?

И я помогу с командами!
