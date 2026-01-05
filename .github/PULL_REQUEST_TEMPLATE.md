# Pull Request

## Описание

<!-- Кратко опишите цель этого PR -->

## Тип изменений

- [ ] 🐛 Bug fix (исправление бага)
- [ ] ✨ New feature (новая функциональность)
- [ ] 📝 Documentation (документация)
- [ ] 🎨 Style (форматирование, отступы, без изменения логики)
- [ ] ♻️ Refactoring (рефакторинг без изменения функциональности)
- [ ] ⚡ Performance (улучшение производительности)
- [ ] ✅ Tests (добавление или исправление тестов)
- [ ] 🔧 Config (изменение конфигурации)
- [ ] 🔒 Security (исправление security vulnerabilities)

## Изменения

<!-- Подробно опишите что изменилось -->

### Основные изменения:
- 
- 
- 

### Затронутые компоненты:
- 
- 

## Связанные Issue

<!-- Укажите номер issue, если применимо -->

Closes #
Relates to #

## Как протестировать

<!-- Пошаговая инструкция для тестирования изменений -->

1. 
2. 
3. 

## Screenshots (если применимо)

<!-- Добавьте скриншоты для UI changes -->

## Checklist

### Обязательно (перед merge)

- [ ] Код follows project style guide
- [ ] Self-review выполнен
- [ ] Комментарии добавлены где необходимо
- [ ] Документация обновлена (если нужно)
- [ ] Изменения не ломают существующую функциональность
- [ ] Новый код имеет тесты (если применимо)
- [ ] Все тесты проходят локально

### Security Checklist

- [ ] Нет hardcoded secrets (API keys, passwords, tokens)
- [ ] Входные данные валидируются
- [ ] SQL injection prevention (если применимо)
- [ ] XSS prevention (если применимо)
- [ ] CSRF protection (если применимо)
- [ ] Sensitive data encrypted (если применимо)
- [ ] Audit logs добавлены (если изменения critical)
- [ ] No new security vulnerabilities introduced

### Code Quality

- [ ] Lint passed (`bun run lint`)
- [ ] Type check passed (`bunx tsc --noEmit`)
- [ ] Tests passed (`bun test`)
- [ ] Build successful (`bun run build` если applicable)
- [ ] Code coverage acceptable (> 70% для new code)

### Mobile Specific (если iOS/Android changes)

- [ ] Tested на iOS simulator/device
- [ ] Tested на Android simulator/device
- [ ] No performance degradation
- [ ] UI matches design mockups
- [ ] Accessibility considerations

### Backend Specific (если backend changes)

- [ ] API documentation updated
- [ ] Database migrations tested
- [ ] Backwards compatible (или migration plan)
- [ ] Performance tested (latency, throughput)
- [ ] Error handling appropriate
- [ ] Logging added

## Deployment Notes

<!-- Инструкции для deployment, если нужны -->

### Pre-deployment:
- 

### Post-deployment:
- 

### Rollback plan:
- 

## Additional Notes

<!-- Любая дополнительная информация для reviewers -->

## DCO / Sign-off

By submitting this pull request, I confirm that:
- [ ] My contribution is made under the project's license (MIT)
- [ ] I have the right to submit this contribution
- [ ] I agree to the Developer Certificate of Origin (DCO)

<!-- 
Developer Certificate of Origin (DCO):
By making a contribution to this project, I certify that:
(a) The contribution was created in whole or in part by me and I have the right to submit it under the license indicated in the file; or
(b) The contribution is based upon previous work that, to the best of my knowledge, is covered under an appropriate license and I have the right under that license to submit that work with modifications; or
(c) The contribution was provided directly to me by some other person who certified (a), (b) or (c) and I have not modified it.
-->

---

## For Reviewers

### Review Checklist

- [ ] Code quality acceptable
- [ ] Tests adequate
- [ ] Documentation updated
- [ ] Security considerations addressed
- [ ] No breaking changes (или properly communicated)
- [ ] Performance impact acceptable
- [ ] Ready to merge

### Feedback

<!-- Reviewers: добавьте ваш feedback здесь -->

---

**Assignees:** @
**Reviewers:** @
**Labels:** 

<!-- 
Рекомендуемые labels:
- bug
- enhancement
- documentation
- security
- performance
- breaking-change
- needs-testing
- ready-to-merge
-->
