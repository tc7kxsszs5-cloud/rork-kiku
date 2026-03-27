#!/bin/bash
# Скрипт для коммита GitHub Community Standards файлов

echo "🚀 Добавление файлов GitHub Community Standards..."

# Добавляем основные файлы
git add CONTRIBUTING.md
git add SECURITY.md
git add CODE_OF_CONDUCT.md

# Добавляем GitHub templates
git add .github/pull_request_template.md
git add .github/ISSUE_TEMPLATE/bug_report.md
git add .github/ISSUE_TEMPLATE/feature_request.md
git add .github/ISSUE_TEMPLATE/question.md
git add .github/ISSUE_TEMPLATE/config.yml

# Добавляем обновленный чеклист
git add GITHUB_COMMUNITY_STANDARDS_CHECKLIST.md

echo "✅ Файлы добавлены в staging area"
echo ""
echo "📋 Статус:"
git status --short | grep -E "(CONTRIBUTING|SECURITY|CODE_OF_CONDUCT|\.github|GITHUB_COMMUNITY_STANDARDS)"

echo ""
echo "💾 Для создания коммита выполните:"
echo "git commit -m 'docs: добавить GitHub Community Standards (CONTRIBUTING, SECURITY, templates)'"
echo ""
echo "🚀 Для отправки в репозиторий выполните:"
echo "git push origin main"
echo "# или если ваша ветка называется по-другому:"
echo "git push origin \$(git branch --show-current)"
