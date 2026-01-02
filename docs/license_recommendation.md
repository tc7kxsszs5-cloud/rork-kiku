# License Recommendation — MIT License

## Рекомендация

Для проекта **kiku** мы рекомендуем использовать **MIT License**.

---

## Почему MIT License?

### 1. Простота и Понятность

MIT License — одна из самых простых и понятных open-source лицензий:
- Короткая (менее 200 слов)
- Легко читается и понимается
- Минимум юридического жаргона

### 2. Максимальная Свобода

MIT License дает пользователям максимальную свободу:
- ✅ Использовать код в коммерческих проектах
- ✅ Модифицировать код
- ✅ Распространять код
- ✅ Сублицензировать (использовать в closed-source проектах)
- ✅ Продавать продукты на основе кода

**Единственное требование:** Сохранить copyright notice и лицензию в копиях кода.

### 3. Бизнес-friendly

MIT License не мешает монетизации:
- Вы можете создать closed-source версию продукта
- Можете продавать commercial лицензии
- Нет требований делать производные работы open-source (в отличие от GPL)

**Пример:** React (Facebook) использует MIT License, но это не мешает им монетизировать другие продукты.

### 4. Широкое Принятие

MIT License — одна из самых популярных лицензий:
- Используется React, Node.js, Vue.js, Angular, Rails
- Понятна разработчикам по всему миру
- Доверие со стороны enterprise-клиентов

### 5. Совместимость

MIT License совместима с большинством других лицензий:
- Можно комбинировать с GPL, Apache 2.0, BSD
- Легко интегрировать в любые проекты
- Нет licensing conflicts

---

## Альтернативы (и почему мы их не выбрали)

### GPL (GNU General Public License)

**Pros:**
- Гарантирует, что производные работы остаются open-source
- Сильная copyleft защита

**Cons:**
- ❌ Все производные работы ДОЛЖНЫ быть open-source (copyleft)
- ❌ Не подходит для dual licensing (open-source + commercial)
- ❌ Многие компании избегают GPL из-за licensing restrictions

**Когда использовать:** Если вы хотите, чтобы ВСЕ улучшения кода оставались open-source (например, Linux Kernel).

**Для kiku:** Не подходит, так как мы планируем commercial model и возможно closed-source features.

### Apache 2.0

**Pros:**
- Включает patent grant (защита от patent litigation)
- Более formal и detailed чем MIT
- Хорошая защита для contributors

**Cons:**
- Более длинная и сложная лицензия
- Patent provisions могут быть overkill для small projects

**Когда использовать:** Для больших проектов с многими contributors и patent concerns (например, Kubernetes, TensorFlow).

**Для kiku:** Overkill для раннего стартапа. MIT проще и достаточна.

### BSD (Berkeley Software Distribution)

**Pros:**
- Похожа на MIT (permissive)
- Используется FreeBSD, OpenBSD

**Cons:**
- Несколько версий (2-clause, 3-clause, 4-clause) — может запутать
- Чуть менее популярна чем MIT

**Когда использовать:** Если вы хотите чуть больше формальности чем MIT, но всё еще permissive.

**Для kiku:** MIT более популярна и проще.

### Proprietary / Closed-source

**Pros:**
- Полный контроль над кодом
- Никто не может использовать без разрешения

**Cons:**
- ❌ Нет community contributions
- ❌ Труднее привлечь developers (no transparency)
- ❌ Меньше доверия от users

**Когда использовать:** Если код — core IP и вы не хотите делиться.

**Для kiku:** Не рекомендуется на раннем этапе. Open-source помогает с trust и community.

---

## Dual Licensing Strategy (Опционально)

Вы можете использовать **dual licensing** модель:

### Open-source (MIT License)

- Core функциональность open-source
- Free для individuals и non-profits
- Community contributions welcome

### Commercial License

- Premium features (например, Enterprise dashboard, on-premise)
- Paid support и SLA
- Custom features для крупных клиентов

**Примеры:**
- **GitLab:** Open-source (Community Edition) + Commercial (Enterprise Edition)
- **MongoDB:** Open-source (SSPL) + Commercial license
- **Elastic:** Open-source (Elastic License) + Commercial features

