# Рекомендация по лицензированию проекта Rork-Kiku

## Рекомендуемая лицензия: MIT License

### Обоснование выбора

Для проекта **Rork-Kiku** рекомендуется использовать **MIT License** по следующим причинам:

#### 1. Простота и понятность
- MIT — одна из самых простых и понятных лицензий
- Минимальные ограничения для пользователей
- Легко читается и интерпретируется юристами

#### 2. Коммерческая гибкость
- Позволяет коммерческое использование
- Не требует раскрытия исходного кода производных работ
- Дает свободу в выборе бизнес-модели

#### 3. Широкое признание
- Используется крупными проектами: React, Node.js, Angular
- Одобрена OSI (Open Source Initiative)
- Совместима с большинством других лицензий

#### 4. Минимальная юридическая сложность
- Не требует копирования лицензии в производные работы (только уведомление)
- Снижает юридические риски для компаний-партнеров
- Упрощает интеграцию сторонних разработчиков

#### 5. Привлекательность для инвесторов
- Не создает барьеров для инвестиций
- Позволяет создать проприетарные компоненты (например, ML-модели)
- Дает возможность лицензировать отдельные модули

### Альтернативные варианты

#### Apache 2.0
**Плюсы**:
- Явная патентная защита
- Более подробное описание прав

**Минусы**:
- Более сложная лицензия
- Требует больше юридического внимания

**Рекомендация**: Рассмотреть, если планируется много патентуемых инноваций

#### GPL v3 / AGPL
**Не рекомендуется** для Rork-Kiku:
- Требует открытия исходного кода всех производных работ
- Может отпугнуть коммерческих партнеров
- Усложнит коммерциализацию

#### Proprietary (Закрытая)
**Не рекомендуется** на начальном этапе:
- Ограничивает возможности для сообщества
- Может затруднить привлечение разработчиков
- Снижает прозрачность проекта (важно для детской безопасности)

### Гибридная модель

Рекомендуемый подход для Rork-Kiku:

```
├── Frontend (React Native) — MIT License
├── Backend API — MIT License
├── ML Models (базовые) — MIT License
├── ML Models (продвинутые) — Proprietary / Commercial License
└── Документация — Creative Commons BY 4.0
```

**Обоснование**:
- Открытая платформа привлекает сообщество и доверие
- Проприетарные ML-модели защищают конкурентное преимущество
- Прозрачность критична для проектов детской безопасности

### Текст лицензии MIT

```
MIT License

Copyright (c) 2026 Rork-Kiku Team

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

### Следующие шаги

1. **Создать файл LICENSE** в корне репозитория с текстом MIT License
2. **Добавить copyright notice** в начале каждого исходного файла:
   ```javascript
   // Copyright (c) 2026 Rork-Kiku Team
   // SPDX-License-Identifier: MIT
   ```
3. **Указать лицензию в package.json**:
   ```json
   {
     "license": "MIT"
   }
   ```
4. **Добавить badge в README.md**:
   ```markdown
   [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
   ```

### Юридические оговорки

⚠️ **ВАЖНО**: Данный документ не является юридической консультацией.

Перед финализацией лицензии необходимо:
- Проконсультироваться с юристом, специализирующимся на IP и Open Source
- Убедиться, что выбранная лицензия соответствует бизнес-целям
- Проверить совместимость со всеми зависимостями проекта
- Согласовать с инвесторами и соучредителями

### Проверка зависимостей

Перед применением MIT License необходимо проверить лицензии всех зависимостей:

```bash
# Для npm проектов
npx license-checker --summary

# Для Python проектов
pip-licenses
```

Убедитесь, что:
- Все зависимости совместимы с MIT
- Нет GPL-лицензированных библиотек (если не планируете открывать весь код)
- Соблюдены требования к attribution для используемых библиотек

---

**Автор рекомендации**: Техническая команда Rork-Kiku  
**Дата**: Январь 2026  
**Статус**: Черновик, требует юридического ревью
