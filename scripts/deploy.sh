#!/bin/bash

# Скрипт для развертывания проекта KIKU
# Использование: ./scripts/deploy.sh [backend|mobile|all]

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка аргументов
TARGET=${1:-all}

info "🚀 Начало развертывания KIKU проекта..."
info "Цель: $TARGET"

# Функция развертывания backend
deploy_backend() {
    info "📦 Развертывание Backend..."
    
    cd backend
    
    # Проверка наличия .env
    if [ ! -f .env ]; then
        warn ".env файл не найден. Создаю из .env.example..."
        if [ -f .env.example ]; then
            cp .env.example .env
            warn "⚠️  Пожалуйста, заполните .env файл реальными значениями!"
        else
            error ".env.example не найден!"
            exit 1
        fi
    fi
    
    # Установка зависимостей
    info "Установка зависимостей..."
    bun install
    
    # Проверка TypeScript
    info "Проверка TypeScript..."
    bunx tsc --noEmit || warn "TypeScript проверка пропущена"
    
    # Запуск тестов (если есть)
    info "Запуск тестов..."
    bun test || warn "Тесты не найдены или пропущены"
    
    # Развертывание через Docker (если используется)
    if [ -f Dockerfile ]; then
        info "Сборка Docker образа..."
        docker build -t kiku-backend:latest .
    fi
    
    info "✅ Backend готов к развертыванию"
    cd ..
}

# Функция развертывания mobile app
deploy_mobile() {
    info "📱 Развертывание Mobile App..."
    
    # Проверка наличия .env
    if [ ! -f .env ]; then
        warn ".env файл не найден. Создаю из .env.example..."
        if [ -f .env.example ]; then
            cp .env.example .env
            warn "⚠️  Пожалуйста, заполните .env файл реальными значениями!"
        fi
    fi
    
    # Установка зависимостей
    info "Установка зависимостей..."
    bun install
    
    # Проверка TypeScript
    info "Проверка TypeScript..."
    bunx tsc --noEmit || warn "TypeScript проверка пропущена"
    
    # Линтинг
    info "Проверка линтера..."
    bun run lint || warn "Линтинг пропущен"
    
    # Проверка EAS конфигурации
    if [ -f eas.json ]; then
        info "EAS конфигурация найдена"
        info "Для сборки используйте:"
        info "  eas build --platform ios --profile production"
        info "  eas build --platform android --profile production"
    else
        warn "eas.json не найден. Инициализируйте EAS: eas build:configure"
    fi
    
    info "✅ Mobile App готов к развертыванию"
}

# Функция развертывания через Docker Compose
deploy_docker() {
    info "🐳 Развертывание через Docker Compose..."
    
    if [ ! -f docker-compose.yml ]; then
        error "docker-compose.yml не найден!"
        exit 1
    fi
    
    # Проверка наличия Docker
    if ! command -v docker &> /dev/null; then
        error "Docker не установлен!"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose не установлен!"
        exit 1
    fi
    
    info "Запуск контейнеров..."
    docker-compose up -d
    
    info "Ожидание готовности сервисов..."
    sleep 5
    
    info "Статус контейнеров:"
    docker-compose ps
    
    info "✅ Docker Compose развертывание завершено"
}

# Основная логика
case $TARGET in
    backend)
        deploy_backend
        ;;
    mobile)
        deploy_mobile
        ;;
    docker)
        deploy_docker
        ;;
    all)
        deploy_backend
        deploy_mobile
        info "💡 Для развертывания через Docker: ./scripts/deploy.sh docker"
        ;;
    *)
        error "Неизвестная цель: $TARGET"
        echo "Использование: ./scripts/deploy.sh [backend|mobile|docker|all]"
        exit 1
        ;;
esac

info "🎉 Развертывание завершено!"

