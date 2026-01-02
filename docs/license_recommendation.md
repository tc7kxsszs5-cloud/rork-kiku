# Рекомендация по лицензии для Rork-Kiku

## Рекомендуемая лицензия: MIT License

### Обоснование

**MIT License** рекомендуется для Rork-Kiku по следующим причинам:

#### 1. Простота и ясность
- Короткая, понятная лицензия (< 200 слов)
- Минимальные юридические сложности
- Wide recognition и acceptance в индустрии

#### 2. Permissive (Разрешительная)
- Позволяет commercial use
- Позволяет modification
- Позволяет distribution
- Позволяет private use

#### 3. Business-Friendly
- Не требует раскрытия source code производных работ
- Flexibility для potential partnerships
- Не препятствует future commercialization strategies
- Compatible с proprietary components

#### 4. Contributor-Friendly
- Легко понять для contributors
- Низкий barrier для contributions
- No CLA (Contributor License Agreement) required (хотя можем добавить optional)

#### 5. Legal Protection
- Includes disclaimer of warranty
- Limits liability
- Clear attribution requirements

---

## MIT License Text (для включения)

```
MIT License

Copyright (c) 2024 Rork-Kiku Team

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

## Альтернативные варианты (не рекомендованы, но рассмотрены)

### Apache License 2.0
**Pros:**
- Explicit patent grant
- More detailed legal protections
- Corporate-friendly

**Cons:**
- Более сложная
- Longer license text
- Может отпугнуть некоторых contributors

**Verdict:** Overkill для нашего stage. MIT достаточна.

### GPL (GNU General Public License)
**Pros:**
- Strong copyleft protection
- Ensures open-source derivative works

**Cons:**
- **Copyleft требует раскрытия source code** — конфликтует с business model
- Less friendly для commercial partnerships
- May deter corporate contributors

**Verdict:** Не подходит. Слишком restrictive для commercial startup.

### Proprietary (No Open Source License)
**Pros:**
- Full control over code
- No obligation to share

**Cons:**
- Теряем benefits of open-source community
- Less transparency (important для child safety product)
- Harder для recruiting (developers prefer open-source)

**Verdict:** Не aligned с values (transparency, community).

---

## Open Source Strategy

### Что open-source:
- **Mobile app (React Native)** — MIT License
- **Documentation** — MIT License
- **Public SDKs/APIs** (если создадим) — MIT License

### Что НЕ open-source (proprietary):
- **ML models** (trained weights) — proprietary (competitive advantage)
- **Backend services** — proprietary (security, business logic)
- **Infrastructure code** — proprietary (security)
- **Moderation algorithms** (specifics) — proprietary (prevent gaming)

### Hybrid Approach

**Repos:**
```
github.com/rork-kiku/app              - MIT (mobile app)
github.com/rork-kiku/docs             - MIT (documentation)
github.com/rork-kiku/sdk              - MIT (future public SDK)
github.com/rork-kiku/backend          - Private (proprietary)
github.com/rork-kiku/ml-models        - Private (proprietary)
github.com/rork-kiku/infrastructure   - Private (proprietary)
```

---

## Implementation Steps

### 1. Add LICENSE file
- В root repo: `LICENSE` file с MIT text
- Update copyright year annually

### 2. Add license header (optional)
- В каждом source file (если хотим):
```javascript
/**
 * Copyright (c) 2024 Rork-Kiku Team
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
```

### 3. Update package.json
```json
{
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/rork-kiku/app.git"
  }
}
```

### 4. Add LICENSE badge
- В README.md:
```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

### 5. CONTRIBUTING.md
- Clarify что contributions будут под той же license
- Optional CLA если хотим explicit assignment of rights

---

## Third-Party Licenses

### Dependencies Audit

**Ensure compatibility:**
- Check licenses всех npm packages
- Tool: `npx license-checker --summary`
- Avoid GPL dependencies (incompatible с нашим use case)

**Acceptable licenses:**
- MIT, Apache 2.0, BSD, ISC — ✅ Compatible
- GPL, AGPL — ❌ Avoid (copyleft)

### Attribution

**THIRD_PARTY_LICENSES.md:**
- List all dependencies и их licenses
- Automated generation: `npx license-checker --json > licenses.json`

---

## Legal Review

**⚠️ Рекомендация:**
- Final license choice должен быть reviewed by legal counsel
- Especially если планируем:
  - Acquisitions
  - Strategic partnerships
  - Licensing code к third parties

---

## Conclusion

**MIT License** is the best fit for Rork-Kiku:
- ✅ Simple и clear
- ✅ Business-friendly
- ✅ Community-friendly
- ✅ Flexibility для future
- ✅ Standard в mobile/React Native ecosystem

Proceed с MIT License для public repos (app, docs). Keep backend/ML proprietary.

---

**Последнее обновление:** [DATE] — PLACEHOLDER  
**Reviewed by:** [Legal Counsel Name] — PLACEHOLDER
