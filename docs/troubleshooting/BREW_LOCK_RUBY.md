# Ошибка: brew install ruby — «process has already locked /usr/local/Cellar/ruby»

Замок остаётся от прерванной или зависшей установки. Чтобы снять его и снова запустить установку:

---

## 1. Завершить процессы Homebrew

В терминале:

```bash
pkill -f "brew.rb"
pkill -f "build.rb"
```

Подождите 3–5 секунд.

---

## 2. Удалить замки Homebrew

**Intel Mac** (Homebrew в `/usr/local`):

```bash
rm -rf /usr/local/var/homebrew/locks
```

**Apple Silicon (M1/M2)** (Homebrew в `/opt/homebrew`):

```bash
rm -rf /opt/homebrew/var/homebrew/locks
```

**Универсально** (если установлен `brew`):

```bash
rm -rf "$(brew --prefix)/var/homebrew/locks"
```

---

## 3. Снова установить Ruby

```bash
brew install ruby
```

После установки:

```bash
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
gem install cocoapods
```

(На Intel Mac путь может быть `/usr/local/opt/ruby/bin` — проверьте: `brew --prefix` и добавьте `$(brew --prefix)/opt/ruby/bin` в PATH.)
