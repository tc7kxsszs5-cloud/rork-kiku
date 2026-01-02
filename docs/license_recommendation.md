# License Recommendation для Rork-Kiku

**Версия**: 1.0 (ЧЕРНОВИК)  
**Дата**: Январь 2026

---

## Рекомендация: MIT License

### Обоснование

Для Rork-Kiku мы рекомендуем **MIT License** по следующим причинам:

1. **Simplicity**: Простая и понятная лицензия
2. **Permissive**: Позволяет другим использовать, модифицировать и распространять код
3. **Business-friendly**: Подходит для коммерческих проектов
4. **Industry Standard**: Используется большинством React Native / Expo проектов
5. **No Copyleft**: Не требует открытия изменений (в отличие от GPL)

---

## MIT License Text

```
MIT License

Copyright (c) 2026 Rork-Kiku

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

## Как добавить LICENSE

1. **Создайте файл** `LICENSE` в корне репозитория
2. **Скопируйте** текст MIT License выше
3. **Замените** `2026` на текущий год (или год основания)
4. **Замените** `Rork-Kiku` на полное название компании (если есть юр.лицо)
5. **Commit**: `git add LICENSE && git commit -m "Add MIT License"`

---

## Альтернативные лицензии (если MIT не подходит)

### Apache License 2.0

**Pros**:
- Похож на MIT, но с patent grant
- Более защищает от patent trolls
- Популярен в enterprise

**Cons**:
- Более длинный текст
- Более сложный

**Когда использовать**: Если важна patent protection

---

### Proprietary License (Закрытый код)

**Pros**:
- Полный контроль над кодом
- Никто не может использовать без разрешения
- Защита IP

**Cons**:
- Не open-source
- Меньше community contributions
- Может отпугнуть investors (если они хотят видеть код)

**Когда использовать**: Если хотите полностью закрытый код

**Важно**: Для Rork-Kiku мы **НЕ рекомендуем** proprietary license, так как:
- Transparency важна для детской безопасности
- Open-source показывает commitment к security
- Community может помочь найти vulnerabilities

---

### GPL (GNU General Public License)

**Pros**:
- Strong copyleft (все изменения тоже должны быть open-source)
- Защита от proprietary forks

**Cons**:
- Less business-friendly
- Commercial использование сложнее
- Не подходит для SaaS бизнеса

**Когда использовать**: Если хотите гарантировать, что все форки будут open-source

**Важно**: Мы **НЕ рекомендуем** GPL для Rork-Kiku, так как это может ограничить commercial opportunities.

---

## Dual Licensing (Advanced)

**Что это**: Один код, две лицензии:
- **Open Source License** (MIT, Apache) для community
- **Commercial License** для enterprise customers (платная)

**Пример**: MySQL, Qt

**Pros**:
- Open source community contributions
- Revenue от enterprise

**Cons**:
- Сложнее управлять
- Требует CLA (Contributor License Agreement)

**Когда использовать**: Если хотите monetize enterprise licensing

**Для Rork-Kiku**: Можно рассмотреть в будущем, но для MVP — MIT достаточно.

---

## Лицензия vs Коммерческое использование

**Важно**: MIT License **НЕ мешает** коммерческому использованию!

- ✅ Вы можете продавать приложение (premium subscriptions)
- ✅ Вы можете запретить другим использовать ваш trademark (Rork-Kiku™)
- ✅ Вы можете продавать enterprise licenses
- ✅ Вы можете хостить closed-source backend (если не в repo)

**Что MIT позволяет другим**:
- Использовать ваш код в своих проектах
- Модифицировать код
- Распространять модификации

**Что MIT НЕ позволяет**:
- ❌ Использовать ваш trademark без разрешения
- ❌ Claim ваш код как свой (attribution required)

---

## Trademark Protection

**Важно**: License != Trademark!

**MIT License** не защищает название "Rork-Kiku". Для этого нужна **Trademark Registration**.

**Next Steps**:
1. **Register trademark**: Подать заявку на trademark "Rork-Kiku" (USPTO в США)
2. **Brand Guidelines**: См. `/branding/brand-guidelines.md`
3. **Trademark Notice**: Добавить ™ или ® после названия

**В README.md добавить**:
```markdown
## Trademark

Rork-Kiku™ is a trademark of [Company Name]. The MIT License does not grant 
permission to use the trade names, trademarks, service marks, or product names 
of Rork-Kiku, except as required for describing the origin of the software.
```

---

## Open Source Contributions

Если используете MIT License, рекомендуем:

1. **CONTRIBUTING.md**: Guidelines для contributors
2. **CODE_OF_CONDUCT.md**: Code of conduct для community
3. **CLA** (Contributor License Agreement): Опционально, но рекомендуется

**Пример CLA**: "By contributing to Rork-Kiku, you agree that your contributions will be licensed under the MIT License."

---

## Final Recommendation

**Для Rork-Kiku**: **MIT License**

**Why**:
- ✅ Simple и понятная
- ✅ Business-friendly (не мешает monetization)
- ✅ Industry standard для React Native
- ✅ Transparency (важно для детской безопасности)
- ✅ Community contributions возможны

**Next Steps**:
1. [ ] Создать файл `LICENSE` с MIT License text
2. [ ] Добавить copyright notice в README.md
3. [ ] Register trademark "Rork-Kiku"
4. [ ] Создать CONTRIBUTING.md
5. [ ] Создать CODE_OF_CONDUCT.md (опционально)

---

**Disclaimer**: Эта рекомендация не является юридической консультацией. Проконсультируйтесь с юристом перед финализацией лицензии.

---

**Версия**: 1.0 (ЧЕРНОВИК)  
**Последнее обновление**: 2026-01-02  
**Автор**: Rork-Kiku Legal/Technical Team
