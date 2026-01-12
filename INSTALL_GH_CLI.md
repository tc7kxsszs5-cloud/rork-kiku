# 📦 Установка GitHub CLI

## macOS (через Homebrew)

```bash
brew install gh
```

После установки авторизуйтесь:

```bash
gh auth login
```

Следуйте инструкциям на экране.

## Альтернативные способы установки

### macOS (без Homebrew)

```bash
# Скачать напрямую
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

Или скачайте с официального сайта: https://cli.github.com/

## После установки

1. Авторизуйтесь:
   ```bash
   gh auth login
   ```

2. Проверьте статус:
   ```bash
   gh auth status
   ```

3. Проверьте репозиторий:
   ```bash
   gh repo view tc7kxsszs5-cloud/rork-kiku
   ```

## Если CLI не нужен

Вы можете использовать веб-интерфейс GitHub:
- Перейдите на https://github.com/tc7kxsszs5-cloud/rork-kiku
- Вкладка "Insights" → "Traffic" для статистики
- Настройки репозитория для Topics, описания и Releases

---

**Примечание**: CLI удобен для автоматизации, но не обязателен. Веб-интерфейс GitHub предоставляет всю необходимую информацию.


