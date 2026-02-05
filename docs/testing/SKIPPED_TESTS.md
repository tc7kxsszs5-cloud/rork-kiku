# Пропущенные тесты (skip)

**Дата:** февраль 2025  
**Цель:** зафиксировать, какие тесты временно пропущены и как их запускать отдельно.

---

## 1. StatusViewer (целый сьют)

**Файл:** `__tests__/unit/components/StatusViewer.test.tsx`  
**Причина:** в полном прогоне юнит-тестов воркер Jest падает по памяти (OOM).

**Как запустить отдельно:**

```bash
NODE_OPTIONS='--max-old-space-size=4096' bunx jest __tests__/unit/components/StatusViewer.test.tsx --runInBand --maxWorkers=1 --testTimeout=20000
```

При необходимости можно увеличить `--max-old-space-size` (например, до 8192).

---

## 2. aiService — тест «должен обрабатывать flagged сообщения от OpenAI»

**Файл:** `__tests__/unit/utils/aiService.test.ts`  
**Причина:** в полном прогоне тест нестабилен (возвращается `riskLevel: 'safe'` вместо `'high'` — кэш или порядок моков fetch).

**Как запустить отдельно:**

```bash
bunx jest __tests__/unit/utils/aiService.test.ts --testNamePattern="должен обрабатывать flagged"
```

---

## Рекомендации

- Полный прогон юнит-тестов: `bun run test:unit` (пропущенные сьюты/тесты не блокируют прохождение).
- Периодически пробовать снимать `skip` (например, после обновления Jest или упрощения тяжёлых тестов).
- Новые тесты писать с учётом дубликатов текста (`getAllByText`), асинхронности (`waitFor`/`act`) и моков.

**План разбора и снятия skip:** [PLAN_UNSTABLE_AND_SKIP.md](./PLAN_UNSTABLE_AND_SKIP.md).
