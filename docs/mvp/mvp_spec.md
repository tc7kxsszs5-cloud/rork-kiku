# MVP Спецификация — Rork-Kiku iOS TestFlight Pilot

## Версия документа
- **Версия**: 0.1.0 (Черновик)
- **Дата**: 2026-01-02
- **Статус**: DRAFT — требует product review
- **Контакт**: [FOUNDERS_EMAIL]
- **Target**: iOS TestFlight pilot (100-500 пользователей)

---

## 1. Цели MVP

### 1.1. Бизнес-цели
- Валидация product-market fit
- Сбор данных о поведении пользователей
- Тестирование ML модерации на реальных данных
- Получение feedback от early adopters
- Демонстрация работающего продукта для инвесторов

### 1.2. Технические цели
- Стабильная работа для 100-500 пользователей
- ML модерация accuracy > 90%
- False positive rate < 5%
- Latency модерации < 10 секунд (p95)
- 99% uptime

### 1.3. Критерии успеха
- ✅ 100+ активных пользователей за 4 недели
- ✅ DAU/MAU > 30%
- ✅ Retention Day 7 > 40%
- ✅ NPS > 40
- ✅ 0 critical security incidents
- ✅ < 10% churn rate

---

## 2. Scope — Что входит в MVP

### 2.1. Критические фичи (MUST HAVE)

#### 2.1.1. Аутентификация
- ✅ Sign up / Sign in with Apple (iOS native)
- ✅ Sign up / Sign in with Google (OAuth2)
- ✅ Email verification (опционально для MVP, но рекомендуется)
- ✅ Onboarding flow для новых пользователей
- ❌ Email/password authentication (не для MVP)
- ❌ Multi-factor authentication (не для MVP)

#### 2.1.2. Родительский аккаунт
- ✅ Создание профиля родителя (имя, фото профиля)
- ✅ Просмотр и редактирование своего профиля
- ✅ Настройки уведомлений (push on/off)
- ❌ Co-parent collaboration (фаза 2)

#### 2.1.3. Детские профили
- ✅ Создание детского профиля (имя, возраст, фото)
- ✅ Выбор уровня модерации: Строгий / Умеренный / Мягкий
- ✅ Просмотр списка детей
- ✅ Редактирование профиля ребёнка
- ✅ Удаление профиля ребёнка (с подтверждением)
- ❌ Child login (фаза 2)
- ❌ Child device pairing (фаза 2)

#### 2.1.4. Загрузка медиа
- ✅ Выбор фото из галереи
- ✅ Камера для съёмки нового фото
- ✅ Превью перед загрузкой
- ✅ Выбор ребёнка-получателя
- ✅ Progress indicator во время загрузки
- ✅ Подтверждение успешной загрузки
- ❌ Видео загрузка (фаза 2)
- ❌ Batch upload (фаза 2)
- ❌ Editing/filters (фаза 2)

#### 2.1.5. Автоматическая модерация (ML)
- ✅ NSFW detection
- ✅ Violence detection
- ✅ Inappropriate text detection (OCR + NLP)
- ✅ Object detection (оружие, алкоголь, наркотики)
- ✅ Confidence score (0-100%)
- ✅ Автоматическое одобрение (confidence > 90%)
- ✅ Отправка на ручную модерацию (50% < confidence < 90%)
- ✅ Автоматический reject (confidence < 50%)
- ❌ Age-specific moderation levels (фаза 2)
- ❌ Custom ML models per family (фаза 2)

#### 2.1.6. Просмотр медиа
- ✅ Gallery view (grid) одобренных фото
- ✅ Full-screen preview
- ✅ Информация о модерации (status badge)
- ✅ Фильтр по ребёнку
- ✅ Сортировка (newest first)
- ❌ Search (фаза 2)
- ❌ Albums (фаза 2)
- ❌ Share to external apps (фаза 2)

#### 2.1.7. Статус модерации
- ✅ Pending (в процессе)
- ✅ Approved (одобрено)
- ✅ Rejected (отклонено с причиной)
- ✅ Manual Review (на ручной проверке)
- ✅ Notification при изменении статуса

