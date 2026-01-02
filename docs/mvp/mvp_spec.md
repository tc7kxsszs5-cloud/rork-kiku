# MVP Спецификация для пилота Rork-Kiku

## Обзор MVP

MVP (Minimum Viable Product) для iOS TestFlight пилота включает базовый функционал безопасного обмена контентом для детей с родительским контролем и модерацией на основе ML.

## Цели MVP

1. **Валидация гипотезы**: проверить, что родители хотят использовать платформу для безопасного обмена контентом
2. **Сбор feedback**: получить отзывы от ранних пользователей
3. **Тестирование ML-модели**: оценить качество автоматической модерации
4. **Подготовка к Seed раунду**: продемонстрировать traction инвесторам

## Целевая аудитория пилота

- **Родители**: 25-45 лет, технически подкованные, заботятся о digital safety
- **Дети**: 6-12 лет, используют мобильные устройства
- **География**: Москва и Московская область (для пилота)
- **Размер группы**: 50-100 семей (100-200 детских профилей)

## Функции MVP

### 1. Аутентификация и профили

#### Для родителей
- ✅ Регистрация через email + password
- ✅ Email verification
- ✅ Базовый login/logout
- ✅ Восстановление пароля
- ✅ Parental consent checkbox при регистрации
- ❌ MFA (отложено на Production)
- ❌ OAuth (Google/Apple) - отложено

#### Профили детей
- ✅ Создание профиля ребёнка (имя, возраст, avatar)
- ✅ Редактирование профиля
- ✅ Удаление профиля
- ✅ Максимум 3 профиля на родителя (для пилота)
- ✅ Упрощённая система "пинкодов" для переключения профилей

### 2. Загрузка и просмотр контента

#### Загрузка
- ✅ Загрузка фото (JPG, PNG)
- ✅ Загрузка видео (MP4, максимум 30 секунд)
- ❌ GIF, live photos - отложено
- ✅ Лимит на размер: 10MB для фото, 50MB для видео
- ✅ Базовые метаданные: caption, timestamp
- ❌ Геотеги, расширенные метаданные - отложено

#### Просмотр
- ✅ Лента контента ребёнка
- ✅ Фильтрация: все / одобренные / на модерации / заблокированные
- ✅ Детальный просмотр (полноэкранный режим)
- ✅ Thumbnails для видео
- ❌ Комментарии, лайки - отложено
- ❌ Sharing между детьми - отложено

### 3. Модерация контента

#### Автоматическая модерация
- ✅ ML-модель для классификации контента:
  - Насилие и опасность
  - Неприемлемый контент
  - Персональные данные (PII)
- ✅ Три уровня: safe (auto-approve), uncertain (manual review), unsafe (auto-block)
- ✅ Confidence scores для каждой категории
- ❌ NLP для текстового контента - базовая версия или отложено
- ❌ Multi-modal анализ - отложено

#### Ручная модерация (для пилота - минимальная)
- ✅ Простая очередь для uncertain контента
- ✅ Возможность approve/block вручную
- ❌ Полноценный Moderation Dashboard - упрощённая версия
- ❌ Quality assurance - отложено

### 4. Родительский контроль

#### Настройки фильтрации
- ✅ Три уровня фильтрации на профиль ребёнка:
  - **Жёсткая**: блокируются все uncertain контент
  - **Умеренная** (по умолчанию): uncertain → manual review
  - **Мягкая**: только явно unsafe блокируются
- ✅ Изменение уровня фильтрации родителем

#### Мониторинг активности
- ✅ Просмотр всего контента ребёнка (включая заблокированный)
- ✅ История модерации (что было заблокировано и почему)
- ❌ Детальная аналитика - отложено
- ❌ Time limits, screen time - отложено

### 5. Уведомления

#### Push notifications (iOS)
- ✅ Уведомление родителю при блокировке контента
- ✅ Уведомление при завершении модерации (для uncertain)
- ❌ In-app notifications - базовая версия или отложено
- ❌ Email notifications - отложено

### 6. Базовая аналитика (для команды)

- ✅ Количество зарегистрированных пользователей
- ✅ Количество загруженного контента
- ✅ Метрики модерации (auto-approve/block/manual rate)
- ✅ Время отклика ML-модели
- ❌ User engagement metrics - базовая версия

## User Flows

### Flow 1: Регистрация и onboarding

