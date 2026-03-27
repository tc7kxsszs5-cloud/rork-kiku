#!/bin/bash

# Скрипт для организации документов проекта KIKU
# Перемещает файлы из корня в соответствующие папки docs/

cd "$(dirname "$0")/.." || exit 1

echo "📚 Организация документов проекта KIKU..."
echo ""

# Создаем структуру папок
mkdir -p docs/{setup,troubleshooting,development,business,security,testing,deployment,architecture,ai,git,sql,archive/temp,reports,features}

# Функция для перемещения файлов
move_file() {
    local file=$1
    local dest=$2
    if [ -f "$file" ]; then
        mv "$file" "$dest/"
        echo "✅ $file -> $dest/"
    fi
}

# === SETUP (Настройка и установка) ===
echo "📁 Организация SETUP документов..."
for file in \
    "БЫСТРЫЙ_СТАРТ"*.md \
    "OPEN_IPHONE14"*.md \
    "RUN_IOS_SIMULATOR"*.md \
    "SETUP"*.md \
    "INSTALL"*.md \
    "QUICK_START"*.md \
    "QUICKSTART"*.md \
    "START"*.md \
    "БЫСТРОЕ_СОЗДАНИЕ_ПРОЕКТА"*.md \
    "ГДЕ_ВЫПОЛНЯТЬ_КОМАНДЫ"*.md \
    "ИСПОЛЬЗОВАНИЕ_ПАРОЛЯ_ОТ_MAC"*.md \
    "ПРОСТОЙ_ПАРОЛЬ"*.md \
    "ПРОСТОЙ_ВАРИАНТ_ПАРОЛЬ"*.md \
    "СГЕНЕРИРОВАННЫЙ_ПАРОЛЬ"*.md \
    "ГДЕ_НАЙТИ_И_ВСТАВИТЬ_ПАРОЛЬ"*.md \
    "ЧТО_ТАКОЕ_YOUR_PASSWORD"*.md \
    "ADD_PROJECT_ID_INSTRUCTIONS"*.md \
    "PROJECT_ID_ADDED"*.md \
    "AUTO_LANGUAGE_DETECTION"*.md \
    "SOUND_NOTIFICATIONS"*.md \
    "EAS_BUILD_COMMANDS"*.md; do
    [ -f "$file" ] && move_file "$file" "docs/setup"
done

# === TROUBLESHOOTING (Решение проблем) ===
echo "🔧 Организация TROUBLESHOOTING документов..."
for file in \
    "ЧТО_ДЕЛАТЬ_ЕСЛИ_НЕ_РАБОТАЕТ"*.md \
    "ПРИЧИНЫ_ПРОБЛЕМ_И_РЕШЕНИЯ"*.md \
    "ИСПРАВЛЕНИЯ_ОШИБОК"*.md \
    "АНАЛИЗ_И_ИСПРАВЛЕНИЯ"*.md \
    "ПОПРОБУЙТЕ_ЭТИ_ВАРИАНТЫ"*.md \
    "ПОПРОБУЙТЕ_ЭТИ_РЕГИОНЫ"*.md \
    "АЛЬТЕРНАТИВНЫЕ_ПОДХОДЫ"*.md \
    "КАК_ОЧИСТИТЬ_РЕДАКТОР"*.md \
    "HOW_TO_STOP_COPILOT"*.md \
    "WHAT_WE_DID_WRONG"*.md; do
    [ -f "$file" ] && move_file "$file" "docs/troubleshooting"
done

# === DEVELOPMENT (Разработка) ===
echo "💻 Организация DEVELOPMENT документов..."
for file in \
    "ОРГАНИЗАЦИЯ_НОРМАЛЬНОЙ_РАБОТЫ"*.md \
    "КАК_АВТОМАТИЗИРОВАТЬ"*.md \
    "ИСПОЛЬЗОВАНИЕ_SHARED_POOLER"*.md \
    "ПРИМЕНЕНИЕ_ПЕРЕМЕННЫХ"*.md \
    "ОБНОВЛЕНИЕ_ПЕРЕМЕННЫХ"*.md \
    "ИСПОЛЬЗОВАНИЕ_SERVICE_ROLE_KEY"*.md \
    "WHEN_TO_UPDATE_VERSIONS"*.md \
    "HOW_TO_ADD_TO_REPOSITORY"*.md \
    "HOW_TO_FIND_VIDEO_ID"*.md \
    "COMMANDS_QUICK_CHECK"*.md \
    "КОМАНДЫ_СБРОСА"*.md \
    "КОМАНДЫ_С_ПРАВИЛЬНЫМ_REF"*.md \
    "ПРАВИЛЬНОЕ_КОПИРОВАНИЕ"*.md \
    "БЫСТРАЯ_КОМАНДА_POOLING"*.md \
    "БЫСТРЫЕ_КОМАНДЫ_SDK"*.md \
    "НАВЫКИ_ДЛЯ_БЕЗУПРЕЧНОЙ_РАБОТЫ"*.md \
    "АНАЛИЗ_КАЧЕСТВА_КОДА"*.md \
    "QUALITY_CONTROL"*.md; do
    [ -f "$file" ] && move_file "$file" "docs/development"
