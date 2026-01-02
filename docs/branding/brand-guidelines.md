# Brand Guidelines — Rork-Kiku

## Обзор

Данный документ описывает брендинг и визуальную идентичность Rork-Kiku.

**Статус:** PLACEHOLDER — требуется профессиональный дизайн

---

## Logo

### Logo Files

**Размещение:** `docs/branding/logo_placeholders/`

**Файлы:**
- `logo.svg` — векторный logo (основной)
- `logo_color.png` — PNG с цветом (1024x1024px)
- `logo_white.png` — PNG белый вариант (для тёмных фонов)

**TODO:** Заменить placeholder файлы на реальный профессиональный logo.

### Logo Usage

**Primary Logo:**
- Используйте цветной SVG logo на светлых фонах
- Минимальный размер: 32x32px (для иконок), 120px ширина (для headers)

**White Logo:**
- Используйте белый logo на тёмных фонах
- Цвет фона: #333333 или темнее

**Minimum Clear Space:**
- Оставляйте пространство вокруг logo = 0.25x высоты logo
- Не помещайте текст или другие элементы в это пространство

**Don'ts:**
- ❌ Не изменяйте пропорции (не stretch)
- ❌ Не поворачивайте logo
- ❌ Не меняйте цвета (используйте предоставленные варианты)
- ❌ Не добавляйте тени, градиенты, эффекты

---

## Color Palette

### Primary Colors

**Brand Blue:** `#4A90E2`
- RGB: (74, 144, 226)
- CMYK: (67, 36, 0, 11)
- Использование: primary buttons, links, headers
- Значение: Trust, safety, technology

**Brand Green:** `#50C878`
- RGB: (80, 200, 120)
- CMYK: (60, 0, 40, 22)
- Использование: success states, positive actions, checkmarks
- Значение: Safety, growth, positivity

### Secondary Colors

**Accent Orange:** `#FFB347`
- RGB: (255, 179, 71)
- CMYK: (0, 30, 72, 0)
- Использование: playful elements (для детского интерфейса), highlights
- Значение: Playfulness, energy, warmth

### Neutral Colors

**Dark Gray:** `#333333`
- Использование: body text, dark backgrounds

**Medium Gray:** `#666666`
- Использование: secondary text, icons

**Light Gray:** `#F5F5F5`
- Использование: backgrounds, cards

**White:** `#FFFFFF`
- Использование: backgrounds, text on dark

### Semantic Colors

**Error Red:** `#E74C3C`
- Использование: errors, destructive actions, warnings

**Warning Yellow:** `#F39C12`
- Использование: warnings, pending states

**Info Blue:** `#3498DB`
- Использование: informational messages

---

## Typography

### Font Families

**Primary Font (Web & Print):**
- **Sans-serif:** Inter, SF Pro (iOS), Roboto (Android)
- Fallback: Helvetica Neue, Arial, sans-serif

**Secondary Font (для детского интерфейса):**
- **Rounded/Friendly:** Nunito, Quicksand
- Более игривый, дружелюбный для детей

### Font Sizes (Web/Mobile)

**Headers:**
- H1: 32px / 2rem (bold)
- H2: 24px / 1.5rem (bold)
- H3: 20px / 1.25rem (semi-bold)
- H4: 18px / 1.125rem (semi-bold)

**Body:**
- Body Large: 18px / 1.125rem (regular)
- Body: 16px / 1rem (regular)
- Body Small: 14px / 0.875rem (regular)

**Labels/Captions:**
- Label: 12px / 0.75rem (medium)
- Caption: 10px / 0.625rem (regular)

**Детский интерфейс:**
- Увеличить на 2-4px для лучшей читаемости

### Line Height

- Headers: 1.2x font size
- Body text: 1.5x font size
- Captions: 1.3x font size

### Font Weights

- Regular: 400
- Medium: 500
- Semi-Bold: 600
- Bold: 700

---

## Iconography

### Icon Style

**Style:** Outline (не filled) для консистентности
**Stroke Width:** 2px
**Corner Radius:** 2px (слегка rounded)
**Size:** 24x24px (default), 16x16px (small), 48x48px (large)

### Icon Library

**Рекомендуется:** 
- Material Icons (Google)
- SF Symbols (iOS native)
- Feather Icons (web)
- Heroicons