```
1. Родитель открывает приложение
2. Экран Welcome с кратким описанием
3. Нажимает "Зарегистрироваться"
4. Заполняет форму:
   - Email
   - Password (8+ символов, требования к сложности)
   - Checkbox "Я родитель/опекун и даю согласие на обработку данных"
5. Отправка формы → backend проверяет
6. Email verification: "Проверьте почту для подтверждения"
7. Родитель кликает на ссылку в email
8. Redirects в приложение → аккаунт активирован
9. Onboarding экраны:
   - "Создайте профиль для вашего ребёнка"
   - "Выберите уровень фильтрации"
   - "Разрешите уведомления"
10. Попадает на главный экран (пустая лента)
```

### Flow 2: Создание профиля ребёнка

```
1. Родитель на главном экране нажимает "Добавить ребёнка"
2. Форма создания профиля:
   - Имя ребёнка
   - Возраст (dropdown 6-12)
   - Avatar (загрузка фото или выбор из preset'ов)
   - Уровень фильтрации (жёсткая/умеренная/мягкая)
3. Нажимает "Создать"
4. Backend создаёт профиль
5. Возврат на главный экран → профиль добавлен в список
6. Автоматическое переключение на новый профиль
```

### Flow 3: Загрузка фото

```
1. Ребёнок (или родитель в профиле ребёнка) на главном экране
2. Нажимает кнопку "+" (Upload)
3. Выбирает источник: "Камера" или "Галерея"
4. Выбирает фото
5. (Опционально) Добавляет caption
6. Нажимает "Загрузить"
7. Показывается progress bar
8. Загрузка на backend → S3
9. Отправка на модерацию (автоматически)
10. Контент появляется в ленте со статусом "На модерации"
11. Через несколько секунд:
    - Если safe: статус → "Одобрено", уведомление (опционально)
    - Если uncertain: статус → "На проверке", ждём модератора
    - Если unsafe: статус → "Заблокировано", уведомление родителю
```

### Flow 4: Просмотр контента

```
1. Ребёнок открывает приложение (или родитель в профиле ребёнка)
2. Главный экран = лента контента (grid view)
3. Фильтр по умолчанию: "Одобренный контент"
4. Родитель может переключить фильтр на "Все" или "Заблокированные"
5. Клик на контент → полноэкранный просмотр
6. Возможность удалить контент (для родителя)
7. Для заблокированного контента: показывается причина блокировки
```

### Flow 5: Модерация контента (родитель)

```
1. Родитель получает уведомление: "Контент заблокирован"
2. Открывает приложение → переходит в профиль ребёнка
3. Фильтр "Заблокированные"
4. Видит заблокированный контент с причиной:
   - "Обнаружен неприемлемый контент (confidence: 85%)"
5. Может посмотреть контент
6. (Опционально для MVP) Может оспорить решение → отправка на ручную модерацию
```

### Flow 6: Изменение уровня фильтрации

```
1. Родитель открывает настройки профиля ребёнка
2. Секция "Фильтрация контента"
3. Выбирает уровень:
   - Жёсткая (рекомендуется для младших детей)
   - Умеренная (по умолчанию)
   - Мягкая (для старших детей)
4. Подтверждает изменение
5. Backend обновляет настройки
6. Применяется к новым загрузкам
```

## API Contract (черновой)

### Authentication Endpoints

```typescript
// Регистрация
POST /api/auth/register
Body: {
  email: string;
  password: string;
  parentConsent: boolean;
}
Response: {
  success: boolean;
  message: string;
  userId?: string;
}

// Email verification
GET /api/auth/verify?token=<verification_token>
Response: {
  success: boolean;
  message: string;
}

// Login
POST /api/auth/login
Body: {
  email: string;
  password: string;
}
Response: {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    createdAt: string;
  }
}

// Logout
POST /api/auth/logout
Headers: { Authorization: "Bearer <accessToken>" }
Response: {
  success: boolean;
}

// Password reset request
POST /api/auth/password-reset
Body: {
  email: string;
}
Response: {
  success: boolean;
  message: string;
}

// Password reset confirm
POST /api/auth/password-reset/confirm
Body: {
  token: string;
  newPassword: string;
}
Response: {
  success: boolean;
}
```

### Children Profiles Endpoints

