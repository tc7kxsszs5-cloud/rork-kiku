# Настройка проекта KIKU через Xcode

Краткая инструкция, как настроить и запускать проект KIKU через Xcode на macOS.

**Если Xcode не даёт собрать или запустить приложение** — см. список критических ошибок и их исправление: [`docs/troubleshooting/XCODE_КРИТИЧЕСКИЕ_ОШИБКИ.md`](../troubleshooting/XCODE_КРИТИЧЕСКИЕ_ОШИБКИ.md).

## 1. Установка и проверка Xcode

### Установить Xcode

- **Через App Store:** найдите «Xcode» и установите (рекомендуется).
- **Или:** [developer.apple.com/download](https://developer.apple.com/download/) → скачайте Xcode (.xip), распакуйте и переместите в `/Applications`.

Нужен **полный Xcode.app**, а не только Command Line Tools — для симулятора и сборки iOS.

### Настроить xcode-select

После установки выполните в терминале:

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
```

### Проверить настройку

```bash
# Проверка из проекта (скрипт в package.json)
bun run ios:xcode:check

# Или вручную:
xcodebuild -version
xcode-select -p
# Ожидается: /Applications/Xcode.app/Contents/Developer
```

Подробнее при ошибках: `docs/troubleshooting/XCODE_NOT_FOUND.md`.

---

## 2. Зависимости проекта

В корне проекта:

```bash
bun install
```

### CocoaPods (для папки ios)

Для сборки и открытия в Xcode нужны поды:

```bash
cd ios
pod install
cd ..
```

Если `pod` не найден:

- Установите Ruby 3.0+ (например, через Homebrew: `brew install ruby`).
- Установите CocoaPods: `gem install cocoapods`.
- Либо используйте: `bun run ios:cocoapods` (если в проекте есть скрипт).

После первого `pod install` в Xcode открывайте **`.xcworkspace`**, а не `.xcodeproj`.

---

## 3. Открытие проекта в Xcode

В терминале из корня проекта:

```bash
open ios/KIKU.xcworkspace
```

Если `KIKU.xcworkspace` ещё нет (не делали `pod install`), тогда:

```bash
open ios/KIKU.xcodeproj
```

Рекомендуется всегда использовать **`KIKU.xcworkspace`** после `pod install`.

### В Xcode

1. Выберите схему **KIKU** и целевое устройство (симулятор, например iPhone 15).
2. **Product → Run** (⌘R) или кнопка Run.

Сборка может занять несколько минут при первом запуске.

---

## 4. Запуск через терминал (без открытия Xcode)

Сборка и запуск на симуляторе через Expo/React Native:

```bash
# Нативная сборка и запуск в симуляторе
bun run ios
```

Только симулятор + Metro (без полной нативной пересборки):

```bash
# Автоматический запуск симулятора и Expo
bun run ios:sim

# Безопасный режим (если были ошибки launchd_sim)
bun run ios:sim:safe
```

Так можно разрабатывать, не открывая Xcode каждый раз.

---

## 5. Подпись и возможности (Signing & Capabilities)

Если нужна установка на реальное устройство или архив для App Store:

1. В Xcode откройте **KIKU.xcworkspace**.
2. В списке слева выберите проект **KIKU**, затем target **KIKU**.
3. Вкладка **Signing & Capabilities**:
   - Укажите **Team** (ваш Apple Developer аккаунт).
   - Включите **Automatically manage signing**, если используете автоматическую подпись.

При ошибках подписи проверьте, что выбран правильный Team и Bundle ID совпадает с настройками в Apple Developer.

---

## 6. Частые проблемы

| Проблема | Что сделать |
|----------|-------------|
| «Xcode не найден» | Установить Xcode в `/Applications`, выполнить `bun run ios:xcode:check` и шаги из раздела 1. |
| «Sandbox is not in sync with Podfile.lock» | В папке `ios` выполнить `pod install`, открывать `KIKU.xcworkspace`. |
| Ошибки симулятора / launchd_sim | Использовать `bun run ios:sim:safe` или `docs/troubleshooting/LAUNCHD_SIM_ERROR.md`. |
| Нет команды `pod` | Установить Ruby 3.0+ и CocoaPods (`gem install cocoapods`) или скрипт `bun run ios:cocoapods`. |

---

## Краткий чеклист

1. Установить Xcode в `/Applications`, настроить `xcode-select` и принять лицензию.
2. В корне: `bun install`.
3. В `ios`: `pod install`.
4. Открывать в Xcode: `open ios/KIKU.xcworkspace`.
5. Схема **KIKU** → Run на симуляторе или устройстве.

Для разработки без Xcode в интерфейсе: `bun run ios` или `bun run ios:sim`.
