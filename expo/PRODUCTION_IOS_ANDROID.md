# Подготовка к продакшену: iOS (App Store) и Android (Google Play)

Один проект KIKU — две платформы. Ниже: как настроить, отладить и подготовить сборки, чтобы потом тестировать через Apple Developer и Google Play Console.

---

## Текущее состояние проекта

| Элемент | iOS | Android |
|--------|-----|---------|
| **Идентификатор** | `app.rork.greeting-project-58uufiz` (bundleIdentifier) | `app.rork.greeting_project_58uufiz` (package) |
| **Версия** | version "1.0.0", buildNumber "1" | versionCode 1 |
| **EAS** | Профили production, preview, development | То же |
| **Push** | projectId в app.json (APNs настраивается в EAS) | projectId (FCM — через Firebase + google-services.json при необходимости) |
| **Иконки/сплэш** | assets/images | assets/images + adaptiveIcon |

Конфиги уже подготовлены для обеих платформ. Остаётся пройти проверку, собрать билды и настроить аккаунты разработчика.

---

## Шаг 1. Проверка перед сборкой

Перед первой продакшен-сборкой запустите скрипт проверки:

```bash
chmod +x scripts/prepare-production-build.sh
./scripts/prepare-production-build.sh
```

Скрипт проверяет:

- установку Bun и зависимостей;
- наличие иконки уведомлений (`local/assets/notification_icon.png` — при отсутствии копируется из основной иконки);
- корректность `app.json` (bundleIdentifier, package, buildNumber, versionCode, projectId);
- наличие `eas.json` и профиля production для iOS и Android;
- TypeScript (`bun run typecheck`);
- линтер (`bun run lint`);
- по желанию unit-тесты (без флага `--skip-tests`).

Если всё зелёное — можно собирать. С тестами быстрее: `./scripts/prepare-production-build.sh --skip-tests`.

---

## Шаг 2. Сборки для теста и для магазинов

### Внутреннее тестирование (до магазинов)

Удобно сначала получить билды и протестировать через developer-аккаунты.

**Android — APK для установки вручную или Internal testing:**

```bash
eas build --platform android --profile preview
```

Получите APK, установите на устройство или загрузите в Google Play Console → Internal testing.

**iOS — симулятор (локально) или TestFlight:**

Для реального устройства/TestFlight нужна production-сборка (см. ниже). Для симулятора:

```bash
eas build --platform ios --profile preview
```

После сборки скачайте артефакт и установите в симулятор по инструкции EAS.

### Продакшен-сборки (App Store и Google Play)

**Оба магазина сразу:**

```bash
eas build --platform all --profile production
```

**По отдельности:**

```bash
# Только iOS (App Store / TestFlight)
eas build --platform ios --profile production

# Только Android (Google Play)
eas build --platform android --profile production
```

Первый раз EAS может запросить вход (`eas login`) и настройку credentials (Apple — сертификаты/профили, Android — keystore). Выберите управление через EAS — он создаст и сохранит нужные ключи.

---

## Шаг 3. Тестирование через developer-аккаунты

### Apple: TestFlight

1. **Apple Developer:** https://developer.apple.com — аккаунт $99/год.
2. **App Store Connect:** https://appstoreconnect.apple.com — создайте приложение с тем же bundle ID: `app.rork.greeting-project-58uufiz`.
3. Соберите production-билд:
   ```bash
   eas build --platform ios --profile production
   ```
4. После сборки:
   - либо: `eas submit --platform ios --profile production --latest` (отправит последний билд в App Store Connect);
   - либо: скачайте .ipa из EAS и загрузите вручную в App Store Connect → TestFlight.
5. В App Store Connect → TestFlight добавьте внутренних/внешних тестировщиков и протестируйте установку и работу приложения.

Так вы отлаживаете и тестируете полноценное iOS-приложение перед публикацией в Store.

### Google Play: Internal testing

1. **Google Play Console:** https://play.google.com/console — аккаунт $25 один раз.
2. Создайте приложение с пакетом `app.rork.greeting_project_58uufiz`.
3. Соберите production-билд (AAB для магазина):
   ```bash
   eas build --platform android --profile production
   ```
4. После сборки:
   - либо: `eas submit --platform android --profile production --latest` (нужен настроенный Service Account, см. ниже);
   - либо: скачайте .aab из EAS и загрузите в Play Console → Release → Internal testing.
5. Добавьте тестировщиков по email — они получат ссылку на установку. Проверьте установку и работу приложения.

Так вы отлаживаете и тестируете полноценное Android-приложение перед публикацией в Store.

---

## Шаг 4. Настройка отправки в магазины (eas submit)

В `eas.json` в блоке `submit.production` подставьте свои данные.

### iOS (App Store Connect)

