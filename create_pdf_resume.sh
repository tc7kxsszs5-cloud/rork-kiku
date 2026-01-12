#!/bin/bash

# Скрипт для создания PDF из HTML резюме

HTML_FILE="PROJECT_RESUME.html"
PDF_FILE="$HOME/Desktop/KIDS_by_KIKU_Resume.pdf"

echo "🔄 Конвертация HTML в PDF..."

# Проверяем, установлен ли wkhtmltopdf или можем ли использовать Python
if command -v wkhtmltopdf &> /dev/null; then
    echo "✅ Используем wkhtmltopdf..."
    wkhtmltopdf --page-size A4 --margin-top 20mm --margin-bottom 20mm --margin-left 20mm --margin-right 20mm "$HTML_FILE" "$PDF_FILE"
    echo "✅ PDF создан: $PDF_FILE"
    exit 0
fi

# Пробуем использовать Python с мызы или просто открываем браузер
if command -v python3 &> /dev/null; then
    echo "ℹ️  Используем альтернативный метод..."
    # Создаем временный Python скрипт
    python3 << EOF
import os
import subprocess

html_file = "$HTML_FILE"
pdf_file = "$PDF_FILE"

# Используем AppleScript для открытия и сохранения через браузер
script = f'''
tell application "Safari"
    activate
    open file "file://{os.path.abspath(html_file)}"
    delay 2
    tell application "System Events"
        keystroke "p" using {{command down}}
        delay 1
        keystroke "s" using {{command down}}
        delay 1
        keystroke "G" using {{command down, shift down}}
        delay 1
        keystroke "{pdf_file}"
        delay 1
        keystroke return
        delay 2
        keystroke return
        delay 1
    end tell
end tell
'''

print("⚠️  Автоматическая конвертация требует ручного действия.")
print("📋 Инструкция:")
print("1. HTML файл уже открыт в браузере")
print("2. Нажмите Cmd+P (или File -> Print)")
print("3. В левом нижнем углу нажмите 'Save as PDF'")
print("4. Сохраните файл на рабочем столе как: KIDS_by_KIKU_Resume.pdf")
print("")
print("Или установите wkhtmltopdf для автоматической конвертации:")
print("brew install wkhtmltopdf")
EOF
    exit 0
fi

echo "⚠️  Для автоматической конвертации установите wkhtmltopdf:"
echo "   brew install wkhtmltopdf"
echo ""
echo "📋 Или используйте браузер:"
echo "1. Откройте $HTML_FILE в браузере"
echo "2. Нажмите Cmd+P"
echo "3. Выберите 'Save as PDF'"
echo "4. Сохраните на рабочем столе"


