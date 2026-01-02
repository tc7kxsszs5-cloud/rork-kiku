# Рекомендация лицензии для Rork-Kiku

## Рекомендуемая лицензия: MIT License

### Обоснование выбора

Для проекта Rork-Kiku мы рекомендуем **MIT License** по следующим причинам:

---

## Преимущества MIT License

### 1. Простота и ясность
- Короткая (менее 200 слов)
- Легко понять даже без юридического background
- Минимальные требования

### 2. Permissive (Разрешительная)
- Позволяет использовать код в коммерческих проектах
- Можно modify и distribute
- Можно использовать в closed-source проектах
- Нет copyleft requirements (как в GPL)

### 3. Широкое принятие
- Одна из самых популярных open-source лицензий
- Используется крупными проектами (React, Node.js, jQuery)
- Developers familiar с ней

### 4. Минимальные обязательства
- Только требование: include copyright notice и license text
- Нет требований disclosure source code
- Нет patent provisions (проще для бизнеса)

### 5. Бизнес-friendly
- Не ограничивает коммерциализацию
- Можно dual-license (MIT для open-source, commercial для enterprise)
- Инвесторы comfortable с MIT

---

## MIT License Text

```
MIT License

Copyright (c) [year] [fullname]

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

---

## Для Rork-Kiku

**Рекомендация:** Создать `LICENSE` файл в корне репозитория:

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

---

## Альтернативные лицензии (не рекомендуем, но можно рассмотреть)

### Apache License 2.0
**Pros:**
- Похож на MIT (permissive)
- Explicit patent grant (защищает от patent trolls)
- Better для корпораций (более detailed)

**Cons:**
- Длиннее и сложнее MIT
- Требует NOTICE file

**Рекомендация:** Рассмотрите, если:
- У вас есть patents или планируете патентовать
- Работаете с крупными корпорациями, которые требуют patent grants

### GPL v3 (GNU General Public License)
**Pros:**
- Copyleft: модификации должны быть open-source
- Сильная защита open-source community

**Cons:**
- ❌ **НЕ рекомендуется для Rork-Kiku**
- Ограничивает коммерциализацию
- "Viral" license: требует весь derived work быть GPL
- Инвесторы могут быть uncomfortable
- Сложнее привлекать contributors

### AGPL (Affero GPL)
**Pros:**
- Strongest copyleft (даже для SaaS)

**Cons:**
- ❌ **НЕ рекомендуется для Rork-Kiku**
- Ещё более restrictive чем GPL
- Может отпугнуть enterprise customers

### Proprietary / Closed-Source
**Pros:**
- Полный контроль
- IP protection

**Cons:**
- ❌ **НЕ рекомендуется для Rork-Kiku**
- Сложнее привлекать contributors
- Less community trust
- No open-source benefits (PR, innovation, etc.)

---

## Специфика для Rork-Kiku

### Open-Source Strategy

**Что open-source:**
- Core platform code (backend, API)
- Mobile apps (iOS/Android)
- ML model inference code (не training data)
- Documentation, guides

**Что может быть closed-source (опционально):**
- ML training pipelines и proprietary datasets
- Moderation dashboard (internal tools)
- Enterprise-specific features
- Proprietary algorithms (если есть significant IP)

### Dual-Licensing Strategy (Future)

**Возможность:**
- MIT License для community edition
- Commercial license для enterprise (добавляет features, support, SLA)

**Benefit:**
- Open-source для adoption и trust
- Revenue stream от enterprise customers

**Example:** MySQL, Qt, GitLab используют dual-licensing

---

## Compliance с Dependencies

### Проверка лицензий dependencies:

**Allowed (compatible с MIT):**
- ✅ MIT
- ✅ Apache 2.0
- ✅ BSD (2-clause, 3-clause)
- ✅ ISC

**Осторожно (может требовать disclosure):**
- ⚠️ LGPL (Lesser GPL) — ok для libraries, не для derived work
- ⚠️ MPL (Mozilla Public License) — файл-level copyleft

**Avoid (несовместимы с MIT для commercial):**
- ❌ GPL
- ❌ AGPL

**Инструменты для проверки:**
- `license-checker` (npm)
- `pip-licenses` (Python)
- GitHub Dependency Graph

---

## Рекомендация для действия

### Immediate Steps:

1. **Создайте LICENSE file:**
   ```bash
   # В корне репозитория
   touch LICENSE
   # Copy MIT License text (см. выше)
   ```

2. **Добавьте в README.md:**
   ```markdown
   ## License
   
   This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
   ```

3. **Copyright notices:**
   - Добавьте в начало каждого source file (опционально, но best practice):
   ```javascript
   /**
    * Copyright (c) 2026 Rork-Kiku Team
    * Licensed under the MIT License
    */
   ```

4. **Проверьте dependencies:**
   ```bash
   npm install -g license-checker
   license-checker --summary
   ```
   - Убедитесь, что нет GPL dependencies

5. **Update package.json:**
   ```json
   {
     "license": "MIT"
   }
   ```

---

## Юридические disclaimer'ы

**⚠️ Важно:**
- Это не юридическая консультация
- Consult с IP lawyer перед финальным решением
- Лицензия может меняться в зависимости от business strategy

**Рекомендация:**
- Получите legal review перед публикацией
- Especially важно если планируете patents или IP protection

---

## Ресурсы

**Для дополнительной информации:**
- [ChooseALicense.com](https://choosealicense.com/) — сравнение лицензий
- [TLDRLegal](https://tldrlegal.com/) — простые объяснения лицензий
- [OSI Approved Licenses](https://opensource.org/licenses) — официальный список

**Для compliance checking:**
- [FOSSA](https://fossa.com/) — license compliance tool
- [WhiteSource](https://www.whitesourcesoftware.com/) — enterprise solution

---

## Заключение

**MIT License — правильный выбор для Rork-Kiku** потому что:
- ✅ Permissive для community adoption
- ✅ Business-friendly для investors
- ✅ Simple для contributors
- ✅ Flexible для будущих business models (dual-licensing)

**Next step:** Создайте LICENSE file и commit к репозиторию.

---

**Примечание:** Если у вас есть specific concerns (patents, competition, IP protection), consult с IP lawyer для более detailed strategy.
