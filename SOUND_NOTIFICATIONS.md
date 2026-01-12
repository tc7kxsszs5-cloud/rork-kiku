# Звуковые уведомления в KIKU

## Обзор

Проект KIKU использует систему звуковых уведомлений для различных типов событий. Звуки настраиваются в зависимости от уровня риска и типа уведомления.

## Архитектура

### Утилита `utils/soundNotifications.ts`

Основная утилита для управления звуковыми уведомлениями содержит:

- **`getSoundForRiskLevel(riskLevel: RiskLevel)`** - Возвращает звук для уровня риска
  - `critical` → `true` (громкий системный звук)
  - `high` → `true` (громкий системный звук)
  - `medium` → `'default'` (стандартный звук)
  - `low` → `'default'` (стандартный звук)
  - `safe` → `false` (без звука)

- **`getSoundForSOS()`** - Возвращает звук для SOS сигналов (`true`)

- **`getAndroidPriorityForRiskLevel(riskLevel: RiskLevel)`** - Возвращает приоритет Android уведомления

- **`setupNotificationChannels()`** - Настраивает каналы уведомлений для Android:
  - `default` - Стандартные уведомления
  - `critical` - Критические алерты (MAX importance, bypass DnD)
  - `high` - Высокий риск (HIGH importance)
  - `sos` - SOS сигналы (MAX importance, bypass DnD)

- **`getChannelIdForRiskLevel(riskLevel: RiskLevel)`** - Возвращает ID канала для уровня риска

## Использование

### В MonitoringContext

Уведомления о рисках автоматически используют звуки в зависимости от уровня риска:

```typescript
import { getSoundForRiskLevel, getChannelIdForRiskLevel, getAndroidPriorityForRiskLevel } from '@/utils/soundNotifications';

const sound = getSoundForRiskLevel(analysis.riskLevel);
const channelId = getChannelIdForRiskLevel(analysis.riskLevel);
const priority = getAndroidPriorityForRiskLevel(analysis.riskLevel);

await Notifications.scheduleNotificationAsync({
  content: {
    title,
    body,
    sound,
    ...(Platform.OS === 'android' && channelId ? { channelId } : {}),
    priority,
  },
  trigger: null,
});
```

### Каналы уведомлений (Android)

Каналы настраиваются автоматически при:
1. Инициализации `MonitoringProvider`
2. Регистрации устройства в `NotificationsContext`

Каждый канал имеет свои настройки:
- **Важность (importance)** - определяет приоритет отображения
- **Звук (sound)** - системный звук или кастомный
- **Вибропаттерн (vibrationPattern)** - паттерн вибрации
- **Обход DnD (bypassDnd)** - для критических и SOS уведомлений

## Добавление кастомных звуков

### Подготовка файлов

1. **iOS**: Формат `.caf`, `.aiff`, или `.wav`
2. **Android**: Формат `.mp3`, `.wav`, или `.ogg`

Рекомендуемые параметры:
- Формат: WAV или MP3
- Битрейт: 128-192 kbps
- Длительность: 1-3 секунды
- Частота дискретизации: 44.1 kHz

### Размещение файлов

Создайте папку `local/assets/` и разместите звуковые файлы:

```
local/
  assets/
    notification_sound.wav      # Стандартный звук
    critical_alert.wav          # Критический алерт
    sos_alert.wav               # SOS сигнал
    high_risk.wav               # Высокий риск
```

### Настройка в app.json

Обновите конфигурацию `expo-notifications` в `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./local/assets/notification_icon.png",
          "color": "#ffffff",
          "defaultChannel": "default",
          "sounds": [
            "./local/assets/notification_sound.wav",
            "./local/assets/critical_alert.wav",
            "./local/assets/sos_alert.wav",
            "./local/assets/high_risk.wav"
          ],
          "enableBackgroundRemoteNotifications": false
        }
      ]
    ]
  }
}
```

### Обновление утилиты

После добавления файлов обновите `utils/soundNotifications.ts`:

```typescript
export const getSoundForRiskLevel = (riskLevel: RiskLevel): NotificationSoundType => {
  switch (riskLevel) {
    case 'critical':
      return 'critical_alert'; // Имя файла без расширения
    case 'high':
      return 'high_risk';
    // ...
  }
};
```

### Обновление каналов Android

В функции `setupNotificationChannels()` обновите настройки звуков:

```typescript
await Notifications.setNotificationChannelAsync('critical', {
  // ...
  sound: 'critical_alert', // Имя файла без расширения
  // ...
});
```

## Текущая реализация

### Системные звуки

Сейчас используются системные звуки:
- `true` - включить системный звук (для критических/высоких рисков)
- `'default'` - стандартный системный звук (для средних/низких рисков)
- `false` - без звука (для безопасных сообщений)

### Каналы Android

Все каналы используют системный звук `'default'`, но имеют разные настройки важности и вибрации:
- Критические алерты и SOS: MAX importance, обход DnD
- Высокий риск: HIGH importance
- Стандартные: HIGH importance

## Тестирование

Для тестирования звуковых уведомлений:

1. **iOS Simulator**: Симулятор не воспроизводит звуки уведомлений, используйте реальное устройство
2. **Android Emulator**: Эмулятор поддерживает звуки уведомлений
3. **Реальные устройства**: Рекомендуется тестировать на реальных устройствах

Убедитесь, что:
- Разрешения на уведомления выданы
- Звук устройства не выключен
- Режим "Не беспокоить" не блокирует уведомления (для критических/SOS)

## Будущие улучшения

- [ ] Добавить кастомные звуковые файлы
- [ ] Настройки звука в ParentalControls (вкл/выкл, выбор звука)
- [ ] Разные звуки для разных типов событий (новое сообщение, алерт, SOS)
- [ ] Настройка громкости для разных типов уведомлений
- [ ] Поддержка плейлистов звуков для ротации
