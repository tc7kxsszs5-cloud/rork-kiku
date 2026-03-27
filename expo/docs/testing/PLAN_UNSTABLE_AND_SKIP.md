# План: нестабильные тесты и снятие skip

Цель: разобрать нестабильные/пропущенные тесты и периодически пробовать снимать `skip`.

---

## Текущие skip (на февраль 2025)

| Что | Файл | Причина |
|-----|------|--------|
| Весь сьют | `__tests__/unit/components/StatusViewer.test.tsx` | OOM в воркере Jest |
| Один тест | `__tests__/unit/utils/aiService.test.ts` — «должен обрабатывать flagged сообщения от OpenAI» | Нестабилен: возвращает `safe` вместо `high` (кэш/моки fetch) |

---

## Часть 1. Разбор нестабильных тестов

### 1.1. StatusViewer (OOM)

**Причина:** один воркер Jest падает по памяти при прогоне этого сьюта (тяжёлый рендер/моки Video, много тестов в одном файле).

**Шаги разбора:**

1. **Запустить сьют отдельно** (убедиться, что тесты проходят):
   ```bash
   NODE_OPTIONS='--max-old-space-size=4096' bunx jest __tests__/unit/components/StatusViewer.test.tsx --runInBand --maxWorkers=1 --testTimeout=20000
   ```

2. **Снизить потребление памяти:**
   - [ ] Упростить мок `expo-av` (Video): не создавать лишние объекты в ref.
   - [ ] Разбить сьют на несколько файлов (например, по блокам `describe`: рендеринг, навигация, видео) и запускать по одному.
   - [ ] В тестах с видео не рендерить лишние статусы — минимум данных в `mockStatuses`.

3. **Проверить в полном прогоне:**
   - Снять `describe.skip`, оставить `--maxWorkers=2` в `test:unit`.
   - Запустить: `bun run test:unit`.
   - Если OOM сохраняется — вернуть `skip` и записать в «Периодическая проверка» (ниже).

**Критерий снятия skip:** сьют стабильно проходит в `bun run test:unit` без увеличения `max-old-space-size` выше 4096.

---

### 1.2. aiService — тест «должен обрабатывать flagged сообщения от OpenAI»

**Причина:** в полном прогоне тест получает `riskLevel: 'safe'` вместо `'high'` — вероятно срабатывает кэш в `aiService` или порядок моков `fetch`.

**Шаги разбора:**

1. **Запустить тест изолированно:**
   ```bash
   bunx jest __tests__/unit/utils/aiService.test.ts --testNamePattern="должен обрабатывать flagged"
   ```
   - Если проходит — причина в порядке тестов или общем кэше.

2. **Изолировать кэш в тесте:**
   - [ ] В `utils/aiService.ts` добавить экспорт для сброса кэша в тестах, например:
     ```ts
     export function __clearAnalysisCacheForTests(): void {
       analysisCache.clear();
     }
     ```
   - [ ] В `aiService.test.ts` в `beforeEach` (или в начале этого теста) вызывать `__clearAnalysisCacheForTests()`.
   - [ ] Убедиться, что мок `fetch` задаётся в этом тесте (или в `beforeEach` блока) и не перезатирается другими тестами.

3. **Проверить в полном прогоне:**
   - Снять `it.skip`.
   - Запустить: `bun run test:unit`.
   - Если снова падает — проверить, что перед тестом вызывается сброс кэша и что `fetch` мокается предсказуемо.

**Критерий снятия skip:** тест стабильно проходит в `bun run test:unit`.

---

## Часть 2. Периодическая проверка (снятие skip)

**Как часто:** раз в 1–2 месяца или после обновлений Jest/React/Expo.

**Чеклист:**

1. **Обновления зависимостей**
   - [ ] Обновили Jest / jest-expo / React / Testing Library?
   - [ ] Запустить полный прогон и отдельно сьют StatusViewer и тест aiService (команды из раздела 1). Если проходят — попробовать снять skip.

2. **StatusViewer**
   - [ ] Снять `describe.skip` в `StatusViewer.test.tsx`.
   - [ ] Запустить: `bun run test:unit`.
   - [ ] Если OOM — вернуть `describe.skip`, в комментарии указать дату проверки.

3. **aiService (flagged)**
   - [ ] Снять `it.skip` в `aiService.test.ts`.
   - [ ] Запустить: `bun run test:unit`.
   - [ ] Если падает — вернуть `it.skip`, в комментарии указать дату проверки.

4. **Зафиксировать результат**
   - Обновить дату в `docs/testing/SKIPPED_TESTS.md`.
   - При снятии skip — убрать соответствующий пункт из SKIPPED_TESTS.md и из этого плана.

---

## Часть 3. Другие нестабильные тесты (без skip)

Если появятся падающие тесты без skip (например, UserContext — язык, или другие по таймауту/мокам):

1. **Записать** в этот файл: файл, имя теста, ошибка, шаги воспроизведения.
2. **Разобрать** по тому же принципу: воспроизведение изолированно → исправление моков/таймингов/кэша → проверка в полном прогоне.
3. **Если исправить быстро нельзя** — временно поставить `it.skip` и добавить в SKIPPED_TESTS.md с планом исправления.

---

## Краткие команды

```bash
# Только StatusViewer (отдельно)
NODE_OPTIONS='--max-old-space-size=4096' bunx jest __tests__/unit/components/StatusViewer.test.tsx --runInBand --maxWorkers=1 --testTimeout=20000

# Только тест aiService про flagged
bunx jest __tests__/unit/utils/aiService.test.ts --testNamePattern="должен обрабатывать flagged"

# Полный юнит-прогон (после снятия skip)
bun run test:unit
```

---

## Ссылки

- [SKIPPED_TESTS.md](./SKIPPED_TESTS.md) — список пропущенных тестов и команды.
- [TESTING_STANDARDS.md](./TESTING_STANDARDS.md) — стандарты тестирования.