#### 2.1.8. Уведомления
- ✅ Push notification при одобрении медиа
- ✅ Push notification при отклонении медиа (с причиной)
- ✅ In-app notification badge
- ❌ Email notifications (фаза 2)
- ❌ SMS notifications (фаза 2)

### 2.2. Желательные фичи (NICE TO HAVE)

#### 2.2.1. Обратная связь
- ⚠️ In-app feedback форма
- ⚠️ Report false positive/negative
- ❌ Live chat support (не для MVP)

#### 2.2.2. Analytics
- ⚠️ Basic analytics (user actions tracking)
- ❌ Advanced analytics dashboard (не для MVP)

### 2.3. Что НЕ входит в MVP
- ❌ Видео загрузка и модерация
- ❌ Real-time chat между родителем и ребёнком
- ❌ Social features (friends, comments, likes)
- ❌ Subscription/payment
- ❌ Multi-language support (только English для MVP)
- ❌ Android app (iOS only для MVP)
- ❌ Web app
- ❌ Offline mode

---

## 3. User Flows

### 3.1. Onboarding Flow

```
1. App launch → Splash screen
2. Welcome screen с кратким описанием
   - "Safe media sharing for your family"
   - "AI-powered content moderation"
3. Sign Up / Sign In options:
   - Button "Continue with Apple"
   - Button "Continue with Google"
4. OAuth flow → Authorization → Callback
5. Если новый пользователь:
   a. "Complete your profile" screen
   b. Input: Name (required), Profile photo (optional)
   c. Button "Continue"
6. "Create your first child profile" screen
   a. Input: Child name, Age, Profile photo (optional)
   b. Select moderation level: Strict / Moderate / Relaxed
   c. Button "Create Profile"
7. "All set!" confirmation screen
8. Redirect to Home screen (Gallery)
```

### 3.2. Upload Photo Flow

```
1. Home screen → FAB (Floating Action Button) "+"
2. Bottom sheet with options:
   - "Take Photo"
   - "Choose from Gallery"
   - "Cancel"
3. User selects option → Image picker
4. Preview screen:
   - Show selected image
   - Dropdown: "Select child" (list of children)
   - Button "Upload"
   - Button "Cancel"
5. User clicks "Upload":
   - Show loading indicator
   - Upload to backend
6. Success:
   - Toast: "Uploading... Your photo will be reviewed shortly"
   - Return to Home screen
   - Show pending badge in gallery
7. After moderation (push notification):
   - "Photo approved!" or "Photo rejected: [reason]"
```

### 3.3. View Gallery Flow

```
1. Home screen (Gallery tab)
2. Grid view of approved photos (thumbnails)
3. Filter dropdown: "All children" / "Child 1" / "Child 2" / ...
4. Tap on photo → Full-screen view
5. Full-screen view:
   - Photo
   - Metadata: upload date, child name, moderation status
   - Button "Back" (or swipe down to close)
6. If pending: Show spinner + "Under review"
7. If rejected: Show "Rejected: [reason]" banner
```

### 3.4. Manage Children Flow

```
1. Profile tab → "Your Children" section
2. List of children with profile photos
3. Tap child → Child detail screen:
   - Name, Age, Profile photo
   - Moderation level setting
   - Button "Edit"
   - Button "Delete Profile" (red, confirmation required)
4. Edit: Update fields → Save
5. Delete: Confirmation dialog → Delete → Return to list
6. FAB "Add Child" → Create child flow (same as onboarding)
```

### 3.5. Settings Flow

```
1. Profile tab → Settings icon
2. Settings screen:
   - Account section:
     - Email (read-only)
     - Name (editable)
     - Profile photo (editable)
   - Notifications:
     - Push notifications toggle (on/off)
   - Legal:
     - Privacy Policy (link)
     - Terms of Service (link)
   - App:
     - App version
     - "Log Out" button
     - "Delete Account" button (red, confirmation required)
```

---

## 4. API Contract (черновой)

### 4.1. Authentication

