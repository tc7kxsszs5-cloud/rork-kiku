# Спецификация MVP для пилота Rork-Kiku

## Обзор MVP

Минимально жизнеспособный продукт (MVP) для пилотирования через iOS TestFlight. Основная цель: валидировать концепцию автоматической модерации контента и собрать feedback от реальных пользователей.

## Целевая платформа

**Primary:** iOS (TestFlight)
- Минимальная версия iOS: 15.0+
- Устройства: iPhone, iPad

**Future:** Android, Web

## Критичные функции MVP

### 1. Аутентификация и управление аккаунтами

**Parent Registration & Login:**
- ✅ Email + password регистрация
- ✅ Email verification
- ✅ Password reset
- ✅ OAuth2 login (Apple Sign In - рекомендуется для iOS)
- ❌ Social login (Google, Facebook) - post-MVP

**Child Profile Management:**
- ✅ Родитель создает профиль ребенка (имя, возраст, фото профиля)
- ✅ Один родитель может управлять несколькими детскими профилями
- ✅ Базовые настройки контента для каждого ребенка
- ❌ Совместное управление (несколько родителей) - post-MVP

### 2. Контент и загрузка медиа

**Media Upload:**
- ✅ Загрузка фото (JPEG, PNG, HEIC)
- ✅ Загрузка видео (MP4, MOV) - до 60 секунд для MVP
- ✅ Загрузка с камеры или галереи
- ✅ Thumbnail generation
- ✅ Metadata: caption, tags (опционально)
- ❌ Filters и editing - post-MVP
- ❌ Live streaming - post-MVP

**Content Gallery:**
- ✅ Grid view всего семейного контента
- ✅ Просмотр отдельного фото/видео
- ✅ Статус модерации (pending, approved, rejected)
- ✅ Filter по ребенку
- ❌ Albums - post-MVP
- ❌ Search - post-MVP

### 3. Автоматическая модерация (ML)

**ML Model Integration:**
- ✅ NSFW detection (inappropriate content)
- ✅ Violence/disturbing content detection
- ✅ Age-inappropriate content detection
- ❌ Text moderation (если есть captions) - опционально для MVP
- ❌ Face detection для privacy - post-MVP

**Auto-Moderation Flow:**
1. User uploads content
2. Content immediately queued для ML inference
3. ML model classifies content:
   - **Safe (confidence > 95%):** Auto-approve
   - **Borderline (confidence 70-95%):** Queue для ручной модерации
   - **Unsafe (confidence > 70%):** Auto-reject
4. Parent получает notification о результате

**ML Inference Requirements для MVP:**
- Latency: < 5 секунд для фото, < 15 секунд для видео
- Throughput: минимум 100 uploads/day для пилота
- Accuracy: precision > 85%, recall > 90%

### 4. Ручная модерация (Manual Review)

**Moderator Dashboard (Web-based):**
- ✅ Queue management (FIFO)
- ✅ Content preview
- ✅ Approve/Reject buttons
- ✅ Reason для rejection (dropdown + free text)
- ✅ Skip button (для conflict of interest)
- ❌ Advanced queue filters - post-MVP
- ❌ Moderator performance metrics - post-MVP

**Review Process:**
1. Модератор видит next item в queue
2. Просматривает content + metadata
3. Принимает решение (approve/reject/escalate)
4. Parent notified о decision

**Escalation:**
- ✅ Возможность escalate сложные cases для senior moderator
- ❌ Multi-level approval - post-MVP

### 5. Уведомления

**Push Notifications:**
- ✅ Moderation result (approved/rejected)
- ✅ Child profile updates
- ❌ Real-time content updates - post-MVP
- ❌ In-app chat notifications - post-MVP

**In-App Notifications:**
- ✅ Notification center
- ✅ Unread badge
- ✅ Mark as read

**Email Notifications:**
- ✅ Welcome email
- ✅ Email verification
- ✅ Password reset
- ❌ Weekly digest - post-MVP

### 6. Settings & Privacy

**Parent Settings:**
- ✅ Profile edit (name, email, password)
- ✅ Notification preferences
- ✅ Privacy settings
- ✅ Account deletion
- ❌ Two-factor authentication - post-MVP

