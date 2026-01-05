# Pull Request Template

## 📋 Описание изменений

<!-- Краткое описание того, что делает этот PR -->

### Цель

<!-- Почему эти изменения необходимы? Какую проблему они решают? -->

Closes #(issue number)

### Изменения

<!-- Список ключевых изменений -->

- [ ] 
- [ ] 
- [ ] 

---

## ✅ Чек-лист

### Код

- [ ] **Код соответствует стандартам проекта** (linter passed)
- [ ] **Добавлены/обновлены unit tests** (coverage не снизился)
- [ ] **Код не содержит TODO/FIXME** (или они задокументированы как issues)
- [ ] **Нет console.log/print statements** в production коде
- [ ] **Error handling** реализован корректно

### Тесты

- [ ] **Unit tests passed** локально
- [ ] **Integration tests passed** (если применимо)
- [ ] **Manual testing** выполнено
- [ ] **Regression testing**: Существующие функции не сломаны

### Документация

- [ ] **README обновлён** (если изменились API или setup инструкции)
- [ ] **Код документирован** (комментарии где нужно, JSDoc/docstrings)
- [ ] **Changelog обновлён** (если применимо)
- [ ] **API documentation обновлена** (для backend changes)

### Security Checklist 🔒

- [ ] **Нет секретов/credentials** в коде (проверить с помощью git-secrets/trufflehog)
- [ ] **Input validation** реализована (для user inputs)
- [ ] **SQL injection protection** (parameterized queries)
- [ ] **XSS protection** (sanitization для HTML/JavaScript)
- [ ] **CSRF protection** (если веб-формы)
- [ ] **Dependencies обновлены** и не содержат known vulnerabilities (`npm audit`, `pip check`)
- [ ] **Secrets используют environment variables** или secret management (Vault, AWS Secrets Manager)
- [ ] **HTTPS/TLS** используется для всех network calls
- [ ] **Authentication/Authorization** корректно реализованы

#### Для детских данных (COPPA/GDPR)

- [ ] **Parental consent** получен (если собираются данные детей)
- [ ] **Data minimization**: Собираются только необходимые данные
- [ ] **Encryption at rest** для sensitive data
- [ ] **Audit logging** для доступа к детским данным

---

## 🧪 Тестирование

### Локальное тестирование

<!-- Опишите, как вы тестировали изменения локально -->

**Тесты выполнены**:
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing в dev environment
- [ ] Testing на physical device (iOS/Android)

**Тестовые сценарии**:
1. 
2. 
3. 

**Результаты**:
<!-- Скриншоты или logs -->

### CI/CD

- [ ] **GitHub Actions CI** passed (все checks green)
- [ ] **Code coverage** не снизился (target: >80%)
- [ ] **Build size** не увеличился значительно (iOS: <50MB, Android: <100MB)

---

## 📱 Screenshots (если UI changes)

<!-- Добавьте screenshots BEFORE и AFTER для UI changes -->

| Before | After |
|--------|-------|
|  |  |

---

## 🔗 Связанные документы

### Issues
- Related issue: #
- Blocked by: #
- Blocks: #

### Documentation
- Architecture doc: `docs/architecture/...`
- Security design: `docs/security/...`
- API spec: `docs/api/...`

### External Links
- Design mockup (Figma): 
- Confluence page: 
- Slack discussion: 

---

## 🚀 Инструкции по деплою

### Pre-deployment

- [ ] **Database migrations** готовы (если применимо)
- [ ] **Feature flags** настроены (если применимо)
- [ ] **Rollback plan** подготовлен

### Deployment steps

<!-- Специальные шаги для деплоя этих изменений -->

1. 
2. 
3. 

### Post-deployment

- [ ] **Smoke tests** выполнены
- [ ] **Monitoring** проверен (нет errors/spikes)
- [ ] **Alerting** настроен (если новая critical feature)

---

## 🔍 Чекбоксы для ревьюера

### Code Review

- [ ] **Code quality**: Код читаем, поддерживаем, следует best practices
- [ ] **Architecture**: Изменения соответствуют общей архитектуре проекта
- [ ] **Performance**: Нет performance regressions
- [ ] **Security**: Нет security vulnerabilities
- [ ] **Tests**: Тесты покрывают все edge cases
- [ ] **Documentation**: Достаточно документирован

### Approval

- [ ] **Approve** и merge
- [ ] **Request changes**
- [ ] **Comment** (не blocking, но есть suggestions)

---

## 📝 Дополнительная информация

### Breaking Changes

<!-- Есть ли breaking changes? Как они влияют на пользователей/API? -->

- [ ] **Breaking changes**: Да / Нет
- **Impact**: 
- **Migration guide**: 

### Performance Impact

<!-- Влияние на производительность -->

- **CPU**: 
- **Memory**: 
- **Network**: 
- **Database queries**: 

### Known Issues

<!-- Известные проблемы, которые не устранены в этом PR -->

- 
- 

---

## 🤝 DCO / Sign-off

**Developer Certificate of Origin (DCO)**:

By submitting this pull request, I certify that:

- [x] I have the right to submit this contribution
- [x] My contribution is my original work or I have permission to use it
- [x] I agree to the project's license terms
- [x] I understand that this contribution is public

**Sign-off**: 

Signed-off-by: [Your Name] <[your.email@example.com]>

---

## 📞 Контакт

**Author**: @[github-username]  
**Reviewers**: @[reviewer1] @[reviewer2]  
**Team**: [Team name]

---

## ✨ Final Notes

<!-- Любые дополнительные заметки для ревьюеров -->

**Важно**: 
- 
- 

**Вопросы для discussion**:
- 
- 

---

**Дата создания PR**: [Auto-filled by GitHub]  
**Target merge date**: [Deadline, если есть]

**Спасибо за ревью!** 🙏
