#!/bin/bash
# Запуск tunnel с увеличенным таймаутом

PROJECT_ID="d8v7u672uumlfpscvnbps"
SCHEME="rork-app"

# Увеличиваем таймаут до 60 секунд
export EXPO_TUNNEL_TIMEOUT=60000

echo "🌐 Запуск с tunnel (таймаут: 60 секунд)..."
echo ""

bunx rork start -p "$PROJECT_ID" --tunnel --scheme "$SCHEME"
