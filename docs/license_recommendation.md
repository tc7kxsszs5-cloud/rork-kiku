# Рекомендация лицензии для Rork-Kiku

## Рекомендуемая лицензия: MIT License

### Обоснование выбора

**MIT License** — одна из самых permissive open source лицензий, подходящая для коммерческих проектов.

**Преимущества MIT**:
1. ✅ **Simple**: Короткая и понятная
2. ✅ **Permissive**: Позволяет commercial use, modification, distribution
3. ✅ **Compatible**: Совместима с большинством других лицензий
4. ✅ **Industry standard**: Используется многими крупными проектами (React, Node.js)
5. ✅ **No copyleft**: Не требует open-sourcing производных работ (в отличие от GPL)

**Недостатки MIT**:
- ❌ Не предоставляет patent protection (в отличие от Apache 2.0)
- ❌ Minimal warranty disclaimer (но достаточно для большинства случаев)

### Альтернативы

#### Apache License 2.0
**Плюсы**: Patent protection, explicit contributor agreements  
**Минусы**: Более сложная лицензия  
**Когда использовать**: Если patent concerns (например, ML algorithms patentable)

#### Proprietary License
**Плюсы**: Полный контроль, no obligations  
**Минусы**: No community contributions, less trust  
**Когда использовать**: Если хотите закрытый source (не recommended для MVP stage)

### Рекомендация для Rork-Kiku

**Сценарий**: Если планируете open-source клиентские библиотеки или SDKs

**Рекомендация**:
- **Client libraries** (iOS, Android, JS SDK): **MIT License**
- **Backend services**: **Proprietary** (closed source)
- **ML models**: **Proprietary** (trade secret)

**Hybrid approach**: Open-source client, closed-source backend — common для SaaS companies (Firebase, Stripe, Auth0).

### MIT License Text

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

### Как добавить лицензию

1. **Create LICENSE file** в root directory
2. **Add license header** в каждый source file (optional, но recommended):

```javascript
// Copyright (c) 2026 Rork-Kiku
// Licensed under the MIT License. See LICENSE file in the project root.
```

3. **Update package.json** (Node.js projects):

```json
{
  "license": "MIT"
}
```

4. **Update README.md**:

```markdown
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

### Legal Review

⚠️ **Disclaimer**: Это рекомендация, не legal advice. Проконсультируйтесь с юристом перед finalization лицензии, особенно если:
- Планируете патентовать innovations
- Используете third-party code с copyleft licenses (GPL)
- Есть contributors outside team

---

**Контакт**: [FOUNDERS_EMAIL]  
**Дата создания**: 2026-01-02