done

# === SECURITY (Безопасность) ===
echo "🔒 Организация SECURITY документов..."
for file in \
    "ПРОВЕРКА_БЕЗОПАСНОСТИ"*.md \
    "БЫСТРЫЙ_СТАРТ_БЕЗОПАСНОСТИ"*.md \
    "ЗАЩИТА_ОТ_ВЗЛОМОВ"*.md \
    "СООТВЕТСТВИЕ_ЗАКОНАМ_ТЕХАСА"*.md \
    "ВАЖНО_ПРОЧИТАТЬ"*.md; do
    [ -f "$file" ] && move_file "$file" "docs/security"
done

# === SQL (SQL скрипты и инструкции) ===
echo "🗄️ Организация SQL документов..."
for file in \
    "ГОТОВЫЙ_SQL_СКРИПТ"*.md \
    "ЗАЧЕМ_НУЖНЫ_SQL_ПОЛИТИКИ"*.md \
    "УПРОЩЕННАЯ_РЕГИСТРАЦИЯ_КОД"*.md \
    "СКОПИРОВАТЬ_ЭТОТ_SQL"*.txt; do
    [ -f "$file" ] && move_file "$file" "docs/sql"
done

# === BUSINESS (Бизнес материалы) ===
echo "💼 Организация BUSINESS документов..."
for file in \
    "PROJECT_PROMOTION"*.md \
    "PROMOTION_CHECKLIST"*.md \
    "PRESS_KIT"*.md \
    "FOUNDER_RESUME"*.md \
    "PROJECT_RESUME"*.md \
    "PROJECT_NAMING"*.md \
    "KPI_DASHBOARD_STEP_BY_STEP"*.md \
    "GLOBAL_EXPANSION_STRATEGY"*.md \
    "NEXT_STEPS_REPOSITORY"*.md \
    "KOMU_NAPRAVIT_PROEKT"*.md; do
    [ -f "$file" ] && move_file "$file" "docs/business"
done

# === REPORTS (Отчеты и статусы) ===
echo "📊 Организация REPORTS документов..."
for file in \
    "ИТОГОВАЯ_ПРОВЕРКА"*.md \
    "РЕЗУЛЬТАТЫ_ПРОВЕРКИ"*.md \
    "ПРОВЕРКА_ЗАВЕРШЕНА"*.md \
    "УСПЕШНО_ПРИМЕНЕНО"*.md \
    "ТАБЛИЦЫ_СОЗДАНЫ"*.md \
    "УСПЕШНОЕ_ПОДКЛЮЧЕНИЕ"*.md \
    "УСПЕХ_ПОДКЛЮЧЕНИЕ_РАБОТАЕТ"*.md \
    "ОБНОВЛЕНИЕ_ROUTES_ЗАВЕРШЕНО"*.md \
    "ГОТОВ_ПРЕОБРАЗОВАТЬ"*.md \
    "ПОДТВЕРЖДЕНИЕ_УДАЛЕНИЯ"*.md \
    "ВСЕ_ИСПРАВЛЕНИЯ_СДЕЛАНЫ"*.md \
    "КАК_РАБОТАЕТ_СИСТЕМА"*.md \
    "SYSTEM_OVERVIEW"*.md \
    "ЧТО_ПОСМОТРЕТЬ_В_ПРИЛОЖЕНИИ"*.md; do
    [ -f "$file" ] && move_file "$file" "docs/reports"
done

# === ARCHIVE (Временные и устаревшие) ===
echo "📦 Организация ARCHIVE документов..."
for file in \
    "ОЖИДАЮ_REFERENCE_ID"*.md \
    "ВОЗВРАТ_К_ОСНОВНОЙ_ЗАДАЧЕ"*.md \
    "FINAL_SOLUTION"*.md \
    "NUCLEAR_OPTION_FINAL"*.md \
    "НАЙТИ_РЕЗЮМЕ"*.txt \
    "ISSUE_4_COMMENT"*.txt; do
    [ -f "$file" ] && move_file "$file" "docs/archive/temp"
done

# Перемещаем .txt файлы с командами в archive
for file in *.txt; do
    if [ -f "$file" ] && [[ "$file" != "README.txt" ]]; then
        move_file "$file" "docs/archive/temp"
    fi
done

echo ""
echo "✅ Организация завершена!"
echo ""
echo "📋 Оставшиеся файлы в корне (основные документы):"
ls -1 *.md 2>/dev/null | head -20