**Child Settings:**
- ✅ Profile edit (name, age, photo)
- ✅ Content visibility settings
- ✅ Moderation strictness (strict/moderate/relaxed)
- ❌ Screen time limits - post-MVP

## User Flows для MVP

### User Flow 1: Parent Onboarding

```
1. Download app from TestFlight
2. Open app → Welcome screen
3. Tap "Sign Up"
4. Enter email, password, name
5. Tap "Create Account"
6. Verify email (check inbox)
7. Return to app → logged in
8. Onboarding wizard:
   a. Create first child profile
   b. Set moderation preferences
   c. Grant permissions (camera, photos, notifications)
9. Complete → Home screen
```

### User Flow 2: Upload Content

```
1. Home screen → Tap "Upload" button
2. Select child profile (if multiple)
3. Choose source:
   - Take photo/video
   - Select from gallery
4. (Optional) Add caption
5. Tap "Upload"
6. Upload progress bar
7. Success → "Content submitted for review"
8. Redirect to gallery
9. Content shows "Pending" status
10. Wait for moderation...
11. Push notification → "Content approved!"
12. Gallery updates → "Approved" status
```

### User Flow 3: Content Rejection

```
1. Upload content (see flow 2)
2. ML model detects inappropriate content
3. Auto-reject
4. Push notification → "Content rejected"
5. In-app notification с reason
6. Parent can:
   - View rejection reason
   - Appeal (if believes it's false positive) - post-MVP
   - Delete rejected content
```

### User Flow 4: Manual Moderation (Moderator)

```
1. Moderator logs into web dashboard
2. Dashboard shows queue count
3. Click "Review Next"
4. Content preview loads
5. Review content + metadata
6. Decision:
   - Approve → Tap "Approve" → Next item
   - Reject → Select reason → Tap "Reject" → Next item
   - Escalate → Tap "Escalate" → Add note → Next item
7. Repeat until queue empty or end of shift
```

## API Contract (Черновой)

### Authentication

**POST /auth/register**
```json
Request:
{
  "email": "parent@example.com",
  "password": "SecurePass123!",
  "name": "Jane Doe"
}

Response (200):
{
  "user_id": "user_123",
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "expires_in": 900
}
```

**POST /auth/login**
```json
Request:
{
  "email": "parent@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "user_id": "user_123",
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "expires_in": 900
}
```

**POST /auth/refresh**
```json
Request:
{
  "refresh_token": "eyJhbGc..."
}

Response (200):
{
  "access_token": "eyJhbGc...",
  "expires_in": 900
}
```

### User Management

**POST /users/children**
```json
Request:
{
  "name": "Tommy",
  "age": 8,
  "profile_picture_url": "https://...",
  "moderation_level": "strict"
}
Headers:
{
  "Authorization": "Bearer eyJhbGc..."
}

Response (201):
{
  "child_id": "child_456",
  "family_id": "family_789",
  "created_at": "2026-01-02T10:00:00Z"
}
```

**GET /users/children**
```json
Headers:
{
  "Authorization": "Bearer eyJhbGc..."
}

Response (200):
{
  "children": [
    {
      "child_id": "child_456",
      "name": "Tommy",
      "age": 8,
      "profile_picture_url": "https://...",
      "moderation_level": "strict",
      "created_at": "2026-01-02T10:00:00Z"
    }
  ]
}
```

### Content Management

**POST /content/upload**
```json
Request (multipart/form-data):
{
  "child_id": "child_456",
  "file": [binary],
  "caption": "Beach day!",
  "tags": ["beach", "family"]
}
Headers:
{
  "Authorization": "Bearer eyJhbGc..."
}

Response (201):
{
  "content_id": "content_789",
  "status": "pending",
  "moderation_queue_position": 5,
  "uploaded_at": "2026-01-02T10:30:00Z"
}
```

**GET /content?child_id={child_id}&status={status}&page={page}&per_page={per_page}**
```json
Headers:
{
  "Authorization": "Bearer eyJhbGc..."
}

Response (200):
{
  "content": [
    {
      "content_id": "content_789",
      "child_id": "child_456",
      "url": "https://cdn.../content_789.jpg",
      "thumbnail_url": "https://cdn.../content_789_thumb.jpg",
      "caption": "Beach day!",
      "status": "approved",
      "moderation_result": {
        "decision": "approved",
        "confidence": 0.98,
        "reviewed_by": "auto",
        "reviewed_at": "2026-01-02T10:30:15Z"
      },
      "uploaded_at": "2026-01-02T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 50,
    "total_pages": 3
  }
}
```

