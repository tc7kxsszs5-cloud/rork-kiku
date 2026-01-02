## 📋 Pull Request Checklist

### Описание изменений

<!-- Опишите что изменено и почему. Ссылка на issue если есть. -->

**Связанные Issues**: #

**Тип изменений**:
- [ ] 🐛 Bug fix (исправление бага)
- [ ] ✨ New feature (новая функциональность)
- [ ] 💥 Breaking change (изменение, ломающее backward compatibility)
- [ ] 📝 Documentation (только документация)
- [ ] 🎨 Style/Refactoring (изменения, не влияющие на функциональность)
- [ ] ⚡ Performance (улучшение производительности)
- [ ] ✅ Tests (добавление или обновление тестов)
- [ ] 🔧 Chore (обновление build scripts, зависимостей, и т.д.)

---

### ✅ Общий Checklist

- [ ] Код следует code style проекта (ESLint прошел без ошибок)
- [ ] Код проверен TypeScript (0 type errors)
- [ ] Self-review: я проверил свой код
- [ ] Комментарии добавлены в сложных местах (где необходимо)
- [ ] Документация обновлена (если применимо)
- [ ] Не добавлены console.log/debug statements (или добавлены намеренно)
- [ ] Git commits имеют понятные сообщения (conventional commits)

---

### 🔒 Security Checklist

⚠️ **КРИТИЧНО для проекта, работающего с детскими данными**

- [ ] Не добавлены секреты, API keys, пароли в код
- [ ] Sensitive данные шифруются (если applicable)
- [ ] User input валидируется и sanitized (защита от injection attacks)
- [ ] Authentication/authorization проверяется на всех endpoints (если applicable)
- [ ] COPPA/GDPR compliance соблюдается (если изменения касаются data handling)
- [ ] Нет SQL injection vulnerabilities (используется parameterized queries или ORM)
- [ ] Нет XSS vulnerabilities (user input escaped перед отображением)
- [ ] Нет CSRF vulnerabilities (если применимо к web interfaces)
- [ ] Dependencies обновлены (npm audit не показывает critical/high vulnerabilities)
- [ ] Новые third-party libraries проверены (license compatible, trustworthy)

**Если вы изменяли что-то, связанное с безопасностью, объясните:**
<!-- Например: "Добавлен JWT validation middleware на endpoint /api/children/:id" -->

---

### 🧪 Testing Checklist

- [ ] Unit tests добавлены/обновлены для новой функциональности
- [ ] Integration tests добавлены (если applicable)
- [ ] E2E tests обновлены (если applicable)
- [ ] Все тесты проходят (`npm test`)
- [ ] Manual testing выполнен (опишите ниже)

**Manual Testing Steps** (что вы тестировали вручную):
<!-- 
Например:
1. Зарегистрировал нового родителя
2. Создал child profile
3. Протестировал content filtering на 10 примерах
4. Проверил, что parent notification работает
-->

---

### 📱 Mobile-Specific Checklist (если применимо)

- [ ] Протестировано на iOS Simulator (version: ___)
- [ ] Протестировано на Android Emulator (version: ___) (если applicable)
- [ ] Протестировано на реальном устройстве (device: ___)
- [ ] UI выглядит правильно на разных размерах экранов
- [ ] Dark mode поддерживается (если applicable)
- [ ] Accessibility соблюдается (screen reader, contrast, font sizes)
- [ ] App не крашится при orientation change
- [ ] Performance приемлемая (нет лагов, UI responsive)

---

### 🔧 Backend-Specific Checklist (если применимо)

- [ ] Database migrations написаны и протестированы (если есть schema changes)
- [ ] Rollback план есть (если breaking changes)
- [ ] API backward compatible (или версионирован)
- [ ] Performance протестирована (query времена, N+1 queries checked)
- [ ] Caching рассмотрен (если применимо)
- [ ] Rate limiting рассмотрен (для public endpoints)
- [ ] Logging добавлен (для важных actions)
- [ ] Error handling правильный (не expose sensitive info)

---

### 🚀 Deployment Checklist

- [ ] Changes не требуют manual deployment steps (или steps documented ниже)
- [ ] Environment variables добавлены (если нужны новые, documented в README)
- [ ] Database migrations готовы к запуску (если applicable)
- [ ] Feature flags использованы (если большое изменение, можно отключить)
- [ ] Rollback plan есть (если что-то пойдет не так)
- [ ] Monitoring/alerting настроен (если applicable)

**Manual Deployment Steps** (если требуются):
<!-- Например: "Run migration: npm run migrate:up" -->

---

### 📊 Performance Impact

<!-- Опишите влияние на performance, если применимо -->

- [ ] Changes не влияют на performance негативно
- [ ] Performance улучшена (опишите, как измерили)
- [ ] Potential performance issues identified и documented

**Performance Measurements** (если applicable):
<!-- Например: "API latency: before 250ms → after 180ms (p95)" -->

---

### 📸 Screenshots / Demo

<!-- Если UI changes, добавьте screenshots -->
<!-- Если сложная функциональность, можно добавить GIF/video -->

**Before**:
<!-- Screenshot или описание предыдущего состояния -->

**After**:
<!-- Screenshot или описание нового состояния -->

---

### 🔗 Related Links

<!-- Ссылки на relevant documents, designs, discussions -->

- Design (Figma): <!-- Link если есть -->
- Discussion (Slack/Discord): <!-- Link если есть -->
- Documentation: <!-- Link к updated docs -->

---

### 👥 Reviewers

<!-- @mention конкретных людей, чей review вы хотите -->

**Requested reviewers**:
- [ ] @CTO (для technical review)
- [ ] @ProductLead (для product review)
- [ ] @SecurityLead (если security-related changes)

---

### 📝 Additional Notes

<!-- Любые дополнительные заметки для reviewers -->

<!-- Например:
- Это WIP (Work in Progress), feedback welcome но не ready to merge
- Блокируется другим PR: #123
- Требует manual testing на staging before merge
-->

---

## Reviewer Guidelines

**Для reviewers**:

### What to check:
1. **Functionality**: Работает ли как ожидается?
2. **Code Quality**: Читабельность, maintainability
3. **Security**: См. Security Checklist выше
4. **Performance**: Нет ли performance regressions?
5. **Tests**: Достаточно ли покрытие?
6. **Documentation**: Обновлена ли документация?

### How to review:
- Checkout ветку локально и test manually (для important changes)
- Прочитайте код line-by-line
- Оставьте constructive comments
- Approve только если confident в изменениях
- Request changes если есть серьезные проблемы

### Approval criteria:
- ✅ Все checklist items checked
- ✅ CI/CD пройден (lint, tests, build)
- ✅ Manual testing выполнен (если applicable)
- ✅ Security review passed (для security-sensitive changes)
- ✅ At least 1 approval от team member (для non-trivial changes)
- ✅ At least 2 approvals (для critical/breaking changes)

---

## Merge Strategy

- **Squash and merge** (recommended для feature branches)
- **Rebase and merge** (для clean linear history)
- **Merge commit** (для больших features с valuable commit history)

**После merge**:
- [ ] Delete branch (если feature branch)
- [ ] Update related Issues (close, update status)
- [ ] Monitor deployment (если auto-deploy enabled)
- [ ] Notify team (в Slack, если significant change)

---

**Спасибо за contribution! 🎉**