```json
"ios": {
  "appleId": "your-apple-id@example.com",
  "ascAppId": "your-app-id",
  "appleTeamId": "your-team-id"
}
```

- **appleId** — Apple ID (email).
- **ascAppId** — ID приложения в App Store Connect (цифры в URL приложения).
- **appleTeamId** — Team ID в Apple Developer.

После этого:

```bash
eas submit --platform ios --profile production --latest
```

отправит последний production-билд в App Store Connect.

### Android (Google Play)

1. В Google Cloud Console создайте Service Account и скачайте JSON-ключ.
2. В Play Console привяжите этот Service Account и выдайте права на публикацию.
3. Положите ключ в проект, например: `./google-service-account.json`.
4. В `eas.json` укажите путь:

```json
"android": {
  "serviceAccountKeyPath": "./google-service-account.json",
  "track": "production"
}
```

Для Internal testing можно использовать тот же профиль или отдельный с `"track": "internal"`. Тогда:

```bash
eas submit --platform android --profile production --latest
```

отправит последний production-билд в выбранный трек (internal/production).

Подробнее: [docs/deployment/GOOGLE_PLAY_QUICK_START.md](docs/deployment/GOOGLE_PLAY_QUICK_START.md) и [docs/business/APP_STORE_PUBLICATION.md](docs/business/APP_STORE_PUBLICATION.md).

---

## Шаг 5. Переменные окружения и секреты

Для продакшен-сборок EAS использует секреты, а не локальный `.env`. Минимум для работы приложения и бэкенда:

```bash
eas secret:create --scope project --name OPENAI_API_KEY --value "sk-..."
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://your-api.example.com"
# при использовании БД и бэкенда:
eas secret:create --scope project --name DATABASE_URL --value "postgresql://..."
eas secret:create --scope project --name JWT_SECRET --value "your-secret"
# по желанию:
eas secret:create --scope project --name SENTRY_DSN --value "https://...@sentry.io/..."
```

Список имён переменных и пример значений — в `.env.production.example`. Для EAS Build обычно нужны те же ключи, что и для вашего бэкенда/фронта в продакшене.

---

## Краткий чеклист перед первой публикацией

- [ ] Выполнена проверка: `./scripts/prepare-production-build.sh`
- [ ] Есть Apple Developer и приложение в App Store Connect (для iOS)
- [ ] Есть аккаунт в Google Play Console и приложение (для Android)
- [ ] В `eas.json` заполнены `submit.production.ios` и при необходимости `submit.production.android` (Service Account)
- [ ] EAS Secrets созданы (OPENAI_API_KEY, EXPO_PUBLIC_API_URL и др.)
- [ ] Production-сборки успешно собираются: `eas build --platform all --profile production`
- [ ] iOS протестирован через TestFlight
- [ ] Android протестирован через Internal testing
- [ ] При необходимости настроены push: APNs (iOS) и FCM (Android), см. документацию по push в проекте

После этого можно выставлять приложение в продакшен (App Store и Google Play) и при необходимости повторять сборки и отправку через `eas build` и `eas submit`.

---

## Устранение неполадок

### «Detected inconsistent filename casing» (app.json)

На macOS файловая система по умолчанию не различает регистр (App.json и app.json — один файл), а Git и EAS — различают. Если EAS пишет:

```
Detected inconsistent filename casing between your local filesystem and git.
Impacted files: M app.json
```

Нормализуйте имя файла (один раз в репозитории):

```bash
git mv app.json app.json.tmp
git mv app.json.tmp app.json
git add app.json
git commit -m "fix: normalize app.json filename casing for EAS Build"
```

После этого снова запустите `eas build`. Подробнее: https://expo.fyi/macos-ignorecase

### Android: «Gradle build failed with unknown error»

1. **Посмотреть реальную ошибку:** в Expo Dashboard откройте билд → фаза **Run gradlew** → разверните лог. Ищите строки с `FAILURE`, `error:` или `Exception` — там будет причина (репозитории, версии зависимостей, память и т.д.).

2. **Совпадение newArchEnabled:** в `app.json` должно быть `"newArchEnabled": false`, в `android/gradle.properties` — `newArchEnabled=false`. Если было `true` в gradle.properties при `false` в app.json — сборка может падать. В проекте это уже приведено к одному значению.

3. **Проверить локально:** в корне проекта выполните:
   ```bash
   cd android && ./gradlew assembleRelease
   ```
   Текст ошибки в терминале подскажет, что править (часто — недоступный репозиторий, несовместимая версия Gradle/AGP).

4. **Архив 249 MB:** можно уменьшить размер и время загрузки, добавив `.easignore` и исключив `node_modules/.cache`, `__tests__`, `docs`, `*.md` и т.п. Подробнее: https://expo.fyi/eas-build-archive