```typescript
// Создание профиля
POST /api/children
Headers: { Authorization: "Bearer <accessToken>" }
Body: {
  name: string;
  age: number; // 6-12
  avatarUrl?: string;
  filterLevel: "strict" | "moderate" | "relaxed";
}
Response: {
  success: boolean;
  child: {
    id: string;
    name: string;
    age: number;
    avatarUrl: string;
    filterLevel: string;
    createdAt: string;
  }
}

// Список профилей
GET /api/children
Headers: { Authorization: "Bearer <accessToken>" }
Response: {
  success: boolean;
  children: Array<{
    id: string;
    name: string;
    age: number;
    avatarUrl: string;
    filterLevel: string;
    contentCount: number;
  }>
}

// Обновление профиля
PATCH /api/children/:childId
Headers: { Authorization: "Bearer <accessToken>" }
Body: {
  name?: string;
  age?: number;
  avatarUrl?: string;
  filterLevel?: "strict" | "moderate" | "relaxed";
}
Response: {
  success: boolean;
  child: { /* updated child object */ }
}

// Удаление профиля
DELETE /api/children/:childId
Headers: { Authorization: "Bearer <accessToken>" }
Response: {
  success: boolean;
  message: string;
}
```

### Content Endpoints

```typescript
// Загрузка контента
POST /api/content
Headers: { 
  Authorization: "Bearer <accessToken>",
  Content-Type: "multipart/form-data"
}
Body: {
  childId: string;
  file: File; // photo or video
  caption?: string;
}
Response: {
  success: boolean;
  content: {
    id: string;
    childId: string;
    type: "photo" | "video";
    url: string; // temporary, pending moderation
    thumbnailUrl?: string;
    caption: string;
    status: "pending" | "approved" | "blocked" | "manual_review";
    uploadedAt: string;
  }
}

// Список контента
GET /api/content?childId=<childId>&status=<status>&page=<page>&limit=<limit>
Headers: { Authorization: "Bearer <accessToken>" }
Query params:
  - childId: string (required)
  - status: "all" | "approved" | "pending" | "blocked" | "manual_review" (optional, default: "approved")
  - page: number (optional, default: 1)
  - limit: number (optional, default: 20)
Response: {
  success: boolean;
  content: Array<{
    id: string;
    type: "photo" | "video";
    url: string;
    thumbnailUrl?: string;
    caption: string;
    status: string;
    moderationInfo?: {
      decision: string;
      confidence: number;
      categories: Record<string, number>;
      moderatedAt: string;
    };
    uploadedAt: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  }
}

// Получение конкретного контента
GET /api/content/:contentId
Headers: { Authorization: "Bearer <accessToken>" }
Response: {
  success: boolean;
  content: { /* full content object with moderation details */ }
}

// Удаление контента
DELETE /api/content/:contentId
Headers: { Authorization: "Bearer <accessToken>" }
Response: {
  success: boolean;
  message: string;
}
```

### Moderation Endpoints (для внутреннего использования)

```typescript
// Получение статуса модерации
GET /api/moderation/:contentId
Headers: { Authorization: "Bearer <accessToken>" }
Response: {
  success: boolean;
  moderation: {
    contentId: string;
    status: string;
    mlScores: {
      violence: number;
      inappropriate: number;
      pii: number;
      overall: number;
    };
    decision: "approved" | "blocked" | "manual_review";
    moderatedAt: string;
    moderatorId?: string; // if manual
  }
}

// История модерации ребёнка
GET /api/moderation/history/:childId
Headers: { Authorization: "Bearer <accessToken>" }
Response: {
  success: boolean;
  history: Array<{
    contentId: string;
    decision: string;
    reason: string;
    timestamp: string;
  }>
}
```

### Settings Endpoints

```typescript
// Получение настроек родителя
GET /api/settings
Headers: { Authorization: "Bearer <accessToken>" }
Response: {
  success: boolean;
  settings: {
    notifications: {
      push: boolean;
      email: boolean;
    };
    children: Record<string, {
      filterLevel: string;
      // другие настройки
    }>
  }
}

// Обновление настроек
PATCH /api/settings
Headers: { Authorization: "Bearer <accessToken>" }
Body: {
  notifications?: {
    push?: boolean;
    email?: boolean;
  };
  // другие настройки
}
Response: {
  success: boolean;
  settings: { /* updated settings */ }
}
```

## Требования к Backend для пилота

### Инфраструктура

- **Cloud provider**: AWS (базовая настройка)
- **Compute**: 
  - API/Services: AWS ECS/Fargate или небольшой EKS cluster
  - ML Inference: EC2 instance с GPU (g4dn.xlarge или similar)
- **Database**: RDS PostgreSQL (небольшой instance, db.t3.small)
- **Cache**: ElastiCache Redis (cache.t3.micro)
- **Storage**: S3 bucket для контента
- **CDN**: CloudFront для delivery контента

### Масштабирование

- **Capacity**: 100-200 активных пользователей
- **Storage**: 10-50 GB для пилота
- **Traffic**: низкий, burst до 100 req/min
- **Auto-scaling**: не критично для пилота, можно с запасом

