#!/bin/bash
# Умный скрипт запуска с автоматическим fallback на LAN при ошибке tunnel

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_ID="d8v7u672uumlfpscvnbps"
SCHEME="rork-app"

echo -e "${BLUE}🚀 Запуск KIKU проекта...${NC}"
echo ""

# Функция для проверки CocoaPods (не критично для Expo Go)
check_cocoapods() {
    if ! command -v pod &> /dev/null; then
        echo -e "${YELLOW}⚠️  CocoaPods не установлен${NC}"
        echo -e "${YELLOW}   Это не критично для Expo Go разработки${NC}"
        echo -e "${YELLOW}   CocoaPods нужен только для нативных iOS сборок${NC}"
        echo ""
        echo -e "${BLUE}   Для установки CocoaPods (опционально):${NC}"
        echo -e "   ${YELLOW}sudo gem install cocoapods${NC}"
        echo -e "   ${YELLOW}или: brew install cocoapods${NC}"
        echo ""
        return 0  # Не критично, продолжаем
    else
        # Проверяем, работает ли CocoaPods (может быть установлен, но с проблемами)
        if pod --version >/dev/null 2>&1; then
            echo -e "${GREEN}✅ CocoaPods найден: $(pod --version 2>/dev/null || echo 'установлен')${NC}"
        else
            echo -e "${YELLOW}⚠️  CocoaPods установлен, но есть проблемы с зависимостями${NC}"
            echo -e "${YELLOW}   Это не критично для Expo Go разработки${NC}"
            echo ""
        fi
        return 0
    fi
}

# Функция запуска с LAN (более надежный вариант)
start_with_lan() {
    echo -e "${BLUE}📡 Запуск с LAN подключением...${NC}"
    echo -e "${GREEN}   Убедитесь, что устройство и компьютер в одной Wi-Fi сети${NC}"
    echo ""
    
    bunx rork start -p "$PROJECT_ID" --lan --scheme "$SCHEME"
}

# Основная логика
main() {
    # Проверка CocoaPods (не блокирующая, игнорируем ошибки)
    check_cocoapods 2>/dev/null || true
    
    # Остановка старых процессов
    echo -e "${YELLOW}🛑 Остановка старых процессов...${NC}"
    pkill -f "rork start" 2>/dev/null || true
    pkill -f "expo start" 2>/dev/null || true
    sleep 2
    
    # Используем LAN по умолчанию (более надежно)
    # Tunnel часто не работает из-за таймаутов ngrok
    echo -e "${YELLOW}💡 Используется LAN режим (более надежный)${NC}"
    echo -e "${YELLOW}   Для tunnel используйте: bun run start:rork:tunnel${NC}"
    echo ""
    
    start_with_lan
}

# Обработка сигналов
trap 'echo -e "\n${YELLOW}⚠️  Прервано пользователем${NC}"; exit 130' INT TERM

# Запуск
main
