# 🎨 Руководство по визуальным эффектам KIKU

## 🌊 Эффекты глубины и атмосферы

### Градиентные сетки

Создают многослойную глубину вместо плоских однотонных цветов:

```tsx
import { GradientMesh } from '@/components/VisualEffects';

<GradientMesh intensity="medium">
  <YourContent />
</GradientMesh>
```

**Варианты интенсивности:**
- `subtle` - тонкий эффект (opacity 0.1)
- `medium` - средний эффект (opacity 0.2)
- `strong` - сильный эффект (opacity 0.4)

### Шумовые текстуры

Добавляют органичность и предотвращают "пластиковый" вид:

```tsx
import { NoiseTexture } from '@/components/VisualEffects';

<NoiseTexture intensity={0.3} opacity={0.15} />
```

### Геометрические паттерны

Создают структуру и визуальный интерес:

```tsx
import { GeometricPattern } from '@/components/VisualEffects';

<GeometricPattern pattern="dots" opacity={0.1} />
```

**Варианты паттернов:**
- `dots` - точки
- `lines` - линии
- `grid` - сетка
- `hexagons` - шестиугольники

### Многослойные прозрачные элементы

Создают ощущение глубины через наложение слоев:

```tsx
import { LayeredGlass } from '@/components/VisualEffects';

<LayeredGlass layers={3}>
  <YourContent />
</LayeredGlass>
```

### Драматические тени

Добавляют объем и иерархию:

```tsx
import { DramaticShadow } from '@/components/VisualEffects';

<DramaticShadow intensity="dramatic">
  <YourCard />
</DramaticShadow>
```

**Варианты интенсивности:**
- `soft` - мягкая тень
- `medium` - средняя тень
- `dramatic` - драматическая тень

### Декоративные границы

Уникальные границы вместо стандартных:

```tsx
import { DecorativeBorder } from '@/components/VisualEffects';

<DecorativeBorder variant="gradient" width={2}>
  <YourContent />
</DecorativeBorder>
```

**Варианты:**
- `solid` - сплошная
- `dashed` - пунктирная
- `gradient` - градиентная
- `ornamental` - орнаментальная

### Наложения зерна

Добавляют текстуру и предотвращают "чистый" цифровой вид:

```tsx
import { GrainOverlay } from '@/components/VisualEffects';

<GrainOverlay intensity={0.2} />
```

---

## 🎯 Комплексные компоненты

### BackgroundWithDepth

Фон с полным набором эффектов:

```tsx
import { BackgroundWithDepth } from '@/components/BackgroundEffects';

<BackgroundWithDepth variant="warm">
  <YourContent />
</BackgroundWithDepth>
```

**Варианты:**
- `default` - стандартный
- `warm` - теплый
- `cool` - прохладный
- `dramatic` - драматический

### CardWithDepth

Карточка с эффектами глубины:

```tsx
import { CardWithDepth } from '@/components/BackgroundEffects';

<CardWithDepth elevation="high">
  <YourContent />
</CardWithDepth>
```

**Уровни elevation:**
- `low` - низкий
- `medium` - средний
- `high` - высокий

### OrnamentalContainer

Контейнер с орнаментальной границей:

```tsx
import { OrnamentalContainer } from '@/components/BackgroundEffects';

<OrnamentalContainer>
  <YourContent />
</OrnamentalContainer>
```

### DepthContainer

Универсальный контейнер со всеми эффектами:

```tsx
import { DepthContainer } from '@/components/DepthContainer';

<DepthContainer
  variant="card"
  elevation="medium"
  withGradient={true}
  withNoise={true}
  withPattern={true}
  withGrain={true}
>
  <YourContent />
</DepthContainer>
```

---

## 🖱️ Пользовательские курсоры (Web)

Уникальные курсоры для web версии:

```tsx
import { applyCursorStyle } from '@/utils/cursorStyles';

// Применить к элементу
applyCursorStyle(element, 'pointer');

// Или глобально (уже применено в _layout.tsx)
applyGlobalCursorStyles();
```

**Типы курсоров:**
- `default` - основной курсор
- `pointer` - для интерактивных элементов
- `text` - для текста
- `wait` - для загрузки
- `notAllowed` - для запрещенных действий
- `grab` - для перетаскивания

---

## 📐 Примеры использования

### Hero секция с эффектами

```tsx
import { BackgroundWithDepth, DepthContainer } from '@/components/BackgroundEffects';
import { DisplayHero } from '@/components/Typography';

<BackgroundWithDepth variant="warm">
  <DepthContainer variant="card" elevation="high">
    <DisplayHero>Защита вашего ребенка</DisplayHero>
  </DepthContainer>
</BackgroundWithDepth>
```

### Карточка с полными эффектами

```tsx
import { CardWithDepth, OrnamentalContainer } from '@/components/BackgroundEffects';
import { DramaticShadow } from '@/components/VisualEffects';

<DramaticShadow intensity="dramatic">
  <OrnamentalContainer>
    <CardWithDepth elevation="high">
      <YourContent />
    </CardWithDepth>
  </OrnamentalContainer>
</DramaticShadow>
```

### Текстовая секция с глубиной

```tsx
import { GradientMesh, NoiseTexture } from '@/components/VisualEffects';
import { BodyRegular } from '@/components/Typography';

<GradientMesh intensity="subtle">
  <NoiseTexture opacity={0.1} />
  <BodyRegular>Текст с эффектами глубины</BodyRegular>
</GradientMesh>
```

---

## ✅ Принципы использования

1. **Не перегружайте** - используйте эффекты умеренно
2. **Контекст важен** - эффекты должны соответствовать контенту
3. **Производительность** - некоторые эффекты могут влиять на производительность
4. **Доступность** - убедитесь, что эффекты не мешают читаемости
5. **Тестирование** - проверяйте на разных устройствах

---

## 🎨 Комбинации эффектов

### Тонкая глубина
```tsx
<GradientMesh intensity="subtle">
  <NoiseTexture opacity={0.05} />
  <Content />
</GradientMesh>
```

### Средняя глубина
```tsx
<CardWithDepth elevation="medium">
  <GrainOverlay intensity={0.1} />
  <Content />
</CardWithDepth>
```

### Драматическая глубина
```tsx
<DramaticShadow intensity="dramatic">
  <OrnamentalContainer>
    <LayeredGlass layers={3}>
      <GradientMesh intensity="strong">
        <Content />
      </GradientMesh>
    </LayeredGlass>
  </OrnamentalContainer>
</DramaticShadow>
```

---

**Последнее обновление:** 2025-01-06  
**Версия:** 1.0


