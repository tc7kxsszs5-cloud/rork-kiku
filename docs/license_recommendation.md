# Рекомендация лицензии MIT для kiku

## Обзор

Для проекта **kiku** рекомендуется использовать **MIT License** — одну из самых популярных и permissive open-source лицензий.

⚠️ **ВАЖНО:** Это **рекомендация**, а не финальное решение. Выбор лицензии должен быть одобрен founders и legal counsel.

---

## Почему MIT License?

### Преимущества

**1. Простота и понятность**
- Короткая (всего несколько параграфов)
- Легко понять даже без legal background
- Нет сложных условий или ограничений

**2. Permissive (разрешительная)**
- Позволяет использовать, копировать, модифицировать, распространять
- Можно использовать в коммерческих проектах
- Минимальные ограничения для пользователей

**3. Широкое принятие**
- Используется крупными проектами: React, Node.js, jQuery, Bootstrap
- Хорошая репутация в tech community
- Инвесторы и enterprise клиенты знакомы с ней

**4. Совместимость**
- Совместима с большинством других лицензий (GPL, Apache, BSD)
- Можно комбинировать MIT-licensed код с другими лицензиями

**5. Не создаёт проблем для fundraising**
- Investors предпочитают permissive licenses (MIT, Apache) над copyleft (GPL)
- Не ограничивает коммерциализацию

### Недостатки (которые нужно учитывать)

**1. Нет защиты от patent claims**
- MIT не включает patent grant (в отличие от Apache 2.0)
- Если patent protection критичен → рассмотреть Apache 2.0

**2. Нет copyleft**
- Кто угодно может взять код, модифицировать, и не делиться изменениями
- Если хотите, чтобы изменения оставались open-source → рассмотреть GPL

**3. Нет warranty disclaimer для некоторых юрисдикций**
- В некоторых странах disclaimer "as is" может быть недействительным

---

## Альтернативы (для сравнения)

### Apache License 2.0
- **Плюсы:** Patent protection, более детальная
- **Минусы:** Длиннее, сложнее
- **Когда использовать:** Если patent protection важен

### GNU GPL v3
- **Плюсы:** Copyleft (изменения должны быть open-source)
- **Минусы:** Ограничивает коммерческое использование, может отпугнуть enterprise клиентов
- **Когда использовать:** Если хотите, чтобы ecosystem оставался полностью open-source

### BSD License (2-Clause или 3-Clause)
- **Плюсы:** Почти идентична MIT, немного другая формулировка
- **Минусы:** Менее популярна чем MIT
- **Когда использовать:** Если есть specific reasons предпочесть BSD

### Proprietary (Closed-Source)
- **Плюсы:** Полный контроль, защита IP
- **Минусы:** Нет community contributions, меньше trust
- **Когда использовать:** Если основная ценность — в IP и вы не хотите делиться кодом

---

## Рекомендация для kiku: MIT License

**Reasoning:**
1. **kiku — B2C product** (не инфраструктурный open-source проект)
   - Основная ценность — в product, UX, ML models, а не в самом коде
   - Open-sourcing части кода может повысить trust (особенно для child safety app)

2. **Transparency и trust**
   - Родители хотят знать, как работает приложение (особенно с детскими данными)
   - Open-source повышает доверие
   - Можно open-source только части (например, mobile app), а backend держать proprietary

3. **Community contributions**
   - MIT позволяет community contribute (bug fixes, features)
   - Но не обязывает делиться изменениями (гибкость)

4. **Investor-friendly**
   - MIT не создаёт проблем для fundraising или acquisition

5. **Ecosystem**
   - React Native, Expo, Node.js — все MIT-licensed
   - Consistency с tech stack

---

## Что open-source, а что proprietary?

**Рекомендованный подход (Hybrid):**

### Open-Source (MIT License):
- **Mobile app** (iOS/Android React Native code)
  - UI components, navigation, local storage logic
  - Без API keys или secrets (они в environment variables)
  - **Benefit:** Community trust, potential contributions (UI improvements, bug fixes)

- **Documentation** (этот docs/ folder)
  - Architecture, security design (generic parts, не specific secrets)
  - **Benefit:** Transparency, educational value

