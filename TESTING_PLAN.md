# 🧪 Unit Testing Plan - Complete Specification

## Principles

- ✅ **Auto-decide**: Only complex logic where bugs are likely
- ✅ **Deterministic unit tests only**: No integration/async/complex mocking
- ✅ **Exact file paths**: Always specify full paths
- ✅ **Complete code in plan**: Not "add validation", but full implementation
- ✅ **Exact commands with expected output**
- ✅ **TypeScript syntax for all examples**
- ✅ **DRY, YAGNI, frequent commits**

---

## ✅ Current Coverage: 42 Tests (All Passing)

### Status

```bash
$ bun test
42 pass
0 fail
88 expect() calls
Ran 42 tests across 4 files. [113.00ms]
```

---

## 📁 Test Files (Exact Paths)

### 1. Merge Logic Tests
**File**: `backend/trpc/routes/sync/merge-logic.test.ts`
**Tests**: 15
**Coverage**: 
- `mergeMessages` (4 tests)
- `mergeChats` (4 tests)
- `mergeAlerts` (3 tests)
- `getDeltaChats` (4 tests)

**Command**:
```bash
bun test backend/trpc/routes/sync/merge-logic.test.ts
```

**Expected Output**:
```
(pass) mergeMessages > должен объединять сообщения из сервера и клиента
(pass) mergeMessages > должен сохранять порядок сообщений по timestamp
(pass) mergeMessages > должен использовать более свежее сообщение при конфликте
(pass) mergeMessages > должен обрабатывать пустые массивы
(pass) mergeChats > должен объединять чаты из сервера и клиента
(pass) mergeChats > должен объединять сообщения в существующих чатах
(pass) mergeChats > должен использовать более свежие метаданные при конфликте
(pass) mergeChats > должен сохранять максимальный lastActivity
(pass) mergeAlerts > должен объединять алерты без дубликатов
(pass) mergeAlerts > должен использовать более свежий алерт при конфликте
(pass) mergeAlerts > должен сортировать алерты по timestamp (новые сначала)
(pass) getDeltaChats > должен возвращать только измененные чаты
(pass) getDeltaChats > должен фильтровать новые сообщения в чатах
(pass) getDeltaChats > должен возвращать пустой массив если нет изменений
(pass) getDeltaChats > должен обрабатывать чаты с lastActivity вместо updatedAt

15 pass
0 fail
33 expect() calls
```

### 2. Risk Analysis Tests
**File**: `constants/risk-analysis.test.ts`
**Tests**: 13
**Coverage**:
- `evaluateMessageRisk` (8 tests)
- `evaluateImageRisk` (5 tests)

**Command**:
```bash
bun test constants/risk-analysis.test.ts
```

**Expected Output**:
```
(pass) evaluateMessageRisk > должен возвращать safe для безопасных сообщений
(pass) evaluateMessageRisk > должен обнаруживать критические угрозы
(pass) evaluateMessageRisk > должен обнаруживать запросы личных данных
(pass) evaluateMessageRisk > должен обнаруживать финансовое давление
(pass) evaluateMessageRisk > должен обнаруживать признаки груминга
(pass) evaluateMessageRisk > должен увеличивать confidence при множественных совпадениях
(pass) evaluateMessageRisk > должен учитывать восклицательные знаки для safe сообщений
(pass) evaluateMessageRisk > должен выбирать максимальный уровень риска при множественных совпадениях
(pass) evaluateImageRisk > должен блокировать изображения с опасными ключевыми словами
(pass) evaluateImageRisk > должен возвращать причину блокировки
(pass) evaluateImageRisk > должен разрешать безопасные изображения
(pass) evaluateImageRisk > должен работать с разным регистром
(pass) evaluateImageRisk > должен возвращать пустые причины для безопасных изображений

13 pass
0 fail
36 expect() calls
```

### 3. Push Notification Handler Tests
**File**: `utils/pushNotificationHandler.test.ts`
**Tests**: 8
**Coverage**:
- `getRouteFromPushNotification` (8 tests)

**Command**:
```bash
bun test utils/pushNotificationHandler.test.ts
```

