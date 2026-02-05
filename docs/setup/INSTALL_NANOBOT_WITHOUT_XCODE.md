# Установка Nanobot без Xcode / без Homebrew

Если `brew install nanobot-ai/tap/nanobot` падает из‑за версии Xcode, можно поставить бинарник напрямую.

## Если curl не качает (таймаут, редирект, сеть)

**Самый надёжный вариант — скачать архив вручную в браузере:**

1. Открой в браузере: **https://github.com/nanobot-ai/nanobot/releases**
2. Выбери последний релиз (например **v0.0.50**).
3. В блоке **Assets** нажми на **`nanobot_darwin_all.tar.gz`** — файл скачается в папку «Загрузки».
4. В терминале выполни:

```bash
cd ~/Downloads
tar -xzf nanobot_darwin_all.tar.gz
mkdir -p ~/bin
mv nanobot ~/bin/
grep -q 'HOME/bin' ~/.zshrc || echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
nanobot --version
```

Так ты обходишь и Xcode, и проблемы с загрузкой через `curl` (редиректы GitHub, таймауты, прокси).

---

## Способ 1: Скачать релиз с GitHub (вручную)

1. Открой: https://github.com/nanobot-ai/nanobot/releases  
2. Последний релиз — например **v0.0.50**.  
3. Скачай для macOS:
   - **Универсальный:** `nanobot_darwin_all.tar.gz`
   - или: `nanobot_darwin_amd64.tar.gz` (Intel), `nanobot_darwin_arm64.tar.gz` (M1/M2)

4. Распакуй и добавь в PATH:

```bash
cd ~/Downloads
tar -xzf nanobot_darwin_all.tar.gz
mkdir -p ~/bin
mv nanobot ~/bin/
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

5. Проверка: `nanobot --version`

## Способ 2: Через curl (если у тебя качается)

**Обязательно используй `-L`** (следовать редиректам). Актуальная версия — **v0.0.50**:

```bash
NANOBOT_VERSION="v0.0.50"
curl -sL -o /tmp/nanobot.tar.gz "https://github.com/nanobot-ai/nanobot/releases/download/${NANOBOT_VERSION}/nanobot_darwin_all.tar.gz"
tar -xzf /tmp/nanobot.tar.gz -C /tmp
mkdir -p ~/bin && mv /tmp/nanobot ~/bin/
grep -q 'HOME/bin' ~/.zshrc || echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
nanobot --version
```

Если `curl` зависает или пишет ошибку — используй установку через браузер (блок выше).

## Если всё же хочешь использовать Homebrew

- Часто ошибка «Xcode» уходит после установки/обновления **Command Line Tools** (без полного Xcode):
  ```bash
  xcode-select --install
  ```
- Или обновление Xcode через App Store / [developer.apple.com](https://developer.apple.com/download/applications/).

Формула Nanobot на macOS не собирает код из исходников — только ставит готовый бинарник, поэтому для самой установки Nanobot Xcode не требуется.
