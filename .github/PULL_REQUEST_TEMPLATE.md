# Pull Request

## Описание

### Цель изменений
<!-- Кратко опишите, что делает этот PR -->


### Изменения
<!-- Список основных изменений -->

- 
- 
- 

### Связанные Issue/Tasks
<!-- Ссылки на related issues, tasks, или документы -->

- Closes #
- Related to #


---

## Чеклист

### Код

- [ ] Код написан и протестирован локально
- [ ] Lint проходит без ошибок (`bun run lint`)
- [ ] TypeScript type check проходит (`bunx tsc --noEmit`)
- [ ] Нет `console.log` в production коде (использовать logger)
- [ ] Code reviewed самостоятельно перед созданием PR

### Тесты

- [ ] Добавлены unit tests (если применимо)
- [ ] Добавлены integration tests (если применимо)
- [ ] Все существующие тесты проходят
- [ ] Manual testing выполнен
- [ ] Edge cases протестированы

### Документация

- [ ] README обновлен (если нужно)
- [ ] API documentation обновлена (если изменился API)
- [ ] Комментарии добавлены для сложной логики
- [ ] `/docs` обновлены (если изменилась архитектура или функционал)

### Security Checklist

- [ ] **Нет hardcoded secrets** (API keys, passwords, tokens)
- [ ] **Input validation** на всех user inputs
- [ ] **SQL injection protection** (prepared statements, ORM)
- [ ] **XSS protection** (sanitize output)
- [ ] **CSRF protection** (если web endpoints)
- [ ] **Authentication проверена** (токены валидируются)
- [ ] **Authorization проверена** (RBAC, permissions)
- [ ] **Sensitive data encrypted** (в transit и at rest)
- [ ] **PII (Personal Identifiable Information) минимизирована**
- [ ] **COPPA compliance** (если затрагивает детские данные)

### Deployment

- [ ] Миграции базы данных (если нужны) добавлены
- [ ] Environment variables документированы (в `.env.example`)
- [ ] Rollback plan продуман
- [ ] Monitoring/alerting настроен (если новая критичная функция)
- [ ] Инструкции по deployment добавлены (если сложный процесс)

---

## Testing Instructions

### Как протестировать этот PR

<!-- Детальные инструкции для reviewer -->

**Prerequisites**:
- 
- 

**Steps**:
1. 
2. 
3. 

**Expected Result**:
- 

**Screenshots** (если UI изменения):
<!-- Добавьте screenshots -->


---

## Дополнительная информация

### Performance Impact
<!-- Влияние на performance (если есть) -->

- Latency: 
- Memory usage: 
- Database queries: 

### Breaking Changes
<!-- Есть ли breaking changes? Как миgrировать? -->

- [ ] Нет breaking changes
- [ ] Breaking changes (опишите ниже):


### Dependencies
<!-- Новые dependencies добавлены? -->

- [ ] Нет новых dependencies
- [ ] Новые dependencies (список ниже):
  - 
  - 

**Security check**: Новые dependencies проверены на vulnerabilities (см. `/docs/infra/ci_cd.md`)

---

## Review Checklist (для reviewer)

### Code Quality

- [ ] Code читаемый и понятный
- [ ] Нет дублирования кода (DRY принцип)
- [ ] Naming conventions соблюдены
- [ ] Архитектура соответствует проекту
- [ ] Error handling адекватный

### Security Review

- [ ] Security checklist проверен
- [ ] Нет очевидных security vulnerabilities
- [ ] Sensitive data защищена
- [ ] Authentication/Authorization корректны

### Testing

- [ ] Тесты покрывают новый функционал
- [ ] Manual testing выполнен reviewer'ом
- [ ] Edge cases рассмотрены

### Documentation

- [ ] Документация достаточна для понимания изменений
- [ ] API changes документированы
- [ ] Breaking changes ясно описаны

---

## Deployment Plan

### Pre-deployment

- [ ] Backup database (если требуется)
- [ ] Notify team о deployment
- [ ] Schedule maintenance window (если downtime)

### Deployment Steps

1. 
2. 
3. 

### Post-deployment

- [ ] Verify deployment успешен
- [ ] Monitor logs и metrics (первые 30 минут)
- [ ] Rollback plan ready (если что-то пойдет не так)

---

## Связанные документы

<!-- Ссылки на related documents в /docs -->

- 
- 

---

## Комментарии для reviewer

<!-- Дополнительные комментарии, вопросы для reviewer -->


---

**Автор**: @<!-- ваш GitHub username -->  
**Дата**: <!-- YYYY-MM-DD -->  
**Branch**: <!-- feature/your-branch-name -->

---

## Post-Merge Actions

<!-- Что нужно сделать после merge -->

- [ ] Update documentation
- [ ] Notify stakeholders
- [ ] Deploy to staging
- [ ] Deploy to production (after QA approval)
- [ ] Close related issues

---

**Примечание**: Этот PR template призван помочь создать качественные и безопасные PRs. Пожалуйста, заполните все применимые разделы.

**Security**: Если обнаружили security vulnerability, НЕ создавайте публичный PR. Свяжитесь с security team напрямую.