#### POST /api/v1/auth/register
**Request:**
```json
{
  "provider": "apple|google",
  "idToken": "string",
  "name": "string",
  "email": "string" // optional, от provider
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "string",
    "name": "string",
    "createdAt": "iso8601"
  },
  "tokens": {
    "accessToken": "jwt",
    "refreshToken": "jwt",
    "expiresIn": 900 // seconds
  }
}
```

#### POST /api/v1/auth/refresh
**Request:**
```json
{
  "refreshToken": "jwt"
}
```

**Response (200):**
```json
{
  "accessToken": "jwt",
  "refreshToken": "jwt",
  "expiresIn": 900
}
```

#### POST /api/v1/auth/logout
**Request:** (Headers: `Authorization: Bearer {accessToken}`)
```json
{
  "refreshToken": "jwt"
}
```

**Response (204):** No content

---

### 4.2. User Management

#### GET /api/v1/users/me
**Response (200):**
```json
{
  "id": "uuid",
  "email": "string",
  "name": "string",
  "profilePhotoUrl": "string|null",
  "createdAt": "iso8601"
}
```

#### PATCH /api/v1/users/me
**Request:**
```json
{
  "name": "string", // optional
  "profilePhotoUrl": "string" // optional
}
```

**Response (200):** Updated user object

---

### 4.3. Children Management

#### GET /api/v1/children
**Response (200):**
```json
{
  "children": [
    {
      "id": "uuid",
      "name": "string",
      "age": 8,
      "profilePhotoUrl": "string|null",
      "moderationLevel": "strict|moderate|relaxed",
      "createdAt": "iso8601"
    }
  ]
}
```

#### POST /api/v1/children
**Request:**
```json
{
  "name": "string",
  "age": 8,
  "profilePhotoUrl": "string|null",
  "moderationLevel": "strict|moderate|relaxed"
}
```

**Response (201):**
```json
{
  "child": {
    "id": "uuid",
    "name": "string",
    "age": 8,
    "profilePhotoUrl": "string|null",
    "moderationLevel": "strict",
    "createdAt": "iso8601"
  }
}
```

#### PATCH /api/v1/children/:id
**Request:**
```json
{
  "name": "string", // optional
  "age": 9, // optional
  "profilePhotoUrl": "string|null", // optional
  "moderationLevel": "moderate" // optional
}
```

**Response (200):** Updated child object

#### DELETE /api/v1/children/:id
**Response (204):** No content

---

### 4.4. Media Management

#### POST /api/v1/media/upload-url
**Request:**
```json
{
  "childId": "uuid",
  "mimeType": "image/jpeg",
  "fileSize": 1024000 // bytes
}
```

**Response (200):**
```json
{
  "uploadUrl": "presigned-s3-url",
  "mediaId": "uuid",
  "expiresIn": 3600 // seconds
}
```

**Client workflow:**
1. Get upload URL
2. PUT file to uploadUrl (direct S3 upload)
3. POST /api/v1/media/:mediaId/confirm

#### POST /api/v1/media/:mediaId/confirm
**Response (200):**
```json
{
  "media": {
    "id": "uuid",
    "childId": "uuid",
    "status": "pending",
    "createdAt": "iso8601"
  }
}
```

#### GET /api/v1/media
**Query params:**
- `childId` (optional): Filter by child
- `status` (optional): pending | approved | rejected | manual_review
- `page` (default: 1)
- `limit` (default: 20, max: 100)

**Response (200):**
```json
{
  "media": [
    {
      "id": "uuid",
      "childId": "uuid",
      "thumbnailUrl": "string",
      "fullUrl": "string",
      "status": "approved|rejected|pending|manual_review",
      "mlConfidence": 95.5, // 0-100
      "rejectionReason": "string|null",
      "createdAt": "iso8601",
      "reviewedAt": "iso8601|null"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "hasMore": true
  }
}
```

#### GET /api/v1/media/:id
**Response (200):** Single media object

---

### 4.5. Notifications