**Expected Output**:
```
(pass) getRouteFromPushNotification > должен возвращать маршрут к чату для risk_alert с chatId
(pass) getRouteFromPushNotification > должен возвращать security-settings для risk_alert без chatId но с alertId
(pass) getRouteFromPushNotification > должен возвращать главный экран для risk_alert без chatId и alertId
(pass) getRouteFromPushNotification > должен возвращать security-settings для sos_alert
(pass) getRouteFromPushNotification > должен возвращать профиль для diagnostic уведомлений
(pass) getRouteFromPushNotification > должен возвращать главный экран для неизвестного типа
(pass) getRouteFromPushNotification > должен возвращать null для данных без типа
(pass) getRouteFromPushNotification > должен приоритизировать chatId над alertId для risk_alert

8 pass
0 fail
8 expect() calls
```

### 4. Settings Merge Tests
**File**: `backend/trpc/routes/sync/settings-merge.test.ts`
**Tests**: 6
**Coverage**:
- `mergeSettings` (6 tests)

**Command**:
```bash
bun test backend/trpc/routes/sync/settings-merge.test.ts
```

**Expected Output**:
```
(pass) mergeSettings > должен возвращать клиентские настройки если серверных нет
(pass) mergeSettings > должен возвращать серверные настройки если клиентских нет
(pass) mergeSettings > должен использовать более свежие настройки при конфликте
(pass) mergeSettings > должен использовать серверные настройки если они новее
(pass) mergeSettings > должен объединять настройки если нет timestamp
(pass) mergeSettings > должен обрабатывать пустые объекты

6 pass
0 fail
11 expect() calls
```

---

## 🚀 Commands

### Run All Tests
```bash
cd /Users/mac/Desktop/rork-kiku
bun test
```

**Expected Output**:
```
backend/trpc/routes/sync/merge-logic.test.ts:
[15 tests passing]

backend/trpc/routes/sync/settings-merge.test.ts:
[6 tests passing]

constants/risk-analysis.test.ts:
[13 tests passing]

utils/pushNotificationHandler.test.ts:
[8 tests passing]

42 pass
0 fail
88 expect() calls
Ran 42 tests across 4 files. [113.00ms]
```

### Run Specific Test File
```bash
bun test backend/trpc/routes/sync/merge-logic.test.ts
```

### Run in Watch Mode
```bash
bun test --watch
```

### Type Check (Before Tests)
```bash
bunx tsc --noEmit
```

---

## ✅ What's Tested (Complex Logic Only)

### ✅ Covered (Complex Algorithms)

1. **Merge Logic** (`backend/trpc/routes/sync/merge-logic.test.ts`)
   - Conflict resolution (last-write-wins)
   - Message deduplication and sorting
   - Chat metadata merging
   - Incremental sync filtering

2. **Risk Analysis** (`constants/risk-analysis.test.ts`)
   - Pattern matching with regex
   - Confidence calculation
   - Multiple rule matching
   - Risk level hierarchy

3. **Navigation Routing** (`utils/pushNotificationHandler.test.ts`)
   - Route decision logic
   - Priority handling (chatId > alertId)
   - Type-based routing

4. **Settings Merge** (`backend/trpc/routes/sync/settings-merge.test.ts`)
   - Timestamp-based conflict resolution
   - Fallback merging without timestamps

### ❌ Not Tested (Simple Logic)

- Simple CRUD operations
- UI components
- Simple mappings/transformations
- Configuration files
- Filter operations (`.filter()`, `.map()`)
- Simple calculations

---

## 📊 Test Statistics

| Category | Tests | Files | Status |
|----------|-------|-------|--------|
| Merge Logic | 15 | 1 | ✅ Pass |
| Risk Analysis | 13 | 1 | ✅ Pass |
| Navigation | 8 | 1 | ✅ Pass |
| Settings Merge | 6 | 1 | ✅ Pass |
| **Total** | **42** | **4** | **✅ All Pass** |

---

## 🔍 Code Quality Checks

### Before Committing Tests

```bash
# Type check
bunx tsc --noEmit

# Run tests
bun test

# Expected: All pass, no errors
```

### Test Requirements Met

- ✅ Deterministic (no async, no external deps)
- ✅ Fast execution (~113ms for all)
- ✅ Isolated (each test independent)
- ✅ Clear assertions (88 expect() calls)
- ✅ TypeScript syntax
- ✅ DRY principles (shared test utilities)
- ✅ YAGNI (only test complex logic)

---

## ✅ Status: COMPLETE

All complex algorithms are covered with deterministic unit tests. No additional tests required.

**Last Updated**: 2025-01-06
**Total Tests**: 42
**Pass Rate**: 100%
**Execution Time**: ~113ms
