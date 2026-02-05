# Критические ошибки, мешающие тестировать проект через Xcode

Ниже перечислены ошибки, из‑за которых **невозможно или нестабильно** запускать и тестировать KIKU через Xcode. Для каждой указано, как проверить и исправить.

---

## 1. Xcode не найден или только Command Line Tools

**Что видите:**  
`Xcode не найден ни в /Applications, ни в /Users/mac/Downloads` или `xcode-select` указывает на `/Library/Developer/CommandLineTools`.

**Почему критично:**  
Без полного **Xcode.app** нет iOS SDK и симуляторов — проект в Xcode не соберётся и не запустится на симуляторе.

**Что сделать:**

1. Установить **полный Xcode** (App Store или [developer.apple.com/download](https://developer.apple.com/download/)).
2. Разместить в `/Applications/Xcode.app`.
3. Выполнить:
   ```bash
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -license accept
   ```
4. Проверить: `bun run ios:xcode:check`.

Подробнее: `docs/troubleshooting/XCODE_NOT_FOUND.md`.

---

## 2. Лицензия Xcode не принята

**Что видите:**  
При сборке или при запуске `xcodebuild -version` — запрос принять лицензию или отказ в выполнении команды.

**Почему критично:**  
Пока лицензия не принята, Xcode/командная строка не дадут собирать и запускать приложение.

**Что сделать:**

```bash
sudo xcodebuild -license accept
```

Ввести пароль администратора. После этого снова собрать/запустить в Xcode.

---

## 3. «The sandbox is not in sync with the Podfile.lock»

**Что видите:**  
В Xcode при сборке: **The sandbox is not in sync with the Podfile.lock** (или похожее сообщение про Pods/sandbox).

**Почему критично:**  
Нет актуального `Podfile.lock` и/или папки `Pods` — нативная часть не соберётся.

**Что сделать:**

1. В терминале:
   ```bash
   cd ios
   pod install
   cd ..
   ```
2. Открывать в Xcode **только** `KIKU.xcworkspace`, а не `KIKU.xcodeproj`:
   ```bash
   open ios/KIKU.xcworkspace
   ```
3. В Xcode снова **Product → Run**.

Если команды `pod` нет — см. пункт 4.

Подробнее: `docs/troubleshooting/XCODE_FIX.md`.

---

## 4. Нет CocoaPods (команда `pod` не найдена)

**Что видите:**  
`pod: command not found` или при установке CocoaPods ошибки из‑за старого Ruby (например, Ruby 2.6 и gem `ffi`).

**Почему критично:**  
Без `pod install` не создаётся `Podfile.lock` и папка `Pods`, не появляется `KIKU.xcworkspace` — сборка в Xcode падает с ошибками про Pods/sandbox.

**Что сделать:**

1. Установить Ruby 3.0+ (через Homebrew):
   ```bash
   brew install ruby
   echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```
2. Установить CocoaPods:
   ```bash
   gem install cocoapods
   ```
3. В проекте:
   ```bash
   cd ios
   pod install
   cd ..
   open ios/KIKU.xcworkspace
   ```

Если в проекте есть скрипт: `bun run ios:cocoapods` (проверьте `package.json`).

---

## 5. Открыт .xcodeproj вместо .xcworkspace

**Что видите:**  
Сборка в Xcode падает с ошибками про отсутствующие модули, Pods, «No such module» и т.п., при этом `pod install` уже делали.

**Почему критично:**  
При открытии **только** `.xcodeproj` Xcode не подхватывает CocoaPods — зависимости не видны, сборка не проходит.

**Что сделать:**

1. Закрыть Xcode.
2. Открыть именно workspace:
   ```bash
   open ios/KIKU.xcworkspace
   ```
3. Дальше собирать и запускать из этого окна (схема **KIKU**, симулятор или устройство).

---

## 6. xcode-select указывает на неправильный путь

**Что видите:**  
`xcode-select -p` показывает путь не к Xcode.app (например, к Command Line Tools), или скрипт проверки пишет, что путь неверный.

**Почему критично:**  
Сборка и симулятор используют ту версию инструментов, на которую указывает `xcode-select`. Неправильный путь ведёт к сбоям сборки или запуска.

**Что сделать:**

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
bun run ios:xcode:check
```

Если Xcode установлен в другое место — переключить на полный путь к `Xcode.app/Contents/Developer`.

---

## 7. Симулятор не запускается (launchd_sim, code 60)

**Что видите:**  
Ошибка вроде:  
`Error: xcrun simctl boot ... code 60`, `launchd failed to respond`, `Failed to start launchd_sim`.

**Почему критично:**  
Сборка в Xcode может пройти, но запуск на симуляторе не удаётся — тестировать в симуляторе нельзя.

**Что сделать:**

1. Исправить и запустить симулятор через скрипты проекта:
   ```bash
   bun run ios:sim:fix
   bun run ios:sim:safe
   ```
   В меню Expo нажать `i` для iOS.
2. Или вручную: закрыть Simulator, выполнить `xcrun simctl shutdown all`, подождать несколько секунд, снова выбрать симулятор в Xcode и Run.

Подробнее: `docs/troubleshooting/LAUNCHD_SIM_ERROR.md`.

---

## 8. Симулятор открывается, но приложение не запускается / зависает

**Что видите:**  
Симулятор открывается, сборка в Xcode проходит, но приложение не показывается, зависает на загрузке или появляется красный экран: «Could not connect to development server».

**Почему так:**  
В режиме **Debug** приложение не содержит встроенный JS-бандл — оно ждёт **Metro** (сервер с JavaScript). Если Metro не запущен, приложению не откуда загружать код, поэтому «процесс запуска не происходит».

**Что сделать:**

1. **Сначала запустить Metro** в отдельном терминале (из корня проекта):
   ```bash
   cd /Users/mac/Desktop/rork-kiku
   bun run start
   ```
   или:
   ```bash
   bunx expo start --lan
   ```
   Дождаться сообщения вроде «Metro waiting on...» и что сервер слушает порт (например 8081).

2. **Потом** в Xcode нажать **Run** (⌘R) или выбрать Product → Run.

3. В симуляторе приложение подключится к Metro и загрузит интерфейс.

**Альтернатива (всё в одном шаге):** не запускать из Xcode, а из терминала — тогда Metro и симулятор запустятся вместе:
   ```bash
   bun run ios:sim
   ```
   или:
   ```bash
   bun run ios
   ```

---

## 9. Ошибки подписи (Signing) при запуске на устройстве

**Что видите:**  
В Xcode при запуске на **реальном устройстве**: «Signing for "KIKU" requires a development team», «No signing certificate» и т.п.

**Почему критично:**  
На устройство приложение не ставится — тестировать на устройстве через Xcode нельзя, пока подпись не настроена.

**Что сделать:**

1. В Xcode: проект **KIKU** → target **KIKU** → вкладка **Signing & Capabilities**.
2. Выбрать **Team** (Apple ID с разработчиком или команда).
3. Включить **Automatically manage signing**.
4. При необходимости поправить **Bundle Identifier**, чтобы он совпадал с настройками в Apple Developer / App Store Connect.

Для теста **только в симуляторе** подпись не обязательна — выберите симулятор (например, iPhone 15) как цель запуска.

---

## Краткая таблица

| Ошибка / ситуация | Блокирует запуск? | Действие |
|-------------------|-------------------|----------|
| Xcode не найден / только Command Line Tools | Да | Установить Xcode.app, настроить `xcode-select` |
| Лицензия не принята | Да | `sudo xcodebuild -license accept` |
| Sandbox / Podfile.lock | Да | `cd ios && pod install`, открывать `.xcworkspace` |
| Нет `pod` (CocoaPods) | Да | Ruby 3.0+, `gem install cocoapods`, затем `pod install` |
| Открыт .xcodeproj вместо .xcworkspace | Да | Закрыть Xcode, открыть `ios/KIKU.xcworkspace` |
| Неверный xcode-select | Часто | `sudo xcode-select --switch .../Xcode.app/Contents/Developer` |
| launchd_sim (code 60) | Симулятор | `bun run ios:sim:fix` и/или `ios:sim:safe` |
| Симулятор открыт, приложение не грузится | Да (ожидание Metro) | Сначала `bun run start`, затем Run в Xcode |
| Ошибки Signing | Только на устройстве | Настроить Team в Signing & Capabilities или тестировать в симуляторе |

После устранения этих пунктов сборка и запуск через Xcode (как в симуляторе, так и на устройстве при настроенной подписи) должны быть возможны. Общая настройка: `docs/setup/НАСТРОЙКА_XCODE.md`.
