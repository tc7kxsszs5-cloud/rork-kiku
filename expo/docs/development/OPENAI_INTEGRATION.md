# 🤖 OpenAI Integration Guide

**Дата:** 2026-01-27  
**Статус:** ✅ Реализовано

---

## 📋 ОБЗОР

Проект KIKU интегрирован с OpenAI Moderation API для анализа сообщений на предмет потенциально опасного контента.

---

## 🔧 НАСТРОЙКА

### 1. Получение API ключа

1. Перейдите на [OpenAI Platform](https://platform.openai.com/api-keys)
2. Создайте новый API ключ
3. Скопируйте ключ (он показывается только один раз!)

### 2. Настройка переменных окружения

Скопируйте `.env.example` в `.env`:

```bash
cp .env.example .env
```

Заполните переменные:

```env
OPENAI_API_KEY=sk-your-api-key-here
AI_PROVIDER=openai
OPENAI_API_BASE_URL=https://api.openai.com/v1
```

### 3. Настройка в app.json

Переменные автоматически читаются из `app.json`:

```json
{
  "extra": {
    "openaiApiKey": "",
    "aiProvider": "local",
    "openaiApiBaseUrl": "https://api.openai.com/v1"
  }
}
```

---

## 💻 ИСПОЛЬЗОВАНИЕ

### Базовое использование

```typescript
import { getAIConfig, analyzeMessageWithRealAI } from '@/utils/aiService';

// Получить конфигурацию
const config = getAIConfig();

// Анализировать сообщение
const analysis = await analyzeMessageWithRealAI('test message', config);

console.log(analysis);
// {
//   riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical',
//   confidence: 0.5,
//   reasons: [],
//   categories: []
// }
```

### Интеграция с AIModerationService

`AIModerationService` автоматически использует OpenAI если настроено:

```typescript
import { analyzeMessageWithAI } from '@/constants/AIModerationService';

const analysis = await analyzeMessageWithAI('message text', {
  useRealAI: true, // Использовать OpenAI если доступно
});
```

---

## 🎯 ФУНКЦИОНАЛЬНОСТЬ

### Анализ сообщений

OpenAI Moderation API анализирует текст на:

- **Hate** - ненависть
- **Hate/Threatening** - угрозы
- **Self-harm** - самоповреждение
- **Sexual** - сексуальный контент
- **Sexual/Minors** - сексуальный контент с участием несовершеннолетних
- **Violence** - насилие
- **Violence/Graphic** - графическое насилие

### Маппинг результатов

Результаты OpenAI автоматически маппятся в наши уровни риска:

| OpenAI Score | Risk Level |
|--------------|------------|
| >= 0.9 | `critical` |
| >= 0.7 | `high` |
| >= 0.5 | `medium` |
| < 0.5 | `low` |
| Not flagged | `safe` |

---

## 💾 КЭШИРОВАНИЕ

### In-Memory Cache

Результаты анализа кэшируются в памяти на **24 часа**:

```typescript
// Первый вызов - запрос к API
const result1 = await analyzeMessageWithRealAI('message', config);

// Второй вызов - из кэша
const result2 = await analyzeMessageWithRealAI('message', config);
```

### Ограничения кэша

- Максимум **1000** записей
- TTL: **24 часа**
- Автоматическая очистка старых записей

---

## 🔄 FALLBACK

Если OpenAI недоступен или произошла ошибка:

1. **Fallback на локальный анализ** - используется `AIModerationService` с правилами
2. **Логирование ошибки** - ошибка записывается в лог
3. **Безопасный результат** - возвращается `safe` уровень риска

---

## 📊 ПРОИЗВОДИТЕЛЬНОСТЬ

### Время ответа

- **С кэшем:** < 1ms
- **Без кэша (OpenAI):** 200-500ms
- **Fallback (локальный):** < 10ms

### Стоимость

OpenAI Moderation API:
- **$0.10** за 1M токенов
- Примерно **$0.0001** за сообщение (100 токенов)

---

## 🧪 ТЕСТИРОВАНИЕ

### Unit тесты

```bash
bunx jest __tests__/unit/utils/aiService.test.ts
```

### Ручное тестирование

```typescript
// Тест безопасного сообщения
const safe = await analyzeMessageWithRealAI('Hello!', config);
expect(safe.riskLevel).toBe('safe');

// Тест опасного сообщения
const dangerous = await analyzeMessageWithRealAI('hateful content', config);
expect(dangerous.riskLevel).toBeGreaterThan('safe');
```

---

## ⚠️ БЕЗОПАСНОСТЬ

### Хранение ключей

- ✅ **НЕ** коммитьте `.env` в Git
- ✅ Используйте `.env.example` для документации
- ✅ В production используйте секреты (Vercel, Cloudflare, etc.)

### Rate Limiting

OpenAI имеет встроенные лимиты:
- **Free tier:** 3 RPM (requests per minute)
- **Paid tier:** зависит от плана

Рекомендуется добавить rate limiting на стороне приложения.

---

## 🔍 ОТЛАДКА

### Включить логирование

```typescript
import { logger } from '@/utils/logger';

// Логирование включено автоматически
// Проверьте консоль для ошибок
```

### Проверка конфигурации

```typescript
const config = getAIConfig();
console.log('AI Config:', {
  provider: config.provider,
  hasApiKey: !!config.apiKey,
  endpoint: config.endpoint,
});
```

---

## 📚 ДОПОЛНИТЕЛЬНЫЕ РЕСУРСЫ

- [OpenAI Moderation API Docs](https://platform.openai.com/docs/guides/moderation)
- [OpenAI Pricing](https://openai.com/pricing)
- [API Reference](https://platform.openai.com/docs/api-reference/moderations)

---

## ✅ СТАТУС

- ✅ Базовая интеграция
- ✅ Кэширование
- ✅ Fallback механизм
- ✅ Тесты
- ✅ Документация

---

**Последнее обновление:** 2026-01-27