#### GET /api/v1/notifications
**Response (200):**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "media_approved|media_rejected|media_manual_review",
      "title": "string",
      "body": "string",
      "data": {
        "mediaId": "uuid",
        "childId": "uuid"
      },
      "read": false,
      "createdAt": "iso8601"
    }
  ]
}
```

#### POST /api/v1/notifications/:id/read
**Response (204):** No content

#### POST /api/v1/notifications/register-device
**Request:**
```json
{
  "pushToken": "expo-push-token",
  "platform": "ios"
}
```

**Response (204):** No content

---

## 5. Backend Requirements

### 5.1. Performance
- **API latency**: < 200ms (p95) для read endpoints
- **Upload latency**: < 500ms для pre-signed URL generation
- **ML inference**: < 10 seconds (p95) для image moderation
- **Throughput**: 10 uploads/second (MVP)

### 5.2. Storage
- **Images**: До 10MB per file (resize if larger)
- **Thumbnails**: 300x300px, < 100KB
- **Total storage**: 100GB для MVP (1000 users * 100 images * 1MB avg)

### 5.3. Database
- **PostgreSQL**: Single instance (db.t3.medium для MVP)
- **Connection pool**: 20 connections
- **Backup**: Daily automated backup
- **Retention**: 30 дней

### 5.4. Reliability
- **Uptime**: 99% (MVP acceptable)
- **Error rate**: < 1% для API requests
- **Data durability**: 99.99% (S3)

---

## 6. ML Inference Requirements

### 6.1. Models
- **NSFW Classifier**: Pre-trained model (Yahoo Open NSFW / LAION)
- **Object Detection**: YOLOv8 или Detectron2
- **OCR**: Tesseract (если текст на изображении)
- **Custom moderation model**: Fine-tuned на датасете безопасного контента (опционально для MVP)

### 6.2. Performance
- **Throughput**: 10 images/second (MVP)
- **Latency**: < 10 seconds (p95) end-to-end
- **Accuracy**: > 90% на validation set
- **False positive rate**: < 5%
- **False negative rate**: < 1% (критично для безопасности детей)

### 6.3. Infrastructure
- **GPU**: 1x T4 instance (AWS g4dn.xlarge / GCP n1-highmem-4 + T4)
- **Batch processing**: Queue-based (Redis Streams / SQS)
- **Scaling**: Manual для MVP, автоматический для Production

### 6.4. Fallback
- При недоступности ML сервиса: все медиа → Manual Review queue

---

## 7. Чеклисты

### 7.1. Pre-Launch Checklist

**Product**:
- [ ] All critical features implemented
- [ ] User flows tested end-to-end
- [ ] Edge cases handled (network errors, timeouts)
- [ ] Error messages user-friendly

**Security**:
- [ ] HTTPS only (no HTTP)
- [ ] OAuth2 flows secure
- [ ] JWT токены с коротким TTL
- [ ] API rate limiting enabled
- [ ] Sensitive data encrypted at rest
- [ ] No secrets in code/logs

**Compliance**:
- [ ] Privacy Policy published
- [ ] Terms of Service published
- [ ] Parental consent flow implemented
- [ ] Age gate (родитель подтверждает возраст ребёнка)
- [ ] Data deletion endpoint ready

**Infrastructure**:
- [ ] Production environment deployed
- [ ] Database backups configured
- [ ] Monitoring/alerting enabled (uptime, errors)
- [ ] CDN configured для media
- [ ] Logs aggregation setup

**iOS**:
- [ ] App ID created
- [ ] Bundle ID configured
- [ ] Provisioning profiles generated
- [ ] Push notifications certificate uploaded
- [ ] TestFlight build uploaded
- [ ] Beta testers invited

**ML**:
- [ ] ML models deployed and tested
- [ ] Inference endpoint available
- [ ] Queue processing working
- [ ] False positive/negative tracking enabled

### 7.2. TestFlight Launch Checklist

- [ ] TestFlight build approved by Apple
- [ ] 10+ internal testers tested the app (family & friends)
- [ ] No critical bugs found
- [ ] Push notifications working
- [ ] OAuth flows working (Apple Sign In, Google)
- [ ] Upload flow working end-to-end
- [ ] Moderation working (auto-approve, auto-reject, manual review)
- [ ] External testers invited (up to 100 users)
- [ ] Support email configured: [FOUNDERS_EMAIL]
- [ ] Feedback form accessible in app
- [ ] Analytics tracking enabled (anonymized)

### 7.3. Monitoring Checklist

**Metrics to track**:
- [ ] Sign ups per day
- [ ] Active users (DAU/MAU)
- [ ] Photos uploaded per day
- [ ] Moderation queue length
- [ ] ML accuracy (approved/rejected breakdown)
- [ ] API error rate
- [ ] API latency (p50, p95, p99)
- [ ] Crash rate (iOS)
- [ ] Push notification delivery rate

**Alerts**:
- [ ] API error rate > 5%
- [ ] API latency > 1 second (p95)
- [ ] ML inference latency > 30 seconds
- [ ] Moderation queue > 100 items
- [ ] Database CPU > 80%
- [ ] Disk usage > 80%

---

## 8. Риски и Митигация

### 8.1. Технические риски

| Риск | Вероятность | Impact | Митигация |
|------|-------------|--------|-----------|
| ML модель даёт много false positives | Высокая | Средний | Ручная модерация, сбор feedback, retraining |
| ML модель пропускает unsafe content | Средняя | Критичный | Строгий threshold, manual review для edge cases |
| S3 outage | Низкая | Высокий | Multi-region bucket (для production) |
| Database downgrade | Низкая | Критичный | Automated backups, failover plan |
| OAuth provider outage | Низкая | Высокий | Support multiple providers (Apple + Google) |

### 8.2. Product риски

| Риск | Вероятность | Impact | Митигация |
|------|-------------|--------|-----------|
| Low user adoption | Средняя | Критичный | Marketing, partnerships с НКО/школами |
| High churn rate | Средняя | Высокий | User feedback, быстрые improvements |
| Negative feedback на модерацию | Средняя | Средний | Настройки moderation level, feedback loop |
| Privacy concerns | Средняя | Высокий | Прозрачная Privacy Policy, GDPR compliance |

### 8.3. Legal риски

| Риск | Вероятность | Impact | Митигация |
|------|-------------|--------|-----------|
| GDPR/COPPA violation | Низкая | Критичный | Legal review, compliance audit |
| Data breach | Низкая | Критичный | Security audit, encryption, incident response plan |
| Content liability | Средняя | Высокий | Terms of Service, parental consent, moderation |

---

## 9. Success Metrics (MVP)

### 9.1. User Engagement
- **Target**: 100+ active users в первые 4 недели
- **DAU/MAU**: > 30%
- **Photos uploaded per user per week**: > 5
- **Retention Day 7**: > 40%
- **Retention Day 30**: > 20%

### 9.2. Product Quality
- **NPS**: > 40
- **App Store rating** (если запущен): > 4.0
- **Critical bugs**: 0
- **Crash rate**: < 1%

### 9.3. Moderation
- **ML accuracy**: > 90%
- **False positive rate**: < 5%
- **False negative rate**: < 1%
- **Manual review queue**: < 50 items в любой момент
- **Moderation latency**: < 10 секунд (p95)

### 9.4. Infrastructure
- **Uptime**: 99%
- **API error rate**: < 1%
- **API latency**: < 200ms (p95)

---

## 10. Roadmap после MVP

### Phase 2 (Post-MVP, 2-3 месяца)
- Video upload и moderation
- Android app
- Real-time notifications (WebSocket)
- Co-parent collaboration
- Child device pairing
- Albums и organization

### Phase 3 (Production, 6 месяцев)
- Multi-language support
- Social features (друзья, комментарии)
- Subscription model
- Advanced analytics dashboard
- Third-party integrations (Google Photos, iCloud)

---

## 11. Контакты

- **Product Owner**: [FOUNDERS_EMAIL]
- **Technical Lead**: [FOUNDERS_EMAIL]
- **Support Email**: [FOUNDERS_EMAIL]
- **Documentation**: `docs/`

---

**DISCLAIMER**: Данный документ является черновиком MVP спецификации. Все API endpoints, параметры и ответы — примеры для демонстрации. Не содержит production-кода, реальных секретов или персональных данных.