### Moderation

**GET /moderation/queue**
```json
Headers:
{
  "Authorization": "Bearer eyJhbGc..." // moderator token
}

Response (200):
{
  "queue": [
    {
      "content_id": "content_790",
      "child_id": "child_456",
      "url": "https://cdn.../content_790.jpg",
      "caption": "Pool party",
      "uploaded_at": "2026-01-02T11:00:00Z",
      "ml_result": {
        "confidence": 0.85,
        "flags": ["borderline_nsfw"],
        "needs_review": true
      }
    }
  ],
  "queue_length": 15
}
```

**POST /moderation/decision**
```json
Request:
{
  "content_id": "content_790",
  "decision": "approve", // or "reject" or "escalate"
  "reason": "age-appropriate, no safety concerns",
  "notes": "checked context"
}
Headers:
{
  "Authorization": "Bearer eyJhbGc..." // moderator token
}

Response (200):
{
  "content_id": "content_790",
  "status": "approved",
  "reviewed_by": "moderator_123",
  "reviewed_at": "2026-01-02T11:05:00Z"
}
```

### Notifications

**GET /notifications?unread_only={bool}&page={page}&per_page={per_page}**
```json
Headers:
{
  "Authorization": "Bearer eyJhbGc..."
}

Response (200):
{
  "notifications": [
    {
      "notification_id": "notif_123",
      "type": "moderation_result",
      "title": "Content approved",
      "message": "Your photo has been approved!",
      "data": {
        "content_id": "content_789",
        "status": "approved"
      },
      "read": false,
      "created_at": "2026-01-02T10:30:20Z"
    }
  ],
  "unread_count": 3
}
```

## Backend Requirements для MVP

### Compute

**Рекомендация:** Kubernetes на AWS EKS или GCP GKE

**Микросервисы:**
- Auth Service: 2 replicas, 512MB RAM, 0.5 CPU
- User Service: 2 replicas, 512MB RAM, 0.5 CPU
- Content Service: 3 replicas, 1GB RAM, 1 CPU
- Moderation Service: 2 replicas, 2GB RAM, 2 CPU (для ML inference)
- Notification Service: 2 replicas, 512MB RAM, 0.5 CPU

**Total для MVP:** ~10GB RAM, ~7 vCPU

### Storage

**Database (PostgreSQL):**
- Instance size: db.t3.medium (2 vCPU, 4GB RAM) или equivalent
- Storage: 50GB SSD
- Backups: daily automated backups

**Object Storage (S3 / Cloud Storage):**
- Bucket для media files
- Estimated: 1GB/day для пилота (100 users × 10 uploads/day × 100KB average)
- Total для 3-месячного пилота: ~90GB

**Cache (Redis):**
- Instance: 1GB RAM
- Используется для sessions, API caching, rate limiting

### ML Inference

**Model Hosting:**
- **Option 1:** Docker container на Kubernetes (рекомендуется для MVP)
  - ONNX Runtime для optimized inference
  - GPU: не обязательно для MVP (CPU sufficient для throughput)
- **Option 2:** AWS SageMaker / GCP Vertex AI (дороже, но проще)

**Models:**
- NSFW detection: ResNet-50 или MobileNetV2 (pre-trained + fine-tuned)
- Model size: ~100MB
- Inference time: 2-3 seconds на CPU

**Throughput для пилота:**
- Expected: 100 uploads/day = ~4 uploads/hour
- Peak: 20 uploads/hour (worst case)
- CPU inference достаточно для MVP

### Network & CDN

**CDN (CloudFront / Cloud CDN):**
- Cache для thumbnail и media files
- Estimated bandwidth: 10GB/month для пилота

**API Gateway:**
- Rate limiting: 100 requests/minute per user
- CORS configured для web dashboard

### Monitoring

**Prometheus + Grafana:**
- Hosted на Kubernetes cluster или managed service

**Logs:**
- CloudWatch Logs (AWS) или Cloud Logging (GCP)
- Retention: 30 days для MVP

## Latency & Performance Requirements

**API Latency:**
- p50: < 200ms
- p95: < 500ms
- p99: < 1s

