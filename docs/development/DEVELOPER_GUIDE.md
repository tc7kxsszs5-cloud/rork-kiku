# 👨‍💻 Руководство для разработчиков KIKU

Подробное руководство по разработке в проекте KIKU.

## 📖 Содержание

1. [Архитектура проекта](#архитектура-проекта)
2. [Стиль кода](#стиль-кода)
3. [Работа с Git](#работа-с-git)
4. [Тестирование](#тестирование)
5. [Компоненты](#компоненты)
6. [Контексты и состояние](#контексты-и-состояние)
7. [API и tRPC](#api-и-trpc)
8. [Лучшие практики](#лучшие-практики)

## 🏗️ Архитектура проекта

### Структура папок

```
app/                    # Экранные компоненты (Expo Router)
  (tabs)/              # Табы навигации
  _layout.tsx          # Корневой layout
  index.tsx            # Главный экран
  chat/                # Экран чата
components/            # Переиспользуемые компоненты
constants/             # Константы, контексты, типы
  types.ts            # TypeScript типы
  locales/            # Переводы (i18n)
utils/                 # Утилиты
  migrations/         # Миграции данных
  versioning.ts       # Версионирование
hooks/                 # React хуки
__tests__/            # Тесты
  unit/               # Юнит тесты
  integration/        # Интеграционные тесты
```

### Технологический стек

- **Frontend**: React Native 0.81.5, Expo 54, TypeScript 5.9
- **Навигация**: Expo Router (file-based routing)
- **State Management**: React Context + React Query
- **Backend**: Hono + tRPC
- **Styling**: React Native StyleSheet
- **Testing**: Jest + React Native Testing Library

## 💻 Стиль кода

### TypeScript

```typescript
// ✅ Хорошо
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Плохо
function getUser(id: any): any {
  // ...
}
```

### Компоненты

```typescript
// ✅ Хорошо - функциональный компонент с типами
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  disabled = false 
}) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};
```

### Именование

- **Компоненты**: PascalCase (`UserProfile.tsx`)
- **Функции/переменные**: camelCase (`getUserData`)
- **Константы**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Типы/Интерфейсы**: PascalCase (`UserData`)

## 🔀 Работа с Git

### Ветвление

```bash
# Создание новой ветки для фичи
git checkout -b feature/add-user-profile

# Создание ветки для багфикса
git checkout -b fix/chat-message-error
```

### Коммиты

Используйте конвенциональные коммиты:

```bash
# Фича
git commit -m "feat: add user profile screen"

# Багфикс
git commit -m "fix: resolve chat message duplication"

# Документация
git commit -m "docs: update setup guide"

# Рефакторинг
git commit -m "refactor: simplify analytics context"
```

### Pull Request

1. Создайте ветку от `main`
2. Внесите изменения
3. Напишите тесты
4. Проверьте линтер (`bun run lint`)
5. Создайте PR с описанием изменений

## 🧪 Тестирование

### Структура тестов

```typescript
// __tests__/unit/components/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/Button';

describe('Button', () => {
  it('should render title', () => {
    const { getByText } = render(
      <Button title="Click me" onPress={() => {}} />
    );
    expect(getByText('Click me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Click" onPress={onPress} />
    );
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Запуск тестов

```bash
# Все тесты
bun run test

# Watch режим
bun run test:watch

# С покрытием
bun run test:coverage

# Только юнит тесты
bun run test:unit
```

## 🧩 Компоненты

### Создание компонента

1. Создайте файл в `components/`
2. Определите интерфейс пропсов
3. Реализуйте компонент
4. Добавьте стили
5. Напишите тесты

```typescript
// components/UserCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface UserCardProps {
  name: string;
  email: string;
}

export const UserCard: React.FC<UserCardProps> = ({ name, email }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
});
```

## 🔄 Контексты и состояние

### Использование Context

```typescript
// constants/UserContext.tsx
import createContextHook from '@nkzw/create-context-hook';

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = useCallback(async (email: string, password: string) => {
    // логика входа
  }, []);

  return {
    user,
    login,
    logout: () => setUser(null),
  };
});
```

### React Query

```typescript
import { useQuery } from '@tanstack/react-query';

function useUserData(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
}
```

## 🌐 API и tRPC

### Использование tRPC

```typescript
import { trpc } from '@/utils/trpc';

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading } = trpc.user.getById.useQuery({ id: userId });

  if (isLoading) return <Loading />;
  if (!data) return <Error />;

  return <View>{data.name}</View>;
}
```

## ✨ Лучшие практики

### 1. Всегда используйте TypeScript

```typescript
// ✅ Хорошо
const user: User = { id: '1', name: 'John' };

// ❌ Плохо
const user = { id: '1', name: 'John' };
```

### 2. Мемоизация дорогих вычислений

```typescript
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);
```

### 3. Используйте useCallback для функций

```typescript
const handlePress = useCallback(() => {
  doSomething();
}, [dependencies]);
```

### 4. Обработка ошибок

```typescript
try {
  await riskyOperation();
} catch (error) {
  console.error('[ComponentName] Error:', error);
  // Покажите пользователю понятное сообщение
}
```

### 5. Комментарии

```typescript
// ✅ Хорошо - объясняет "почему"
// Используем debounce для снижения нагрузки на API
const debouncedSearch = debounce(handleSearch, 300);

// ❌ Плохо - объясняет "что" (очевидно из кода)
// Вызываем функцию handleSearch
handleSearch();
```

## 📚 Дополнительные ресурсы

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [tRPC Docs](https://trpc.io/docs)

---

**Удачной разработки! 🚀**
