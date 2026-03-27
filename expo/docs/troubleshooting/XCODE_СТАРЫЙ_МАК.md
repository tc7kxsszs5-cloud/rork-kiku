# Xcode 15.2 не ставится: старая версия macOS

## Когда Xcode 15.2 **поставится**

Xcode 15.2 устанавливается **только на macOS 13.5 или новее** (Ventura и выше).

Если у вас **macOS Ventura 13.5+** — да, скачанный с [developer.apple.com/download](https://developer.apple.com/download/) Xcode 15.2 (.xip) вы сможете поставить: распаковать .xip и перенести **Xcode.app** в `/Applications`. App Store для этого не нужен.

---

## Как узнать свою версию macOS

В терминале:

```bash
sw_vers
```

Или: **Системные настройки** → **Основные** → **Об этом Mac** — смотрите номер версии (например, 13.6 или 12.7).

- **13.5, 13.6, 14.x, 15.x** — Xcode 15.2 поставить **можно** (скачать .xip с developer.apple.com).
- **12.x (Monterey) или старше** — Xcode 15.2 **не установится** (Apple не поддерживает).

---

## Если у вас macOS 12 (Monterey) или старше

На такой системе Xcode 15.2 **не ставится** — ограничение Apple, обойти нельзя.

Варианты:

1. **Обновить macOS до Ventura (13.5+)** — если ваш Mac это поддерживает (проверьте на [support.apple.com](https://support.apple.com/ru-ru/HT201475)). После обновления можно поставить Xcode 15.2 с [developer.apple.com/download](https://developer.apple.com/download/).
2. **Разработка без локального Xcode 15.2:**
   - Запускать приложение через **Expo Go** на телефоне: `bun run start` → отсканировать QR-код.
   - Сборки для iOS делать в облаке: **EAS Build** ([expo.dev](https://expo.dev)) — не требует Xcode на вашем Mac.
   - На Monterey можно поставить **Xcode 14.2** (последняя версия для 12.x) с [developer.apple.com/download](https://developer.apple.com/download/), но текущая версия Expo/проекта может требовать Xcode 15.2 и выдавать ошибку при `bun run ios` — тогда локально остаётся вариант с Expo Go или EAS Build.

---

## Итог

| Ваш macOS | Xcode 15.2 поставится? |
|-----------|-------------------------|
| Ventura 13.5+ (13.5, 13.6, 14, 15…) | Да — скачать .xip с developer.apple.com, распаковать, перенести в /Applications. |
| Monterey 12.x или старше | Нет — обновить macOS (если Mac поддерживает) или использовать Expo Go / EAS Build. |

Скачивать Xcode лучше с [developer.apple.com/download](https://developer.apple.com/download/) (раздел Downloads). Платный аккаунт разработчика для скачивания Xcode не нужен — достаточно бесплатного Apple ID.
