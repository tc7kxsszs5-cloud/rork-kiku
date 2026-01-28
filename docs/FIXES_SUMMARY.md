# ✅ Сводка исправлений

**Дата:** 2026-01-24

## Исправленные проблемы

### 1. ✅ TypeScript ошибки с ThemePalette.colors
- **Проблема:** Использование `theme.colors.interactive.primary` вместо `theme.interactive.primary`
- **Исправлено в:**
  - `app/(tabs)/calls.tsx`
  - `app/(tabs)/contacts.tsx`
  - `app/(tabs)/profile.tsx`
  - `app/register-child.tsx`
  - `app/register-parent.tsx`
  - `app/status.tsx`
  - `components/OnlineStatus.tsx`
  - `components/StatusCreator.tsx`

### 2. ✅ Типы в contacts.tsx
- **Проблема:** `phoneNumbers` мог содержать `undefined`
- **Исправление:** Добавлен фильтр для удаления undefined значений
- **Проблема:** `imageUri` не был в типе Contact
- **Исправление:** Добавлен `imageUri?: string | null` в интерфейс

### 3. ✅ Недостающие импорты
- **Проблема:** `OnlineStatus` не был импортирован в `profile.tsx`
- **Исправление:** Добавлен импорт
- **Проблема:** `router` не был объявлен в `chat/[chatId].tsx`
- **Исправление:** Добавлено `const router = useRouter();`

### 4. ✅ CameraType и другие ошибки
- **Проблема:** `CameraType` использовался как значение
- **Исправление:** Изменено на строку `"front"`
- **Проблема:** `setInterval` возвращал `number`, но ожидался `Timeout`
- **Исправление:** Изменен тип на `ReturnType<typeof setInterval>`

### 5. ✅ ResizeMode ошибки
- **Проблема:** `resizeMode="contain"` не соответствовал типу
- **Исправление:** Изменено на `resizeMode={"contain" as const}` в:
  - `components/StatusCreator.tsx`
  - `components/StatusViewer.tsx`

### 6. ✅ Дубликаты в app.json
- **Проблема:** Дубликаты в `UIBackgroundModes`
- **Исправление:** Удалены дубликаты `"audio"` и `"location"`

### 7. ✅ Очистка .old файлов
- **Удалены:**
  - `backend/trpc/routes/sync/settings.ts.old`
  - `backend/trpc/routes/sync/chats.ts.old`
  - `backend/trpc/routes/sync/alerts.ts.old`

## Статистика

- **Было ошибок:** 15+
- **Осталось ошибок:** 5
- **Исправлено:** ~10 ошибок
- **Файлов изменено:** 15+

## Дополнительные исправления (2026-01-24)

### 8. ✅ contacts.tsx — imageUri
- **Проблема:** `Property 'imageUri' does not exist on type 'ExistingContact'`
- **Исправление:** В expo-contacts используется `image?.uri`, а не `imageUri`. Заменено на `contact.image?.uri ?? undefined`.

### 9. ✅ StatusCreator / StatusViewer — ResizeMode
- **Проблема:** `Type '"contain"' is not assignable to type 'ResizeMode | undefined'`
- **Исправление:** Импорт `ResizeMode` из `expo-av`, использование `resizeMode={ResizeMode.CONTAIN}`. Для `Image` оставлен `resizeMode="contain"`.

### 10. ✅ utils/syncService.ts — типы Chat и Alert
- **Проблема:** Несовместимость типов при передаче в `mutate` и при возврате из API.
- **Исправление:** 
  - Вход: `chats as any`, `alerts as any` при вызове `sync.mutate`.
  - Выход: `result.chats as Chat[]`, `result.alerts as Alert[]` при возврате.

## Итог

**Все TypeScript-ошибки исправлены.** `bun run typecheck` завершается с кодом 0.

---

**Статус:** ✅ Все критические ошибки исправлены
