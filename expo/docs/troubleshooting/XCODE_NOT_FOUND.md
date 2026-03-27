# 🔍 Xcode не найден или неправильно настроен

## Проблема

При запуске `bun run ios:xcode:check` вы видите:
```
❌ Xcode не найден ни в /Applications, ни в /Users/mac/Downloads
```

Или:
```
⚠️  xcode-select указывает на неправильный путь
   Текущий: /Library/Developer/CommandLineTools
```

## Причины

1. **Установлены только Command Line Tools** (не полный Xcode)
2. **Xcode не в стандартном месте** (`/Applications/Xcode.app`)
3. **xcode-select не настроен** на правильный путь

## ✅ Решения

### Решение 1: Установить полный Xcode (РЕКОМЕНДУЕТСЯ)

**Для работы с iOS симуляторами нужен полный Xcode.app, а не только Command Line Tools.**

1. **Установите Xcode через App Store:**
   - Откройте App Store
   - Найдите "Xcode"
   - Нажмите "Получить" или "Установить"
   - Дождитесь установки (может занять 1-2 часа)

2. **Или скачайте с developer.apple.com:**
   - Зайдите на https://developer.apple.com/download/
   - Войдите с Apple ID
   - Скачайте Xcode (.xip файл)
   - Распакуйте и переместите в `/Applications`

3. **Настройте xcode-select:**
   ```bash
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -license accept
   ```

4. **Проверьте:**
   ```bash
   bun run ios:xcode:check
   ```

### Решение 2: Если Xcode уже установлен, но не найден

1. **Найдите Xcode:**
   ```bash
   find /Applications -maxdepth 1 -name "*Xcode*" -type d
   find ~/Downloads -maxdepth 1 -name "*Xcode*" -type d
   ```

2. **Если Xcode найден в другом месте, переместите его:**
   ```bash
   # Закройте Xcode если открыт
   killall Xcode 2>/dev/null
   
   # Переместите в Applications
   sudo mv /путь/к/Xcode.app /Applications/Xcode.app
   
   # Настройте xcode-select
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -license accept
   ```

3. **Проверьте:**
   ```bash
   bun run ios:xcode:check
   ```

### Решение 3: Если Xcode в /Applications, но скрипт не находит

1. **Проверьте вручную:**
   ```bash
   ls -la /Applications/Xcode.app
   ```

2. **Если Xcode там есть, но называется по-другому:**
   ```bash
   # Найдите правильное имя
   ls -la /Applications/ | grep -i xcode
   
   # Настройте xcode-select на правильный путь
   sudo xcode-select --switch /Applications/[ИМЯ_XCODE].app/Contents/Developer
   ```

## 🔍 Диагностика

### Проверить текущую конфигурацию:

```bash
# Текущий путь xcode-select
xcode-select -p

# Версия (если установлен)
xcodebuild -version

# Доступные симуляторы
xcrun simctl list devices available
```

### Если установлены только Command Line Tools:

```bash
# Удалить Command Line Tools (опционально)
sudo rm -rf /Library/Developer/CommandLineTools

# Установить полный Xcode через App Store
# Затем настроить:
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

## ⚠️ Важно

- **Command Line Tools ≠ Xcode.app**
- Для симуляторов нужен **полный Xcode.app**
- Xcode должен быть в `/Applications/Xcode.app`
- После установки/перемещения нужно настроить `xcode-select`

## 🚀 После исправления

Когда Xcode настроен правильно:

```bash
# Проверить
bun run ios:xcode:check

# Запустить симулятор
bun run ios:sim
```

---

**Если проблема не решается**, проверьте:
1. Достаточно ли места на диске (Xcode занимает ~15-20 GB)
2. Правильные ли права доступа к `/Applications`
3. Не заблокирован ли Xcode в настройках безопасности macOS
