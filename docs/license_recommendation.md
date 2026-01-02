# Рекомендация лицензии для Rork-Kiku

## Рекомендуемая лицензия: MIT License

### Обоснование

**MIT License** рекомендуется для Rork-Kiku по следующим причинам:

1. **Простота:** Самая простая и понятная open source license
2. **Permissive:** Минимальные ограничения, максимальная свобода использования
3. **Business-friendly:** Позволяет коммерческое использование
4. **Совместимость:** Compatible с большинством других licenses
5. **Популярность:** Наиболее широко используемая license (GitHub, npm ecosystem)

### Что MIT License позволяет:

✅ Коммерческое использование
✅ Модификация кода
✅ Распространение
✅ Private use
✅ Включение в proprietary software

### Что MIT License требует:

📝 Include копию license и copyright notice

### Что MIT License НЕ предоставляет:

❌ Warranty (нет гарантий)
❌ Liability protection (нет ответственности)

---

## Альтернативные опции (если MIT не подходит)

### Apache License 2.0

**Когда использовать:**
- Нужна patent grant protection
- Больше legal clarity
- Корпоративная среда

**Отличия от MIT:**
- Explicit patent grant
- Требует указывать изменения в NOTICE file
- Более detailed legal language

### GPL v3 (НЕ рекомендуется для коммерческого проекта)

**Почему НЕ рекомендуется:**
- Copyleft: требует открывать derived works
- Проблемы с коммерциализацией
- Может отпугнуть contributors и partners

**Когда использовать:**
- Только если 100% committed к open source ideology
- Не планируете коммерческую модель

---

## Рекомендация для Rork-Kiku

**USE: MIT License**

### Reasoning для Rork-Kiku:

1. **Flexibility:** Можем позже создать commercial offerings
2. **Adoption:** Легче привлечь contributors
3. **Partnership:** Schools, NGOs могут использовать без concerns
4. **Dependencies:** Большинство наших dependencies MIT или compatible
5. **Exit options:** MIT не ограничивает potential acquisition

---

## Implementation

### 1. Create LICENSE file

Создать `LICENSE` в root directory:

```
MIT License

Copyright (c) 2026 [YOUR LEGAL ENTITY NAME]

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

### 2. Add to package.json

```json
{
  "license": "MIT"
}
```

### 3. Add to README.md

```markdown
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

### 4. Headers в source files (опционально)

```typescript
/**
 * Copyright (c) 2026 Rork-Kiku
 * Licensed under the MIT License
 */
```

---

## Special Considerations

### Proprietary Components

Если есть components, которые НЕ должны быть open source:

**Option 1: Dual Licensing**
- Core: MIT (open source)
- Premium features: Proprietary

**Option 2: Separate Repositories**
- Public repo: Open source (MIT)
- Private repo: Proprietary code

**Option 3: Business Source License (BSL)**
- Open source after delay (e.g., 2 years)
- Commercial use requires license

### Third-Party Code

**Check licenses всех dependencies:**

```bash
npx license-checker --summary
```

**Ensure compatibility:**
- MIT → MIT ✅
- Apache 2.0 → MIT ✅
- BSD → MIT ✅
- GPL → MIT ❌ (incompatible если linking)

---

## Legal Review

⚠️ **DISCLAIMER:** This is NOT legal advice.

**Before finalizing license:**
- Consult с lawyer (особенно если есть investors или planning to raise)
- Review со всеми co-founders (unanimous agreement)
- Document decision

**Questions для lawyer:**
- IP ownership (кто owns code?)
- Contributor agreements (нужны ли CLA - Contributor License Agreements?)
- Patent rights
- Trademark protection (license НЕ covers trademarks)

---

## Resources

**MIT License:**
- Official: https://opensource.org/licenses/MIT
- GitHub: https://choosealicense.com/licenses/mit/

**License Comparison:**
- https://choosealicense.com/
- https://tldrlegal.com/

**Legal Counsel:**
- [TO BE PROVIDED - local tech lawyer recommendation]

---

## Action Items

- [ ] Decide на license (MIT recommended)
- [ ] Create LICENSE file
- [ ] Update package.json
- [ ] Update README.md
- [ ] Legal review (если есть investors)
- [ ] Communicate to team и contributors

---

**Contact:** [FOUNDERS_EMAIL]

**Date:** 2026-01-02 (Draft)
