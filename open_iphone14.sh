#!/bin/bash
echo "🚀 Запускаю iPhone 14 симулятор..."

# Попытка запуска по имени
xcrun simctl boot "iPhone 14" 2>&1

# Открыть Simulator
open -a Simulator

sleep 2
echo ""
echo "✅ Симулятор должен открыться!"
echo ""
echo "Если iPhone 14 не появился:"
echo "1. В Simulator: File → Open Simulator → iPhone 14"
echo "2. Или запустите: xcrun simctl list devices"
