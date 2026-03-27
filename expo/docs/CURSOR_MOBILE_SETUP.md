# Интеграция Cursor Mobile с проектом KIKU

Инструкция по запуску и синхронизации работы с Cursor через приложение **Cursor Mobile** на iPhone с помощью **Cursor AI Agent for Mac**.

## Что это даёт

- Управление Cursor с iPhone: отправка промптов и команд из Cursor Mobile.
- Агент на Mac получает запрос, запускает `cursor-agent` в папке проекта (например, `rork-kiku`) и синхронизирует ответ обратно в общий чат.

## Файлы (у вас в Загрузках)

1. **cursor-ai-agent-mac-1.0.2.tar** — архив приложения для Mac.
2. **cursor-ai-agent-mac-1.0.2 2/** — папка с README (текстовая инструкция).

## Требования

- macOS 13+ (Ventura или новее)
- Установленный Cursor (десктоп)
- Установленный и работающий в Terminal **cursor-agent** CLI
- Приложение **Cursor Mobile** на iOS под тем же аккаунтом Cursor

## Установка

### 1. Установить cursor-agent (если ещё не установлен)

В Terminal:

```bash
cursor-agent --version
```

Если команда не найдена или просит авторизацию:

```bash
cursor login
```

(или установите cursor-agent по инструкции Cursor.)

### 2. Установить приложение Cursor AI Agent for Mac

**Вариант A — из .tar (то, что у вас в Загрузках):**

```bash
cd ~/Downloads
tar -xf cursor-ai-agent-mac-1.0.2.tar
# Переместите .app в Программы (Applications)
mv "CursorAI Agent for Mac.app" /Applications/  # если имя папки после распаковки такое
```

**Вариант B — свежая версия с GitHub Releases:**

- Откройте [Releases › Latest](https://github.com/cursor-releases/cursor-ai-agent-mac/releases/latest) (или актуальную страницу релизов).
- Скачайте **CursorAI Agent for Mac.dmg** или **.zip**.
- DMG: откройте образ и перетащите приложение в **Программы**.
- ZIP: распакуйте и перенесите `.app` в **Программы**.

### 3. Первый запуск

1. Откройте приложение **Cursor AI Agent for Mac** из папки «Программы».
2. Подтвердите диалог «Загружено из интернета», если появится.
3. В меню-баре Mac появится иконка приложения.

### 4. Настройка под проект KIKU

1. Нажмите на иконку агента в меню-баре.
2. Выберите **папку проекта** — укажите каталог репозитория KIKU, например:
   ```
   /Users/mac/Desktop/rork-kiku
   ```
3. Если есть кнопка **«Connect to Cursor»** / вход — нажмите и завершите вход в аккаунт Cursor.

### 5. Cursor Mobile на iPhone

1. Установите **Cursor Mobile** из App Store.
2. Войдите в тот же аккаунт Cursor, что и на Mac.
3. Убедитесь, что iPhone и Mac в одной сети (для синхронизации).

## Использование

- В **Cursor Mobile** отправляйте промпты и команды как в обычном чате.
- Агент на Mac:
  - получает сообщение,
  - запускает `cursor-agent` в выбранной папке (rork-kiku),
  - отправляет результат обратно в общий чат.

Так вы можете запускать и синхронизировать работу с мобильным приложением KIKU (и с Cursor) прямо с телефона.

## Если что-то не работает

1. Проверьте в Terminal: `cursor-agent --version` и при необходимости `cursor login`.
2. В меню-баре агента убедитесь, что выбрана папка проекта **rork-kiku**.
3. Скачайте последнюю версию с [Releases](https://github.com/cursor-releases/cursor-ai-agent-mac/releases) и переустановите приложение.
4. При ошибках можно открыть Issue в репозитории агента, указав версию macOS, версию приложения и скриншот ошибки.

---

*Файлы для интеграции лежат в `~/Downloads`: cursor-ai-agent-mac-1.0.2.tar и cursor-ai-agent-mac-1.0.2 2/ (README).*
