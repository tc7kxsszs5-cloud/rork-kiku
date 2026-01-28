# 🎨 Дизайн-система KIKU

## 📐 Типографика

### Принципы

1. **Display Font** - отличительный, характерный шрифт для заголовков
2. **Body Font** - изысканный, читаемый шрифт для основного текста
3. **Резкие контрасты** - крупные заголовки с мелким body текстом
4. **Правильный letter-spacing** - для улучшенной читаемости

### Использование

```tsx
import { DisplayLarge, HeadlineMedium, BodyMedium, AccentText } from '@/components/Typography';

// Крупный заголовок (Display)
<DisplayLarge>Главный заголовок</DisplayLarge>

// Подзаголовок (Headline)
<HeadlineMedium>Важная секция</HeadlineMedium>

// Основной текст (Body)
<BodyMedium>Это основной текст приложения с изысканным шрифтом.</BodyMedium>

// Акцентный текст
<AccentText>Важное сообщение</AccentText>
```

### Варианты типографики

#### Display (для заголовков)
- `DisplayLarge` - 57px, bold, для hero секций
- `DisplayMedium` - 45px, bold, для главных заголовков
- `DisplaySmall` - 36px, bold, для крупных заголовков

#### Headline (для подзаголовков)
- `HeadlineLarge` - 32px, semibold
- `HeadlineMedium` - 28px, semibold
- `HeadlineSmall` - 24px, semibold

#### Title (для секций)
- `TitleLarge` - 22px, semibold
- `TitleMedium` - 16px, semibold
- `TitleSmall` - 14px, semibold

#### Body (для основного текста)
- `BodyLarge` - 16px, regular, letter-spacing 0.5
- `BodyMedium` - 14px, regular, letter-spacing 0.25
- `BodySmall` - 12px, regular, letter-spacing 0.4

#### Label (для меток и кнопок)
- `LabelLarge` - 14px, medium
- `LabelMedium` - 12px, medium
- `LabelSmall` - 11px, medium

#### Special
- `AccentText` - 18px, bold, с акцентным цветом
- `Caption` - 12px, regular, для подписей
- `Overline` - 10px, medium, uppercase, letter-spacing 1.5

---

## 🎨 Цветовая система

### Принципы

1. **Доминирующие цвета** - один основной цвет доминирует в интерфейсе
2. **Резкие акценты** - яркие, контрастные акценты для важных элементов
3. **Связная эстетика** - все цвета работают вместе через систему токенов
4. **Высокий контраст** - для доступности и читаемости

### Цветовые токены

```tsx
import { ColorTokens, getColor } from '@/constants/ColorSystem';

// Использование токенов
const primaryColor = getColor('primary', 500); // #FACC15
const accentColor = getColor('accent', 500); // #EF4444
```

### Семантические цвета

```tsx
import { useThemeMode } from '@/constants/ThemeContext';

const { theme } = useThemeMode();

// Backgrounds
theme.background.primary
theme.background.secondary
theme.background.elevated

// Surfaces
theme.surface.primary
theme.surface.secondary
theme.surface.muted

// Text
theme.text.primary      // Резкий контраст
theme.text.secondary
theme.text.accent       // Резкий акцент

// Interactive
theme.interactive.primary    // Доминирующий цвет
theme.interactive.secondary // Резкий акцент
theme.interactive.accent    // Яркий акцент

// Status
theme.status.success
theme.status.warning
theme.status.error
```

### Темы

#### Sunrise (Light)
- **Доминирующий:** Теплый желтый (#FFF9E6 фон, #FACC15 акцент)
- **Резкие акценты:** Фиолетовый (#8B5CF6), Красный (#EF4444)
- **Контраст:** Темный текст (#171717) на светлом фоне

#### Midnight (Dark)
- **Доминирующий:** Темный (#0A0A0A фон)
- **Резкие акценты:** Неоновый желтый (#FACC15), Фиолетовый (#8B5CF6)
- **Контраст:** Светлый текст (#FAFAFA) на темном фоне

---

## 🎯 Примеры использования

### Карточка с улучшенной типографикой

```tsx
import { View, StyleSheet } from 'react-native';
import { DisplaySmall, BodyMedium, AccentText } from '@/components/Typography';
import { useThemeMode } from '@/constants/ThemeContext';

export function Card({ title, description, accent }) {
  const { theme } = useThemeMode();
  
  return (
    <View style={[styles.card, { backgroundColor: theme.surface.primary }]}>
      <DisplaySmall style={{ color: theme.text.primary }}>
        {title}
      </DisplaySmall>
      <BodyMedium style={{ color: theme.text.secondary, marginTop: 8 }}>
        {description}
      </BodyMedium>
      {accent && (
        <AccentText style={{ marginTop: 12 }}>
          {accent}
        </AccentText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
});
```

### Кнопка с резким акцентом

```tsx
import { TouchableOpacity, StyleSheet } from 'react-native';
import { LabelLarge } from '@/components/Typography';
import { useThemeMode } from '@/constants/ThemeContext';

export function AccentButton({ title, onPress }) {
  const { theme } = useThemeMode();
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: theme.interactive.accent, // Резкий акцент
          borderColor: theme.border.accent,
        }
      ]}
      onPress={onPress}
    >
      <LabelLarge style={{ color: theme.text.inverse }}>
        {title}
      </LabelLarge>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
});
```

---

## 📱 Адаптивность

### Размеры шрифтов адаптируются под платформу

- **iOS:** Использует SF Pro Display/Text
- **Android:** Использует Roboto
- **Web:** Использует системные шрифты

### В production можно добавить кастомные шрифты:

1. **Display Font:** Playfair Display, Bebas Neue, Montserrat Bold
2. **Body Font:** Lora, Merriweather, Source Sans Pro

Для добавления кастомных шрифтов:
1. Добавить файлы шрифтов в `assets/fonts/`
2. Обновить `Typography.tsx` с именами шрифтов
3. Загрузить через `expo-font`

---

## ✅ Чеклист использования

- [ ] Используйте Display для заголовков (не обычный Text)
- [ ] Используйте Body для основного текста
- [ ] Применяйте резкие акценты для важных элементов
- [ ] Используйте семантические цвета из theme
- [ ] Проверяйте контраст для доступности
- [ ] Тестируйте на обеих темах (sunrise/midnight)

---

**Последнее обновление:** 2025-01-06  
**Версия:** 1.0