**Upload Latency:**
- Photo upload: < 5s (including presigned URL generation + S3 upload)
- Video upload: < 30s

**ML Inference Latency:**
- Photo: < 5s
- Video (60s): < 15s

**Push Notification Latency:**
- < 10s от moderation decision до delivery

## Checklists

### Pre-Launch Checklist

**Development:**
- [ ] All MVP features implemented
- [ ] Unit tests written (coverage > 70%)
- [ ] Integration tests passed
- [ ] API documentation complete
- [ ] Error handling implemented
- [ ] Logging configured

**Security:**
- [ ] Security scan passed (no critical vulnerabilities)
- [ ] HTTPS/TLS enabled everywhere
- [ ] JWT tokens implemented correctly
- [ ] Rate limiting configured
- [ ] Input validation implemented
- [ ] Secrets stored in Secrets Manager (not hardcoded)

**Infrastructure:**
- [ ] Kubernetes cluster configured
- [ ] Database backups automated
- [ ] Monitoring dashboards created
- [ ] Alerting rules configured
- [ ] CI/CD pipeline set up

**iOS App:**
- [ ] App Store Connect configured
- [ ] TestFlight build created
- [ ] App metadata complete (name, description, screenshots)
- [ ] Privacy policy linked
- [ ] Age rating set correctly (4+)
- [ ] TestFlight beta testers invited

**Legal & Compliance:**
- [ ] Privacy policy drafted and reviewed
- [ ] Terms of Service drafted
- [ ] Parental consent flow implemented
- [ ] COPPA compliance verified
- [ ] GDPR compliance verified (if EU users)

**Testing:**
- [ ] End-to-end testing completed
- [ ] Performance testing completed (load testing)
- [ ] User acceptance testing (internal team)
- [ ] Beta testing plan ready

### Launch Day Checklist

- [ ] Final deployment to production
- [ ] Smoke tests passed
- [ ] Monitoring dashboards active
- [ ] On-call rotation scheduled
- [ ] Incident response plan shared
- [ ] TestFlight link sent to beta testers
- [ ] Support email monitored ([FOUNDERS_EMAIL])
- [ ] Status page ready (if applicable)

### Post-Launch Monitoring (First 24 hours)

- [ ] Monitor error rates
- [ ] Monitor API latency
- [ ] Monitor ML inference performance
- [ ] Check user registration rate
- [ ] Check upload rate
- [ ] Review user feedback
- [ ] Address critical issues immediately

## Success Metrics для MVP

**User Acquisition:**
- Target: 50-100 families during 3-month pilot
- Activation rate: > 70% (users who create at least 1 child profile)

**Engagement:**
- Upload frequency: > 5 uploads per family per week
- Retention (D7): > 40%
- Retention (D30): > 25%

**Moderation Accuracy:**
- Auto-moderation precision: > 85%
- Auto-moderation recall: > 90%
- False positive rate: < 5%
- Manual review turnaround time: < 4 hours

**Performance:**
- API uptime: > 99.5%
- p95 latency: < 500ms
- ML inference latency: < 5s (photos), < 15s (videos)

**User Satisfaction:**
- NPS (Net Promoter Score): > 40
- App Store rating: > 4.0 (if public beta)

## Risks & Mitigations

**Risk 1: Low ML accuracy**
- Mitigation: Start with stricter threshold, iterate based on manual review data

**Risk 2: Slow adoption**
- Mitigation: Partner with schools/NGOs for pilot recruitment

**Risk 3: Infrastructure costs**
- Mitigation: Use cost-effective instance sizes, monitor spending daily

**Risk 4: TestFlight limitations**
- Mitigation: Max 10,000 testers, 90-day expiration - sufficient for pilot

**Risk 5: Moderation queue backlog**
- Mitigation: Hire 2-3 moderators, implement queue monitoring

## Next Steps Post-MVP

1. Analyze pilot data and feedback
2. Iterate on ML model based on manual review data
3. Add features based on user requests
4. Prepare for public beta (App Store)
5. Scale infrastructure
6. Expand to Android
7. Fundraise (Seed round)

---

**Примечание:** Эта спецификация является черновиком и должна быть уточнена в процессе development. Все API endpoints и параметры могут изменяться.

**Контакт:** [FOUNDERS_EMAIL]
