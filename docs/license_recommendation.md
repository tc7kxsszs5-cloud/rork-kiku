# Рекомендация по лицензии для Rork-Kiku

## Рекомендация: MIT License

### Почему MIT License?

**MIT License** — это permissive open-source license, который обеспечивает хороший баланс между открытостью и гибкостью.

---

## Преимущества MIT License

### 1. Простота и Понятность
- **Короткая:** всего несколько параграфов
- **Понятная:** легко читается и понимается без юриста
- **Widely recognized:** все знают, что это означает

### 2. Максимальная Свобода для Пользователей
- ✅ Использование в коммерческих проектах
- ✅ Модификация кода
- ✅ Распространение
- ✅ Private use
- ✅ Sublicensing

### 3. Минимальные Обязательства
- Единственное требование: сохранить copyright notice и license text в копиях
- Нет requirement публиковать изменения (в отличие от GPL)
- Нет copyleft provisions

### 4. Business-Friendly
- Компании охотно используют MIT-licensed код
- Не создаёт legal complications для commercial adoption
- Позволяет создавать proprietary derivatives (если нужно)

### 5. Community Adoption
- Популярна в JavaScript/Node.js ecosystem (React, Express, Vue)
- Большое количество contributors понимают и trust MIT
- Easy integration в другие проекты

---

## Для Rork-Kiku Конкретно

### Применимость

**Что лицензировать под MIT:**
- ✅ **Open-source компоненты:** если решите open-source части кода (например, SDK, libraries)
- ✅ **Documentation:** техническая документация (API docs, developer guides)
- ✅ **Sample code:** примеры интеграции

**Что НЕ лицензировать:**
- ❌ **Proprietary core application code:** основной код приложения (iOS, Android, backend) — keep private
- ❌ **ML models:** собственные trained models — proprietary
- ❌ **Business logic:** конфиденциальная бизнес-логика
- ❌ **Brand assets:** logo, trademark — separate licensing

### Рекомендуемая Стратегия

**Hybrid Approach:**

1. **Private Repositories (Default):**
   - Основной код (mobile apps, backend services) — **private**
   - Не нужна public license

2. **Public Repositories (Selective):**
   - **SDK/Client Libraries** (если создадите) — MIT License
   - **Developer Tools** (CLI tools, testing utilities) — MIT License
   - **Documentation** (technical docs) — MIT License или Creative Commons

3. **Documentation Repository:**
   - Эта `docs/` папка может быть open-sourced под MIT или CC BY 4.0

---

## Альтернативные Лицензии (для сравнения)

### GPL (General Public License)
**Pros:**
- Strong copyleft: все derivatives должны быть open-source
- Защищает от proprietary forks

**Cons:**
- ❌ Менее business-friendly
- ❌ Сложнее для commercial adoption
- ❌ Может отпугнуть contributors

**Рекомендация для Rork-Kiku:** ❌ Не подходит, т.к. мы хотим гибкость

### Apache 2.0
**Pros:**
- Permissive, как MIT
- Explicit patent grant
- Better defined terms

**Cons:**
- Более verbose (длиннее)
- Patent clause может быть сложной

**Рекомендация для Rork-Kiku:** ✅ Хорошая альтернатива MIT, если нужны patent protections

### BSD (3-Clause)
**Pros:**
- Очень похожа на MIT
- Adds non-endorsement clause

**Cons:**
- Немного менее popular чем MIT

**Рекомендация для Rork-Kiku:** ✅ Также подходит, почти идентична MIT

### Creative Commons (CC BY 4.0)
**Pros:**
- Отлично для documentation и content
- Widely recognized для non-code content

**Cons:**
- Не для software code

**Рекомендация для Rork-Kiku:** ✅ Используйте для docs, blog posts, educational content

---

## MIT License Text

**Если решите использовать MIT License, поместите это в файл `LICENSE` в корне репозитория:**

```
MIT License

Copyright (c) [YEAR] [COMPANY_NAME]

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

**Placeholders:**
- `[YEAR]` — текущий год (например, 2026)
- `[COMPANY_NAME]` — юридическое имя компании (например, "Rork-Kiku Inc.")

---

## Intellectual Property Considerations

### Trademark

**License НЕ покрывает trademark:**
- MIT License даёт permission на использование кода
- Но НЕ даёт permission использовать brand name "Rork-Kiku", logo
- Нужна отдельная trademark policy

**Пример disclaimer:**
```
The name "Rork-Kiku" and the Rork-Kiku logo are trademarks of [COMPANY_NAME].
Use of these trademarks is not permitted without prior written consent.
```

### Patents

**MIT License НЕ имеет explicit patent grant:**
- Если у вас есть patents на algorithms, MIT не даёт patent license
- Если это concern, рассмотрите Apache 2.0 (имеет patent grant)

**Для Rork-Kiku:**
- Если ML models или algorithms патентуются → consider Apache 2.0
- Если нет patents → MIT достаточно

---

## Implementation Steps

### Если Open-Sourcing Части Кода

1. **Create LICENSE file:**
   ```bash
   touch LICENSE
   # Вставить MIT License text (см. выше)
   ```

2. **Add Copyright Notice в каждый file:**
   ```javascript
   /**
    * Copyright (c) 2026 Rork-Kiku Inc.
    * 
    * This source code is licensed under the MIT license found in the
    * LICENSE file in the root directory of this source tree.
    */
   ```

3. **Update README.md:**
   ```markdown
   ## License
   
   This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
   ```

4. **Contributor License Agreement (CLA):**
   - Рассмотрите CLA для contributions (опционально)
   - Ensures contributors assign IP rights к компании

### Если Keeping Code Private

**No public license needed, но:**

1. **Internal License Policy:**
   - Документируйте, что code является proprietary
   - Добавьте copyright notices в файлы

2. **Employee/Contractor Agreements:**
   - IP assignment agreements (см. docs/legal/data_room_checklist.md)
   - Ensure все contributors assign IP к компании

---

## Legal Disclaimer

**⚠️ IMPORTANT:** Данный документ — это recommendation, НЕ legal advice.

**Перед выбором license:**
- Проконсультируйтесь с юристом (IP lawyer)
- Рассмотрите вашу business model и plans
- Учтите jurisdictions где работаете
- Проверьте, нет ли conflicting licenses в dependencies

**Contact:** [LEGAL_EMAIL] для юридической консультации

---

## Resources

**Learn More:**
- choosealicense.com — помогает выбрать license
- opensource.org/licenses — полный список OSI-approved licenses
- tldrlegal.com — plain English explanations licenses

**Comparison Tools:**
- GitHub License Picker
- OSS License Comparison (Wikipedia)

---

## Заключение

**Для Rork-Kiku:**

✅ **Рекомендуем MIT License** для:
- Open-sourced components (SDK, tools)
- Technical documentation
- Sample code

❌ **Keep Private:**
- Core application code
- ML models
- Business logic

✅ **Separate Trademark Policy:**
- Protect brand name и logo
- Allow code use, но не brand use без permission

---

**Последнее обновление:** 2026-01-02  
**Версия:** 1.0  
**Контакт:** [FOUNDERS_EMAIL]
