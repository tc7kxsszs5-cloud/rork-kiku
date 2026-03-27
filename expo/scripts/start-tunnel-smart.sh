#!/bin/bash
# Умный скрипт запуска tunnel с автоматическим fallback на LAN

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ID="d8v7u672uumlfpscvnbps"
SCHEME="rork-app"
MAX_RETRIES=2
TUNNEL_TIMEOUT=45

echo -e "${BLUE}🌐 Умный запуск с tunnel (с fallback на LAN)...${NC}"
echo ""

# Функция запуска tunnel
start_tunnel() {
    echo -e "${YELLOW}Попытка подключения tunnel (таймаут: ${TUNNEL_TIMEOUT}с)...${NC}"
    
    # Запускаем tunnel в фоне
    bunx rork start -p "$PROJECT_ID" --tunnel --scheme "$SCHEME" &
    local tunnel_pid=$!
    
    # Ждем подключения или таймаут
    local waited=0
    while [ $waited -lt $TUNNEL_TIMEOUT ]; do
        sleep 1
        waited=$((waited + 1))
        
        # Проверяем, жив ли процесс
        if ! kill -0 $tunnel_pid 2>/dev/null; then
            # Процесс завершился
            wait $tunnel_pid
            local exit_code=$?
            if [ $exit_code -eq 0 ]; then
                return 0
            else
                return 1
            fi
        fi
        
        # Если процесс работает больше 5 секунд, считаем успешным
        if [ $waited -ge 5 ]; then
            # Даем еще немного времени для стабилизации
            sleep 3
            if kill -0 $tunnel_pid 2>/dev/null; then
                echo -e "${GREEN}✅ Tunnel подключен${NC}"
                wait $tunnel_pid
                return 0
            fi
        fi
    done
    
    # Таймаут
    echo -e "${YELLOW}⚠️  Tunnel не подключился за ${TUNNEL_TIMEOUT} секунд${NC}"
    kill $tunnel_pid 2>/dev/null || true
    return 1
}

# Функция запуска LAN
start_lan() {
    echo -e "${BLUE}📡 Переключение на LAN режим...${NC}"
    echo -e "${GREEN}   Убедитесь, что устройство и компьютер в одной Wi-Fi сети${NC}"
    echo ""
    bunx rork start -p "$PROJECT_ID" --lan --scheme "$SCHEME"
}

# Основная логика
main() {
    # Остановка старых процессов
    echo -e "${YELLOW}🛑 Остановка старых процессов...${NC}"
    pkill -f "rork start" 2>/dev/null || true
    pkill -f "expo start" 2>/dev/null || true
    sleep 2
    
    # Попытка tunnel с retry
    for attempt in $(seq 1 $MAX_RETRIES); do
        if [ $attempt -gt 1 ]; then
            echo -e "${YELLOW}Повторная попытка $attempt из $MAX_RETRIES...${NC}"
            sleep 3
        fi
        
        if start_tunnel; then
            exit 0
        fi
    done
    
    # Если все попытки tunnel не удались - переключаемся на LAN
    echo ""
    echo -e "${RED}❌ Tunnel не подключился после $MAX_RETRIES попыток${NC}"
    echo -e "${YELLOW}🔄 Автоматическое переключение на LAN режим...${NC}"
    echo ""
    
    start_lan
}

# Обработка сигналов
trap 'echo -e "\n${YELLOW}⚠️  Прервано пользователем${NC}"; exit 130' INT TERM

# Запуск
main
