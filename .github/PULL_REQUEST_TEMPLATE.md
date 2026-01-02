# Pull Request: [Brief Title]

## 📝 Описание

### Цель PR
<!-- Опишите, что делает этот PR и почему это нужно -->

**Closes #**: <!-- Номер issue, если есть -->

### Изменения
<!-- Кратко опишите основные изменения -->
- 
- 
- 

### Тип изменений
<!-- Отметьте галочкой применимые типы -->
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🎨 UI/UX improvement
- [ ] ⚡ Performance improvement
- [ ] ♻️ Code refactoring
- [ ] 🔒 Security fix

---

## ✅ Checklist

### Основное
- [ ] Код протестирован locally
- [ ] Добавлены tests (если применимо)
- [ ] Документация обновлена (если применимо)
- [ ] No breaking changes (или они явно задокументированы)
- [ ] Код следует style guidelines проекта (ESLint passed)
- [ ] TypeScript type check passed (`npm run ci:tsc`)

### Тестирование
- [ ] Unit tests passed (если есть)
- [ ] Manual testing completed
- [ ] Tested на iOS Simulator (если iOS change)
- [ ] Tested на Android Emulator (если Android change)
- [ ] Tested с различными сценариями (happy path + edge cases)

### Security
- [ ] No secrets или credentials в коде
- [ ] Input validation добавлена (если applicable)
- [ ] Authentication/authorization проверены (если applicable)
- [ ] Sensitive data encrypted или masked (если applicable)
- [ ] Dependencies проверены на vulnerabilities (`npm audit`)

### Инфраструктура (если applicable)
- [ ] CI/CD pipeline updated (если нужно)
- [ ] Environment variables documented
- [ ] Database migrations included (если DB changes)
- [ ] Backward compatibility сохранена

### Mobile-specific (если iOS/Android change)
- [ ] No hardcoded values (используются constants)
- [ ] Responsive design проверен (различные screen sizes)
- [ ] Performance checked (no memory leaks, lag)
- [ ] Offline behavior проверен (если applicable)

---

## 📸 Screenshots / Demo

<!-- Если это UI change, добавьте screenshots или GIF -->
<!-- Используйте формат: -->
### Before
<!-- Screenshot before changes -->

### After
<!-- Screenshot after changes -->

---

## 🔗 Связанные документы

<!-- Links to related docs, issues, PRs -->
- Related to: #
- Documentation: `docs/...`
- Design: [Figma link]

---

## 📋 Deployment Instructions (если applicable)

<!-- Инструкции для deployment этого PR -->
<!-- Например: -->
- [ ] Run database migrations: `npm run migrate`
- [ ] Update environment variables: `ENV_VAR=value`
- [ ] Clear cache: `redis-cli FLUSHALL`
- [ ] Restart services: `kubectl rollout restart deployment/...`

---

## 🤔 Questions / Concerns

<!-- Есть ли вопросы или concerns, которые нужно обсудить? -->

---

## 👀 Reviewers

<!-- Tag specific people для review -->
@username <!-- Replace with actual usernames -->

---

## 📄 DCO Sign-off

<!-- Developer Certificate of Origin -->
By submitting this pull request, I certify that:
- [ ] I have the right to submit this code under the project's license
- [ ] I understand and agree that this project and contribution are public
- [ ] My contribution is my original work (or I have permission to submit it)

**Sign-off**: <!-- Your name and email -->

---

**Thank you for your contribution to Rork-Kiku! 🎉**