### Monitoring

- **CloudWatch**: базовые метрики и логи
- **Sentry**: error tracking (опционально)
- **Simple Analytics**: подсчёт пользователей, контента

### Security

- **HTTPS**: обязательно (Let's Encrypt или AWS ACM)
- **JWT**: для аутентификации
- **Environment variables**: для секретов (AWS Systems Manager)
- **Backup**: ежедневный backup БД

### Performance

- **API latency**: < 500ms (p95)
- **ML inference**: < 5 секунд
- **Image upload**: < 10 секунд для 10MB

## Требования к ML Inference для пилота

### Модель

- **Type**: Pre-trained Vision Transformer или ResNet-based classifier
- **Fine-tuned**: на dataset детского контента (если доступен)
- **Fallback**: использовать open-source модели (NSFW detector, violence detector)

### Категории классификации

1. **Violence/Dangerous**: оружие, кровь, насилие
2. **Inappropriate**: неприемлемый контент
3. **PII**: лица, номера телефонов, адреса (базовая детекция)

### Thresholds

- **Safe**: overall_score < 0.3 → auto-approve
- **Uncertain**: 0.3 ≤ overall_score ≤ 0.7 → manual review
- **Unsafe**: overall_score > 0.7 → auto-block

### Performance

- **Inference time**: < 5 секунд
- **Accuracy**: target 90%+ precision (лучше false positives, чем false negatives)
- **Throughput**: обработка 10-20 images/min достаточно для пилота

### Deployment

- **EC2 instance**: g4dn.xlarge с NVIDIA T4 GPU
- **Model serving**: Simple Python Flask/FastAPI server
- **Queue**: SQS для асинхронной обработки

### Monitoring

- **Inference latency**: отслеживание через CloudWatch
- **Model confidence distribution**: логирование scores
- **Manual review rate**: % контента, отправленного на ручную модерацию

## Out of Scope для MVP

Следующие функции НЕ включены в MVP и будут добавлены в последующих версиях:

- Social features (комментарии, лайки, друзья)
- Messaging между детьми
- Live video
- Advanced ML (multi-modal, NLP для chat)
- Android приложение (только iOS для пилота)
- Web приложение для детей
- Gamification
- Premium subscription
- Advanced analytics dashboard
- Content recommendation
- Parental time limits
- Screen time tracking
- Educational content
- Multi-language support (только русский для пилота)

## Success Metrics для пилота

### User Engagement
- **DAU**: 50%+ от зарегистрированных пользователей
- **Weekly content uploads**: average 3+ per child profile
- **Retention**: 60%+ D7, 40%+ D30

### Moderation Quality
- **Auto-approval rate**: 70-85%
- **False positive rate**: < 10% (родители не жалуются)
- **Manual review time**: < 1 hour average

### Technical Performance
- **App crashes**: < 1% crash-free users
- **API uptime**: 99%+
- **ML inference time**: < 5 seconds p95

### User Satisfaction
- **NPS**: 40+ (хорошо для pилота)
- **Feature requests**: collect и prioritize
- **Bug reports**: быстрая реакция

## Timeline для MVP

### Phase 1: Backend Development (4-6 недель)
- Week 1-2: API endpoints, authentication
- Week 3-4: Content upload/storage, database schema
- Week 5-6: ML integration, basic moderation logic

### Phase 2: iOS App Development (6-8 недель)
- Week 1-2: UI/UX design, navigation
- Week 3-4: Authentication, profiles
- Week 5-6: Content upload/viewing
- Week 7-8: Moderation UI, notifications, polish

### Phase 3: Testing & QA (2-3 недели)
- Week 1: Internal testing, bug fixes
- Week 2: TestFlight beta (small group)
- Week 3: Bug fixes, refinements

### Phase 4: Pilot Launch (ongoing)
- Recruitment: 50-100 families
- Onboarding support
- Continuous monitoring
- Feedback collection

**Total estimated time**: 3-4 месяца от старта до пилота

## Следующие шаги после MVP

1. **Feedback analysis**: что работает, что нет
2. **Feature prioritization**: на основе user feedback
3. **Android version**: если iOS пилот успешен
4. **Advanced ML**: улучшение модели на реальных данных
5. **Social features**: добавление sharing, comments
6. **Fundraising**: подготовка к Seed round

---

**Примечание**: Эта спецификация является черновиком и будет обновляться по мере development. API endpoints могут меняться. Не добавляйте реальные credentials в код.
