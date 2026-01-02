## 📝 Описание изменений

<!-- Краткое описание: что делает этот PR и почему -->

### Цель PR
<!-- Например: Добавление новой функции, исправление бага, улучшение документации -->

### Изменения
<!-- Список основных изменений -->
- 
- 
- 

### Связанные Issues
<!-- Ссылки на related issues, если есть -->
Fixes #
Related to #

---

## ✅ Чеклист

### Общее
- [ ] Код соответствует code style проекта
- [ ] Все новые и существующие тесты проходят
- [ ] Документация обновлена (если применимо)
- [ ] Commit messages понятные и описательные
- [ ] PR description заполнен полностью

### Тестирование
- [ ] Добавлены unit tests для новой функциональности
- [ ] Добавлены integration tests (если применимо)
- [ ] Тесты покрывают edge cases
- [ ] Ручное тестирование выполнено

### Security Checklist
- [ ] Нет hardcoded secrets (API keys, passwords, tokens)
- [ ] Input validation добавлена где необходимо
- [ ] Authentication/authorization проверены
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Sensitive data properly masked/encrypted
- [ ] Dependencies проверены на известные уязвимости

### Код
- [ ] Код проходит linter без warnings
- [ ] No console.log или debug statements в production code
- [ ] Error handling добавлен корректно
- [ ] Code review self-performed

### Mobile-Specific (если применимо)
- [ ] Работает на iOS (указать версию: ___ )
- [ ] Работает на Android (указать версию: ___ )
- [ ] UI responsive на разных screen sizes
- [ ] Offline functionality tested (если применимо)
- [ ] Performance проверен (нет memory leaks, лагов)

### Backend-Specific (если применимо)
- [ ] Database migrations созданы (если нужны)
- [ ] API endpoints документированы
- [ ] Rate limiting добавлен (если applicable)
- [ ] Logging добавлен для критичных операций

### Документация
- [ ] README обновлён (если добавлена новая функциональность)
- [ ] API documentation обновлена
- [ ] Comments добавлены для сложной логики
- [ ] Changelog обновлён (если применимо)

---

## 🧪 Как протестировать

<!-- Шаги для тестирования этого PR -->

### Prerequisites
<!-- Что нужно для тестирования -->
- 
- 

### Шаги
1. 
2. 
3. 

### Ожидаемый результат
<!-- Что должно произойти после тестирования -->


---

## 📸 Screenshots / Videos

<!-- Добавьте screenshots или screen recordings для UI changes -->

### Before
<!-- Скриншот до изменений (если applicable) -->

### After
<!-- Скриншот после изменений -->

---

## 🚀 Deployment Notes

<!-- Любые специальные инструкции для deployment -->

### Environment Variables
<!-- Новые или изменённые environment variables -->
- 

### Database Migrations
<!-- Если требуются database migrations -->
- [ ] Migrations созданы
- [ ] Tested на staging
- [ ] Rollback plan готов

### Dependencies
<!-- Новые dependencies добавлены -->
- 

### Configuration Changes
<!-- Изменения в конфигурации -->
- 

---

## ⚠️ Breaking Changes

<!-- Есть ли breaking changes? Описать -->

- [ ] Нет breaking changes
- [ ] Есть breaking changes (описать ниже)

<!-- Если есть breaking changes: -->
### Impact
<!-- Кто и что будет affected -->

### Migration Guide
<!-- Как мигрировать на новую версию -->

---

## 📚 Связанная документация

<!-- Ссылки на relevant docs -->
- [Документация](../docs/)
- [Architecture](../docs/architecture/architecture.md)
- [API Docs]()

---

## 🔍 Code Review Focus Areas

<!-- На что reviewers должны обратить особое внимание -->
- 
- 

---

## 📋 DCO / Sign-off

<!-- Developer Certificate of Origin -->

By submitting this pull request, I confirm that my contribution is made under the terms of the project's license and that I have the right to submit it.

Signed-off-by: [Your Name] <[your.email@example.com]>

<!-- Альтернатива: добавить в commit message: git commit -s -->

---

## 💬 Additional Notes

<!-- Любые дополнительные комментарии, concerns, или вопросы -->


---

**Reviewer Guidelines:**
1. Review код на соответствие style guide
2. Проверить test coverage
3. Проверить security considerations
4. Протестировать изменения локально (если возможно)
5. Verify documentation updated
6. Approve или request changes с clear feedback

**Для maintainers:**
- [ ] PR approved by at least 1 reviewer
- [ ] All CI checks passed
- [ ] No merge conflicts
- [ ] Ready to merge