**Цвета иконок:**
- Default: Medium Gray (#666666)
- Active/Selected: Brand Blue (#4A90E2)
- Disabled: Light Gray (#CCCCCC)

---

## Imagery

### Photography Style

**Tone:**
- Warm, natural lighting
- Authentic (не overly staged)
- Focus on families, children (с parental consent для использования)

**Content:**
- Показывает безопасную, позитивную семейную коммуникацию
- Diverse families (разные этничности, structures)
- Children должны выглядеть счастливыми, но не overly posed

**Avoid:**
- Stock photos, которые выглядят fake
- Дети в distress или unsafe situations
- Overly commercial look

### Illustrations

**Style:**
- Simple, flat illustrations
- Friendly, playful (но не childish)
- Используйте brand colors

**Use Cases:**
- Onboarding screens
- Empty states
- Error states
- Educational content

---

## UI Components

### Buttons

**Primary Button:**
- Background: Brand Blue (#4A90E2)
- Text: White (#FFFFFF)
- Border Radius: 8px
- Padding: 12px 24px
- Font: 16px, semi-bold

**Secondary Button:**
- Background: Transparent
- Text: Brand Blue (#4A90E2)
- Border: 2px solid Brand Blue
- Border Radius: 8px
- Padding: 10px 22px (slightly smaller из-за border)

**Destructive Button:**
- Background: Error Red (#E74C3C)
- Text: White (#FFFFFF)
- Same size/radius as primary

### Cards

**Default Card:**
- Background: White (#FFFFFF)
- Border: 1px solid #E0E0E0
- Border Radius: 12px
- Padding: 16px
- Shadow: 0 2px 8px rgba(0,0,0,0.1)

### Inputs

**Text Input:**
- Background: White (#FFFFFF)
- Border: 1px solid #CCCCCC
- Border Radius: 8px
- Padding: 12px 16px
- Font: 16px, regular
- Focus: Border color → Brand Blue, 2px

**Select/Dropdown:**
- Same as text input
- Chevron icon: Medium Gray

---

## Layout & Spacing

### Spacing Scale (8px base)

- **4px** (0.25rem) — xs
- **8px** (0.5rem) — sm
- **16px** (1rem) — md (default)
- **24px** (1.5rem) — lg
- **32px** (2rem) — xl
- **48px** (3rem) — 2xl
- **64px** (4rem) — 3xl

### Grid System

**Mobile (< 768px):**
- 1 column
- Margins: 16px

**Tablet (768px - 1024px):**
- 2 columns
- Margins: 24px
- Gutter: 16px

**Desktop (> 1024px):**
- 12 column grid
- Max width: 1200px
- Margins: 32px
- Gutter: 24px

---

## Voice & Tone

### Brand Voice

**Attributes:**
- **Trustworthy:** Мы защищаем детей — это serious responsibility
- **Caring:** Мы понимаем родительские concerns
- **Simple:** Мы объясняем сложное просто
- **Transparent:** Мы честны о том, как работаем

### Tone by Context

**Parent-facing (web, emails):**
- Professional, но warm
- Clear и straightforward
- Reassuring

**Child-facing (app):**
- Friendly, encouraging
- Simple language (4th grade reading level)
- Positive reinforcement

**Error messages:**
- Apologetic, helpful
- Suggest solutions
- Avoid blame

### Example Copy

**Good:**
> "Мы проверяем каждое фото перед отправкой, чтобы ваш ребёнок был в безопасности."

**Bad:**
> "Наша AI платформа использует cutting-edge алгоритмы машинного обучения для идентификации потенциально неподходящего контента."
(Слишком technical, не понятно родителям)

---

## Application Guidelines

### iOS App

**Visual Style:**
- Follow iOS Human Interface Guidelines
- Use SF Symbols где возможно
- Native iOS components (UIKit, SwiftUI)
- Dark mode support

**Specific:**
- Tab bar: 5 tabs max
- Navigation: standard iOS navigation bar
- Модальные окна: use sheets (не full-screen modals для simple actions)

### Android App

**Visual Style:**
- Follow Material Design guidelines
- Use Material icons
- Native Android components
- Dark theme support

**Specific:**
- Bottom navigation: 3-5 items
- FAB (Floating Action Button): для primary action
- Snackbar: для notifications/undo actions

### Web App

**Visual Style:**
- Responsive design (mobile-first)
- Consistent с mobile app где возможно
- Accessibility (WCAG 2.1 Level AA)

**Specific:**
- Sticky header on desktop
- Hamburger menu на mobile
- Breadcrumbs на desktop для navigation

---

## Accessibility

### Color Contrast

**Minimum ratios (WCAG 2.1 Level AA):**
- Normal text: 4.5:1
- Large text (18px+): 3:1
- UI components: 3:1

**Check:**
- Brand Blue на white: ✅ 4.6:1 (pass)
- Medium Gray на white: ✅ 5.7:1 (pass)
- Light Gray на white: ❌ 1.2:1 (fail, только для decorative)

### Other Considerations

- ✅ Focus indicators на всех interactive elements
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility (semantic HTML, ARIA labels)
- ✅ Alternative text для всех images
- ✅ Captions для videos

---

## Asset Replacement Instructions

### When You're Ready to Replace Placeholders:

1. **Hire a Professional Designer:**
   - Logo design: $500-2,000
   - Full brand identity: $2,000-10,000
   - Agencies vs. freelancers (99designs, Dribbble, Behance)

2. **What You'll Need:**
   - Logo (SVG, PNG, variants)
   - Color palette (refined, accessible)
   - Typography (font licenses)
   - Icon set (custom или licensed)
   - Brand guidelines document (это!)

3. **Replace Files:**
   - Update `docs/branding/logo_placeholders/` с новыми logo files
   - Update color codes в этом документе
   - Update typography если нужно
   - Update screenshots в App Store/Google Play

4. **Consistency Check:**
   - Apply новый брендинг ко всем touchpoints:
     - Mobile apps (iOS, Android)
     - Website
     - Marketing materials
     - Email templates
     - Social media profiles
     - Pitch deck

---

## Contact

**Вопросы по брендингу:** [FOUNDERS_EMAIL]  
**Дизайн ассеты:** Request access to design files (Figma/Sketch)

---

**Последнее обновление:** 2026-01-02  
**Версия:** 1.0 (PLACEHOLDER)  
**Статус:** Требуется профессиональный дизайн
