#!/bin/bash
# Продвинутый скрипт для организации оставшихся документов

cd "$(dirname "$0")/.." || exit

DOCS_DIR="docs"
ARCHIVE_DIR="$DOCS_DIR/archive"

echo "📁 Продолжаем организацию документов..."

# Функция для безопасного перемещения
move_file() {
    local file="$1"
    local target_dir="$2"
    
    if [ -f "$file" ] && [ ! -f "$target_dir/$(basename "$file")" ]; then
        mv "$file" "$target_dir/" 2>/dev/null && return 0
    fi
    return 1
}

# Категория: Development/Development guides
mkdir -p "$DOCS_DIR/development"
for file in *DEVELOPMENT*.md *DEVELOPER*.md *CONTRIBUTING*.md *WORKFLOW*.md *GUIDE*.md; do
    [ -f "$file" ] && move_file "$file" "$DOCS_DIR/development"
done

# Категория: Testing
mkdir -p "$DOCS_DIR/testing"
for file in *TEST*.md *JEST*.md *COVERAGE*.md *ТЕСТ*.md; do
    [ -f "$file" ] && move_file "$file" "$DOCS_DIR/testing"
done

# Категория: Design
mkdir -p "$DOCS_DIR/design"
for file in *DESIGN*.md *VISUAL*.md *UNIQUE*.md; do
    [ -f "$file" ] && move_file "$file" "$DOCS_DIR/design"
done

# Категория: Git/Version Control
mkdir -p "$DOCS_DIR/git"
for file in *GIT*.md *COMMIT*.md *GITHUB*.md *КОММИТ*.md; do
    [ -f "$file" ] && move_file "$file" "$DOCS_DIR/git"
done

# Категория: Status/Reports
mkdir -p "$DOCS_DIR/reports"
for file in *STATUS*.md *REPORT*.md *SUMMARY*.md *PROGRESS*.md *ОТЧЕТ*.md *СТАТУС*.md *СТАТИСТИКА*.md; do
    [ -f "$file" ] && move_file "$file" "$DOCS_DIR/reports"
done

# Категория: Features/Implementation
mkdir -p "$DOCS_DIR/features"
for file in *FEATURE*.md *IMPLEMENTATION*.md *PLAN*.md *ROADMAP*.md *ПЛАН*.md *ФУНКЦИЯ*.md; do
    [ -f "$file" ] && move_file "$file" "$DOCS_DIR/features"
done

# Категория: Security
mkdir -p "$DOCS_DIR/security"
for file in *SECURITY*.md *БЕЗОПАСНОСТЬ*.md *TOKEN*.md *AUTH*.md; do
    [ -f "$file" ] && move_file "$file" "$DOCS_DIR/security"
done

# Категория: AI/Integration
mkdir -p "$DOCS_DIR/ai"
for file in *AI*.md *INTEGRATION*.md *ИНТЕГРАЦИЯ*.md; do
    [ -f "$file" ] && move_file "$file" "$DOCS_DIR/ai"
done

# Категория: Configuration
mkdir -p "$DOCS_DIR/config"
for file in *CONFIG*.md *SETTINGS*.md *ENV*.md *VARIABLE*.md *ПЕРЕМЕННАЯ*.md *НАСТРОЙКА*.md; do
    [ -f "$file" ] && move_file "$file" "$DOCS_DIR/config"
done

# Категория: Documentation
mkdir -p "$DOCS_DIR/documentation"
for file in *DOCUMENTATION*.md *README*.md *EXPLANATION*.md *ОБЪЯСНЕНИЕ*.md; do
    [ -f "$file" ] && move_file "$file" "$DOCS_DIR/documentation"
done

# Перемещаем TXT файлы с командами в archive
for file in *.txt; do
    if [ -f "$file" ]; then
        case "$file" in
            *COMMAND*.txt|*КОМАНД*.txt)
                move_file "$file" "$ARCHIVE_DIR"
                ;;
            *)
                # Другие TXT файлы (email шаблоны уже в папках)
                if [ ! -d "INVESTOR_OUTREACH" ] && [ ! -d "PARTNERSHIP_OUTREACH" ]; then
                    move_file "$file" "$ARCHIVE_DIR"
                fi
                ;;
        esac
    fi
done

# Перемещаем временные/дублирующиеся файлы в archive
for file in *TEMP*.md *TMP*.md *BACKUP*.md *OLD*.md *DUPLICATE*.md *ФИНАЛЬНЫЙ*.md *ФИНАЛ*.md; do
    [ -f "$file" ] && move_file "$file" "$ARCHIVE_DIR"
done

# Перемещаем файлы с общими названиями, которые могут быть дубликатами
for file in *ВАРИАНТ*.md *АЛЬТЕРНАТИВ*.md *БЫСТР*.md *ПРОСТ*.md; do
    [ -f "$file" ] && {
        # Проверяем размер - маленькие файлы вероятно дубликаты
        size=$(stat -f%z "$file" 2>/dev/null || echo 0)
        if [ "$size" -lt 1000 ]; then
            move_file "$file" "$ARCHIVE_DIR"
        fi
    }
done

echo ""
echo "✅ Продвинутая организация завершена!"
echo "📊 Статистика:"
echo "   - Всего файлов в docs: $(find "$DOCS_DIR" -type f | wc -l | tr -d ' ')"
echo "   - Осталось в корне: $(ls -1 *.md 2>/dev/null | wc -l | tr -d ' ')"
