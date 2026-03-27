# Стандарты тестирования (мировые нормы)

Проект следует общепринятым нормам разработки и тестирования: **Jest**, **Testing Library**, **CI-конвенции**.

---

## 1. Jest (jestjs.io)

| Норма | Применение в проекте |
|-------|----------------------|
| Имена файлов | `*.test.ts` / `*.test.tsx` или `*.spec.ts` |
| Конфиг | Один файл `jest.config.js` в корне (Jest подхватывает автоматически) |
| Группировка | `describe()` — группа, `it()` / `test()` — один сценарий |
| Жизненный цикл | `beforeEach` / `afterEach` для повторяющейся подготовки; `beforeAll` / `afterAll` для тяжёлой инициализации |
| CI | Скрипт `test` в `package.json`; для CI — `jest --ci --coverage --maxWorkers=2` |
| Таймауты | Единый `testTimeout` в конфиге; при необходимости — третий аргумент `it(name, fn, timeout)` |
| Изоляция | Каждый тест независим; моки сбрасывать в `beforeEach` (`jest.clearAllMocks()` и т.п.) |

---

## 2. Testing Library (testing-library.com)

| Норма | Применение в проекте |
|-------|----------------------|
| Принцип | Тестировать так, как пользуется пользователь: UI, а не внутренняя реализация |
| Один элемент | `getBy*` — ожидаем ровно один; `queryBy*` — проверка отсутствия (не бросает); `findBy*` — асинхронное появление |
| Несколько элементов | `getAllBy*` / `queryAllBy*` когда на странице несколько совпадений |
| Действия | `fireEvent` или `userEvent` для кликов, ввода и т.д. |
| Асинхронность | `waitFor()` для обновлений после действий; при обновлении состояния — `act()` |
| Ограничения | Не полагаться на внутренние классы/теги; предпочитать роли, текст, `testId` (для навигации/форм) |

---

## 3. Скрипты и CI

| Скрипт | Назначение |
|--------|------------|
| `test` | Полный прогон тестов (Jest) |
| `test:unit` | Только юнит-тесты, с ограничением воркеров и таймаутом |
| `test:coverage` | Сбор покрытия |
| `test:watch` | Режим разработки (watch) |
| `ci:test` | Режим CI: `--ci --coverage --maxWorkers=2`, переменная `CI=true` для детерминированности |

Переменные окружения для стабильности:
- `CI=true` — в пайплайне (Jest отключает watch, меняет вывод).
- `NODE_OPTIONS='--max-old-space-size=4096'` — при OOM в тяжёлых сьютах.

---

## 4. Структура тестов (AAA)

Рекомендуемая структура одного теста:

1. **Arrange** — подготовка (моки, рендер, данные).
2. **Act** — действие пользователя или вызов логики.
3. **Assert** — проверки через `expect()`.

```ts
it('should do X when user does Y', async () => {
  // Arrange
  const mockFn = jest.fn();
  const { getByRole } = render(<Component onSave={mockFn} />);

  // Act
  fireEvent.press(getByRole('button', { name: 'Save' }));

  // Assert
  await waitFor(() => expect(mockFn).toHaveBeenCalledWith(expected));
});
```

---

## 5. Пропуск тестов (skip)

- Временно пропускать — `it.skip()` / `describe.skip()` с кратким комментарием и ссылкой на тикет или документ.
- Документировать пропущенные тесты и способ их отдельного запуска: см. [SKIPPED_TESTS.md](./SKIPPED_TESTS.md).

---

## 6. Ссылки

- [Jest — Configuration](https://jestjs.io/docs/configuration)
- [Jest — Setup and Teardown](https://jestjs.io/docs/setup-teardown)
- [Testing Library — Guiding Principles](https://testing-library.com/docs/guiding-principles)
- [Testing Library — About Queries](https://testing-library.com/docs/queries/about)
