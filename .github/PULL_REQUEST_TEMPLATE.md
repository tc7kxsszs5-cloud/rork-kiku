# Pull Request

## Описание изменений

<!-- Кратко опишите что изменилось и почему -->

### Тип изменений
<!-- Отметьте галочкой применимые пункты -->

- [ ] 🐛 Bug fix (исправление ошибки)
- [ ] ✨ New feature (новая функциональность)
- [ ] 📝 Documentation (только документация)
- [ ] 🎨 UI/UX (изменения интерфейса)
- [ ] ⚡️ Performance (оптимизация производительности)
- [ ] ♻️ Refactoring (рефакторинг кода)
- [ ] 🔧 Configuration (изменение конфигурации)
- [ ] 🔒 Security (исправление уязвимости)
- [ ] 🧪 Tests (добавление/изменение тестов)
- [ ] 🚀 Deployment (изменения деплоя)

---

## Связанные Issue/Tasks

<!-- Укажите связанные issues -->
Closes #(issue_number)
Related to #(issue_number)

---

## Checklist перед merge

### Код и тестирование
- [ ] Код соответствует style guide проекта
- [ ] Добавлены/обновлены unit tests (если применимо)
- [ ] Добавлены/обновлены integration tests (если применимо)
- [ ] Все тесты проходят локально (`npm test`)
- [ ] Linting проходит без ошибок (`npm run lint`)
- [ ] TypeScript компилируется без ошибок (`npm run type-check`)
- [ ] Build проходит успешно (`npm run build`)

### Безопасность
- [ ] Не добавлены secrets, API keys, passwords в код
- [ ] Использованы environment variables для чувствительных данных
- [ ] Input validation добавлена для новых endpoints/форм
- [ ] Нет SQL injection уязвимостей
- [ ] Нет XSS уязвимостей
- [ ] Dependency audit чист (`npm audit`)
- [ ] Новые dependencies проверены на уязвимости

### Документация
- [ ] README обновлён (если изменилась функциональность)
- [ ] Комментарии добавлены для сложного кода
- [ ] API documentation обновлена (если изменились endpoints)
- [ ] Changelog обновлён (если applicable)
- [ ] Related docs обновлены в `/docs` (если applicable)

### Модерация и Child Safety (если применимо)
- [ ] Новый контент проходит модерацию
- [ ] Parental controls учтены
- [ ] Age-appropriate design следует guidelines
- [ ] Privacy policy compliance проверен
- [ ] COPPA/GDPR requirements соблюдены

### Deployment и Infrastructure (если применимо)
- [ ] Database migrations tested (если есть)
- [ ] Rollback plan готов
- [ ] Environment variables documented
- [ ] CI/CD pipeline обновлён (если нужно)
- [ ] Kubernetes manifests обновлены (если applicable)
- [ ] Terraform changes reviewed (если applicable)

---

## Инструкции по тестированию

<!-- Как reviewer может протестировать изменения? -->

### Setup
```bash
# Шаги для воспроизведения setup (если нужны)
```

### Test Steps
1. Шаг 1
2. Шаг 2
3. ...

### Expected Results
<!-- Что должно произойти? -->

---

## Screenshots/Recordings (для UI changes)

<!-- Добавьте скриншоты или GIF/видео для UI изменений -->

### Before
<!-- Screenshot before changes -->

### After
<!-- Screenshot after changes -->

---

## Deployment Plan (если applicable)

<!-- Опишите как будет задеплоено -->

- [ ] Deploy к staging сначала
- [ ] Manual verification на staging
- [ ] Deploy к production
- [ ] Monitoring после deploy (30 минут)
- [ ] Rollback plan готов

### Feature Flag
<!-- Используется ли feature flag? -->
- [ ] Yes - Feature flag: `FEATURE_NAME`
- [ ] No

### Database Migration
<!-- Есть ли database migrations? -->
- [ ] Yes - Migration file: `XXXXXX_migration_name.sql`
- [ ] No

---

## Performance Impact

<!-- Есть ли impact на performance? -->

- [ ] No performance impact
- [ ] Improved performance (describe how)
- [ ] Potential performance impact (describe и mitigation)

---

## Breaking Changes

<!-- Есть ли breaking changes? -->

- [ ] No breaking changes
- [ ] Yes - breaking changes (describe и migration guide)

---

## Reviewer Notes

<!-- Дополнительная информация для reviewers -->

### Areas to Focus
<!-- На что обратить особое внимание при review -->

### Known Issues/Limitations
<!-- Известные проблемы или ограничения этого PR -->

---

## Checklist для Reviewer

- [ ] Код review completed
- [ ] Логика изменений понятна и корректна
- [ ] Tests adequate и проходят
- [ ] Security concerns addressed
- [ ] Documentation adequate
- [ ] Performance acceptable
- [ ] No breaking changes (или documented)
- [ ] Approved для merge

---

## Post-Merge Actions

<!-- Действия после merge (если есть) -->

- [ ] Update related documentation
- [ ] Notify team в Slack
- [ ] Monitor metrics/logs
- [ ] Update project board/issues
- [ ] Announce feature (если applicable)

---

**Additional Comments:**
<!-- Любые дополнительные комментарии -->