### Proprietary (Closed-Source):
- **Backend API** (Node.js + tRPC)
  - Business logic, database schemas, API contracts
  - **Reasoning:** Core IP, competitive advantage

- **ML Models** (training data, fine-tuned models)
  - Algorithms, training pipelines
  - **Reasoning:** Significant investment, competitive moat

- **Moderation Tools** (internal tools для модераторов)
  - **Reasoning:** Security, abuse prevention

**Итого:** Mobile app — open-source (MIT), Backend/ML — proprietary

---

## Как применить MIT License

### 1. Создать файл LICENSE

**Файл:** `LICENSE` (в корне репозитория)

```
MIT License

Copyright (c) 2026 [НАЗВАНИЕ_КОМПАНИИ или ИМЯ_ВЛАДЕЛЬЦА]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**⚠️ Заменить:**
- `2026` — текущий год
- `[НАЗВАНИЕ_КОМПАНИИ или ИМЯ_ВЛАДЕЛЬЦА]` — юридическое лицо или имя владельца (например, "kiku Inc." или "Иван Иванов")

### 2. Добавить в README.md

**В конце README.md:**

```markdown
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

### 3. Header в исходных файлах (опционально, но рекомендовано)

**В начале каждого `.ts`, `.tsx` файла:**

```typescript
// Copyright (c) 2026 [НАЗВАНИЕ_КОМПАНИИ]
// Licensed under the MIT License
```

Или более подробный:

```typescript
/**
 * kiku - AI-Powered Child Safety Platform
 * Copyright (c) 2026 [НАЗВАНИЕ_КОМПАНИИ]
 * 
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 */
```

### 4. package.json

**Добавить поле `license`:**

```json
{
  "name": "kiku",
  "version": "1.0.0",
  "license": "MIT",
  ...
}
```

---

## Considerations (что обсудить с legal counsel)

**1. Ownership**
- Кто владелец copyright? (Company или founders)
- Все contributors подписали IP assignment agreements?

**2. Third-Party Code**
- Все dependencies совместимы с MIT? (check npm licenses)
- Нет GPL-licensed code, который может contaminate?

**3. Patent Protection**
- Нужна ли patent protection? (если да → рассмотреть Apache 2.0)

**4. Future Plans**
- Если планируем acquisition → MIT не создаёт проблем
- Если планируем enterprise B2B → MIT + commercial licensing (dual licensing)

**5. Open-Source Strategy**
- Только mobile app или больше?
- Timing: open-source сейчас или после product-market fit?

---

## Dual Licensing (Advanced Strategy)

**Опция для будущего:**

**MIT License** для community (free use)  
**+**  
**Commercial License** для enterprise clients (paid, с support и warranties)

**Example:**
- Small schools/parents: используют MIT-licensed version (бесплатно)
- Large school districts/governments: покупают commercial license с:
  - Dedicated support
  - SLA guarantees
  - Custom features
  - Warranty и indemnification

**Precedent:** MySQL, Qt, MongoDB (используют dual licensing)

---

## Action Items

- [ ] **Обсудить с founders:** Согласие на MIT License
- [ ] **Legal review:** Консультация с lawyer (особенно для child safety app)
- [ ] **Определить scope:** Что open-source, что proprietary
- [ ] **Создать LICENSE file** в репозитории
- [ ] **Обновить README.md** с упоминанием лицензии
- [ ] **Проверить dependencies** на совместимость лицензий
- [ ] **IP assignment agreements** от всех contributors

---

## Полезные ресурсы

**Сравнение лицензий:**
- https://choosealicense.com/ (GitHub guide)
- https://opensource.org/licenses (Open Source Initiative)
- https://tldrlegal.com/ (plain English summaries)

**Legal Advice:**
- Консультация с tech lawyer (рекомендовано)
- FOSS Legal консультанты (например, Software Freedom Law Center)

---

**Дата создания:** 2026-01-02  
**Версия:** 1.0 (рекомендация)  
**Автор:** kiku Leadership Team  
**Статус:** Recommendation — требуется legal review и approval