**Для kiku:** Можно рассмотреть в будущем (после Seed round), когда будет Enterprise offering.

---

## Как Применить MIT License

### 1. Создать файл LICENSE

```
MIT License

Copyright (c) 2024 [YOUR_COMPANY_NAME]

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

**Заменить:**
- `[YOUR_COMPANY_NAME]` на название компании или "kiku Team"
- Год на текущий год (2024)

### 2. Добавить в package.json

```json
{
  "name": "kiku",
  "version": "1.0.0",
  "license": "MIT",
  ...
}
```

### 3. Добавить в README.md

```markdown
## License

kiku is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
```

### 4. Добавить copyright header (опционально)

В начало каждого файла:

```typescript
/**
 * Copyright (c) 2024 kiku Team
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
```

**Note:** Это опционально и часто не используется в JavaScript/TypeScript проектах.

---

## Что НЕ лицензируется MIT License

MIT License применяется к **коду**, но не к:

❌ **Brand & Trademarks:**
- Название "kiku"
- Логотип
- Trademark должен быть зарегистрирован separately

❌ **Content & Documentation:**
- Можно использовать отдельную лицензию для docs (например, Creative Commons)
- Или включить docs под MIT (обычная практика)

❌ **Data:**
- User data, messages, и т.д. НЕ часть кода
- Регулируется Privacy Policy, не лицензией

❌ **Services:**
- Hosted service (kiku app в App Store) — не open-source сервис
- Users не могут запустить свою версию kiku cloud infrastructure (если не предоставите)

---

## FAQ

### Q: Если я использую MIT License, могут ли конкуренты украсть мой код?

**A:** Да, технически могут использовать код. НО:
- Они не могут использовать ваш brand (trademark)
- Вы строите competitive moat через execution, not code
- Open-source помогает с trust и community
- Большинство успешных startups open-source parts of their stack (React, React Native, etc.)

### Q: Должен ли я open-source ВСЁ?

**A:** Нет! Вы можете:
- Open-source frontend (mobile app)
- Closed-source backend (API, ML models)
- Closed-source proprietary algorithms

**Hybrid approach** — часто лучший выбор.

### Q: Что если contributor сделает pull request с bug или security issue?

**A:** MIT License включает "AS IS" disclaimer:
- Вы не несете ответственности за bugs
- Contributors тоже (если они не intentionally создали проблему)
- Рекомендуется иметь Code of Conduct и contributing guidelines

### Q: Могу ли я изменить лицензию потом?

**A:** Да, но:
- Только для новых версий (старые остаются под MIT)
- Существующие forks остаются под MIT
- Может вызвать backlash от community

**Лучше:** Продумать licensing strategy заранее.

---

## Рекомендация для kiku

### Phase 1: MVP/Pilot (Текущий)

**Лицензия:** MIT License для mobile app (frontend)

**Open-source:**
- React Native app code
- UI components
- Basic features

**Closed-source:**
- Backend API (когда появится)
- ML models и prompts
- Proprietary algorithms

### Phase 2: Post-Seed

**Рассмотреть:**
- Dual licensing для Enterprise features
- Contributor License Agreement (CLA) для contributors
- Trademark registration для "kiku"

### Phase 3: Scale

**Возможно:**
- Open-source backend (partial) для transparency
- Open-source ML models (если не core IP)
- Commercial add-ons (plugins, integrations)

---

## Resources

- [MIT License Official](https://opensource.org/licenses/MIT)
- [Choose a License](https://choosealicense.com/) — Помогает выбрать лицензию
- [Open Source Guide](https://opensource.guide/) — Best practices
- [GitHub Licensing Help](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)

---

## Контакты

**Legal questions:** legal@kiku-app.com (placeholder)  
**Licensing questions:** [FOUNDERS_EMAIL]

---

**Статус:** Рекомендация для команды  
**Последнее обновление:** Январь 2024  
**Автор:** kiku Team

**⚠️ Disclaimer:** Это не юридическая консультация. Проконсультируйтесь с юристом перед принятием licensing решений.
