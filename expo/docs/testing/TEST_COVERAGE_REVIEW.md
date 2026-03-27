# Обзор тестов и покрытия — выводы

*Дата: по результатам запуска `bun run test:unit:coverage`*

---

## 1. Итоги запуска

| Метрика | Значение |
|--------|----------|
| **Тест-сьюты** | 41 пройден, 1 пропущен (skipped) |
| **Тесты** | 629 пройдено, 12 пропущено |
| **Общее покрытие (statements)** | **26.11%** |
| **Покрытие по ветвлениям** | 20.1% |
| **Покрытие по функциям** | 25.74% |
| **Покрытие по строкам** | 26.32% |

Пороги в `jest.config.js` выставлены в 0%, поэтому падение сборки из-за покрытия нет — отчёт только информирует.

---

## 2. Что в порядке

- **Юнит-тесты стабильны**: после правок MonitoringScreen и syncService все 629 тестов проходят.
- **Хорошо покрыты**:
  - `app/(tabs)/index.tsx` (мониторинг) — ~81% строк
  - `app/chat/[chatId].tsx` — ~49% строк
  - `app/security-settings.tsx` — 100% строк
  - `components/settings/*` — 91–93%
  - `utils`: `errorHandler`, `riskEvaluation`, `syncHelpers`, `validation`, `timeRestrictions`, `kpiModeling`, `premiumStatus`, `versioning` — 94–100%
  - `constants`: `AuthContext`, `ThemeContext`, `ParentalControlsContext`, `MonitoringContext` (частично), `NotificationsContext` (частично)
- **Критичная логика прикрыта**: синхронизация (`syncService` ~75%), валидация, оценка риска, миграции (частично).

---

## 3. Слабые места (низкое или нулевое покрытие)

### 3.1 Экраны приложения (app/)

- **app/_layout.tsx** — 0%  
  Корневой layout, провайдеры, сплеш. Сложно тестировать в изоляции; имеет смысл интеграционные или E2E.
- **Табы**: `about`, `profile`, `analytics`, `achievements`, `calls`, `contacts`, `custom-emojis`, `lessons`, `role-selection`, `register-*`, `ai-recommendations`, `status`, `call`, `notifications-diagnostics` — 0%.  
  Основной объём непокрытого UI и сценариев.
- **Backend (trpc, routes)** — 0%  
  API-слой не покрыт юнит-тестами (логично проверять интеграцией или отдельными тестами сервера).

### 3.2 Константы и контексты

- **Контексты без тестов**: `ABTestingContext`, `AIParentingAssistantContext`, `AnalyticsContext`, `GamificationContext`, `PersonalizedAIContext`, `PredictiveAnalyticsContext`, `PremiumContext`, `ReferralProgramContext`, `SecuritySettingsContext`, `SyncSettingsContext`, `ChatBackgroundsContext`, `CombinedProviders`.
- **Локали** (`constants/locales/*`) — 0% (часто не считают приоритетом).
- **Типы** (`types.ts`) — не исполняемый код, на покрытие не влияет.

### 3.3 Компоненты

- **Без покрытия**: `ActivationTracker`, `BackgroundEffects`, `DepthContainer`, `LogoHands`, `PayPalButton`, `StatusCreator`, `StatusViewer`, `SyncStatusIndicator`, `VisualEffects`, `CustomEmoji`.
- **Хорошо покрыты**: `ThemeModeToggle`, `ChatBackgroundPicker`, `CustomEmojiCreator`, `EmojiPicker`, `Typography`, настройки (BiometricAuth, SyncSettings).

### 3.4 Утилиты

- **0%**: `authToken`, `logger`, `sentry`, `performance`, `customEmojis`, `emojiUtils`, `initCustomEmojis`, `integratePurchasedEmojis`, `kpiExport`, `activationTracking`.
- Часть из них — обёртки над внешними сервисами или платформой; тесты часто делают через моки или интеграцию.

---

## 4. Выводы

1. **Качество сценариев**: тесты ориентированы на реальные элементы UI (testID, текст, плейсхолдеры) и на ключевую логику (sync, валидация, риск). После приведения тестов к текущему UI падений нет.
2. **Покрытие 26%** отражает, что:
   - хорошо покрыты: мониторинг, чат, настройки безопасности, часть контекстов и утилит;
   - большая часть экранов и контекстов тестами не закрыта.
3. **Пропуск одного сьюта** (1 skipped) — ожидаемо из-за `testPathIgnorePatterns` или настроек сьюта; на стабильность остальных не влияет.
4. **Backend** сознательно не в фокусе юнит-тестов; его лучше проверять отдельными интеграционными или API-тестами.

---

## 5. Рекомендации (по приоритету)

1. **Не опускать текущий уровень**: при рефакторинге экранов (мониторинг, чат, настройки) не удалять тесты и по возможности дополнять их под новый UI.
2. **Постепенно добавлять тесты**:
   - сначала: экраны с формами и критичной логикой (`register-parent`, `register-child`, `role-selection`, `profile` — ключевые сценарии);
   - затем: контексты, от которых зависят эти экраны (`UserContext`, `AuthContext` уже частично покрыты — расширять при необходимости).
3. **Пороги покрытия**: при желании поднять планку — ввести в `coverageThreshold` мягкие значения (например, не падать при падении ниже 25% по statements по всему проекту), чтобы регрессия была видна, но без жёсткого блокирования.
4. **E2E/интеграция**: для _layout, навигации и полных пользовательских сценариев использовать Playwright/E2E (`test:web`, `test:e2e`) или интеграционные тесты, а не только юниты.
5. **Документация**: этот файл можно обновлять после значимых изменений в тестах или структуре приложения (раз в спринт/релиз).

---

## 6. Команды для повторной проверки

```bash
# Юнит-тесты с покрытием
bun run test:unit:coverage

# Только юниты (быстрее)
bun run test:unit

# Режим отладки одного файла
bunx jest __tests__/unit/screens/MonitoringScreen.test.tsx --no-coverage
```

Итог: тесты в рабочем состоянии, выводы по ним и по покрытию зафиксированы; при необходимости можно опираться на этот обзор для плана по наращиванию тестов.
