# Ошибка: Unable to install the CocoaPods CLI (Homebrew failed)

## Что видите

```
⚠️  Unable to install the CocoaPods CLI.
Failed to install CocoaPods with Homebrew. Install CocoaPods CLI and try again: https://cocoapods.org/
└─ Cause: brew install cocoapods exited with non-zero code: 1
error: script "ios" exited with code 1
```

Это значит: **Expo** при запуске `bun run ios` пытается поставить CocoaPods через Homebrew, и установка не удалась. CocoaPods нужно поставить вручную через **gem** (не через Homebrew).

---

## Быстрые шаги (скопируйте в терминал)

**Вариант А — попробовать с системным Ruby (одна команда):**

```bash
sudo gem install cocoapods
```

Если установилось без ошибок — дальше:

```bash
cd /Users/mac/Desktop/rork-kiku/ios && pod install && cd ..
```

Потом можно снова: `bun run ios`.

**Вариант Б — если Вариант А выдал ошибку (поставить Ruby 3, потом CocoaPods):**

```bash
brew install ruby
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
gem install cocoapods
cd /Users/mac/Desktop/rork-kiku/ios && pod install && cd ..
```

После этого `bun run ios` не будет пытаться ставить CocoaPods через Homebrew.

**Вариант В — пока обойтись без CocoaPods:** не использовать `bun run ios`, а запускать так: `bun run start`, затем в меню нажать **i** (iOS симулятор). Или на телефоне: приложение Expo Go + QR-код от `bun run start`.

**Если при запуске `pod` появляется ошибка Ruby 2.6** (строки про `rubygems.rb`, `activate_bin_path`, `/Ruby.framework/Versions/2.6/`): системный Ruby 2.6 конфликтует с установленным CocoaPods. Нужно использовать **Ruby 3** и поставить CocoaPods через него — см. раздел «Ошибка Ruby 2.6 при запуске pod» ниже.

**Если `bun run ios` всё равно пишет «Unable to install CocoaPods via Homebrew»:** в терминале выполните `which pod`. Если путь выводится (и `pod` запускается без ошибки), запустите так:
```bash
export PATH="$(dirname $(which pod)):$PATH"
bun run ios
```
Если `which pod` ничего не выводит или `pod` падает с ошибкой Ruby — сделайте Вариант Б (Ruby 3 + CocoaPods) ниже.

---

## Решение 1: Установить CocoaPods через gem (попробовать первым)

В терминале выполните:

```bash
sudo gem install cocoapods
```

Если установка прошла без ошибок:

```bash
cd /Users/mac/Desktop/rork-kiku/ios
pod install
cd ..
bun run ios
```

Если при `sudo gem install cocoapods` появляются ошибки (часто из‑за старого системного Ruby) — переходите к Решению 2.

---

## Решение 2: Ruby 3+ и CocoaPods через gem (если Решение 1 не сработало)

На macOS системный Ruby бывает старым (2.6), и с ним `gem install cocoapods` может падать. Поставьте Ruby через Homebrew, затем CocoaPods через gem (не через `brew install cocoapods`).

### Шаг 1: Установить Ruby

```bash
brew install ruby
```

### Шаг 2: Подключить Ruby в PATH

Для zsh (обычный терминал на Mac):

```bash
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Проверьте:

```bash
ruby --version
# Должно быть 3.x
```

### Шаг 3: Установить CocoaPods через gem

```bash
gem install cocoapods
```

(без `sudo` — ставится в ваш пользовательский каталог)

### Шаг 4: Установить поды и запустить проект

```bash
cd /Users/mac/Desktop/rork-kiku/ios
pod install
cd ..
bun run ios
```

---

## Ошибка Ruby 2.6 при запуске pod (activate_bin_path)

**Что видите:** при запуске `pod` или `pod install` — длинный стек с `rubygems.rb`, `activate_bin_path`, путём `/System/Library/Frameworks/Ruby.framework/Versions/2.6/`.

**Почему:** CocoaPods установлен под другим Ruby (или сломался под системным Ruby 2.6). Команда `pod` в `/usr/local/bin/` пытается запуститься через системный Ruby 2.6 и падает.

**Что сделать:** использовать **Ruby 3** (через Homebrew) и поставить CocoaPods под ним. Дальше всегда вызывать `pod` через этот Ruby.

### Шаги (по порядку)

1. **Установить Ruby 3:**
   ```bash
   brew install ruby
   ```

2. **Подключить Ruby 3 в PATH** (в начале, чтобы он имел приоритет):
   ```bash
   echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```
   Проверка: `ruby --version` — должно быть 3.x.

3. **Поставить CocoaPods под Ruby 3** (без sudo):
   ```bash
   gem install cocoapods
   ```

4. **Проверить, что pod работает:**
   ```bash
   which pod
   pod --version
   ```
   Должны вывести путь (например `/opt/homebrew/opt/ruby/bin/pod` или `~/.gem/ruby/3.x.x/bin/pod`) и версию.

5. **Установить поды в проекте:**
   ```bash
   cd /Users/mac/Desktop/rork-kiku/ios
   pod install
   cd ..
   ```

6. **Запускать приложение** с этим PATH (чтобы Expo тоже видел правильный pod):
   ```bash
   cd /Users/mac/Desktop/rork-kiku
   export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
   bun run ios
   ```
   Или одной строкой:
   ```bash
   cd /Users/mac/Desktop/rork-kiku && export PATH="/opt/homebrew/opt/ruby/bin:$PATH" && bun run ios
   ```

**Важно:** в новых терминалах PATH подхватится из `~/.zshrc`. Если запускаете из Cursor/IDE — перезапустите терминал или выполните `source ~/.zshrc`, чтобы `pod` был из Ruby 3.

---

## Решение 3: Обойтись без CocoaPods (только симулятор через Expo)

Если сейчас не нужна нативная сборка через Xcode, можно запускать приложение без `expo run:ios`:

1. **Симулятор + Metro** (одна команда запускает Metro и симулятор):

   ```bash
   bun run ios:sim
   ```

   Если скрипт сам пытается ставить CocoaPods и падает — сначала просто запустите Metro и откройте симулятор вручную:

   ```bash
   bun run start
   ```

   В другом терминале (если есть Xcode и симулятор):

   ```bash
   open -a Simulator
   ```

   В меню Expo нажмите `i` для iOS.

2. **Реальное устройство**: установите приложение **Expo Go** на телефон, запустите `bun run start` и отсканируйте QR-код — CocoaPods не нужен.

---

## Кратко

| Цель | Действие |
|------|----------|
| Поставить CocoaPods быстро | `sudo gem install cocoapods` → если ок, то `cd ios && pod install` |
| Не помогло (ошибки Ruby) | `brew install ruby`, добавить в PATH, затем `gem install cocoapods` и снова `cd ios && pod install` |
| Запустить без нативной сборки | `bun run ios:sim` или `bun run start` + Expo Go на телефоне |

После успешного `pod install` команда `bun run ios` не будет пытаться ставить CocoaPods через Homebrew.
