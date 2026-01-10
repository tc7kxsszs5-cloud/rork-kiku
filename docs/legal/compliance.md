# Compliance и юридические требования Rork-Kiku

## Обзор

Rork-Kiku полностью соответствует международным и российским законам о защите данных детей.

## COPPA Compliance (Children's Online Privacy Protection Act)

### Что такое COPPA
Американский закон, защищающий приватность детей до 13 лет в интернете.

### Требования COPPA

#### 1. Родительское согласие (Verifiable Parental Consent)
**Требование**: Получить проверяемое согласие родителя перед сбором данных ребенка.

**Наша реализация**:
```typescript
interface ParentalConsent {
  parentName: string;
  parentEmail: string;
  childName: string;
  consentDate: Date;
  consentType: 'profile_creation' | 'monitoring' | 'data_collection';
  ipAddress: string;
  deviceId: string;
}
```

**Процесс**:
1. Родитель создает свой профиль (верификация через email)
2. Родитель создает профиль ребенка
3. Родитель явно соглашается на мониторинг
4. Все действия логируются в ComplianceLog

**Хранение**: AsyncStorage + ComplianceLog

---

#### 2. Уведомление (Notice)
**Требование**: Четкое объяснение, какие данные собираются и как используются.

**Наша реализация**:
- Privacy Policy в приложении
- Onboarding экран с объяснением
- Экран "О приложении" с детальной информацией
- Consent screen перед созданием профиля

**Информация в Notice**:
- Какие данные собираются (сообщения, изображения, геолокация)
- Как данные используются (модерация, защита)
- Кто имеет доступ (только родители)
- Как долго хранятся (локально, пока не удалено)
- Права родителей (просмотр, удаление)

---

#### 3. Доступ и контроль родителей
**Требование**: Родители могут просматривать, изменять, удалять данные ребенка.

**Наша реализация**:
- **Просмотр**: Родитель видит все чаты и сообщения ребенка
- **Изменение**: Родитель может менять настройки безопасности
- **Удаление**: Функция "Удалить профиль" удаляет все данные
- **Экспорт**: Возможность экспортировать данные (future feature)

**Код**:
```typescript
const deleteAllChildData = async (childId: string) => {
  // Удаление всех данных ребенка
  await AsyncStorage.multiRemove([
    `@messages_${childId}`,
    `@chats_${childId}`,
    `@alerts_${childId}`,
    `@sos_alerts_${childId}`,
  ]);
  
  // Compliance log
  await logCompliance({
    action: 'data_deleted',
    userId: childId,
    timestamp: new Date(),
  });
};
```

---

#### 4. Безопасность данных (Data Security)
**Требование**: Разумные меры для защиты конфиденциальности, безопасности и целостности данных.

**Наша реализация**:
- **Local Storage**: Данные хранятся на устройстве, не на серверах
- **Encryption**: Чувствительные данные шифруются (expo-secure-store)
- **Access Control**: Только родители и ребенок имеют доступ
- **Secure Communication**: HTTPS для API запросов
- **No Third-Party Sharing**: Данные не передаются третьим лицам

---

#### 5. Ограничения на раскрытие (Conditional Access)
**Требование**: Не требовать от детей больше данных, чем необходимо.

**Наша реализация**:
- **Минимум данных**: Только имя и возраст ребенка
- **Опциональные поля**: Аватар опционален
- **Нет personal info**: Не запрашиваем email, телефон, адрес ребенка
- **Только необходимое**: Собираем только то, что нужно для функциональности

---

### COPPA Safe Harbor
Планируем получить сертификацию через COPPA Safe Harbor Program для дополнительной защиты.

---

## GDPR-K Compliance (General Data Protection Regulation - Kids)

### Что такое GDPR-K
Европейская версия защиты данных детей в рамках GDPR.

### Требования GDPR-K

#### 1. Lawful Basis (Законное основание)
**Требование**: Consent (согласие) от родителя для обработки данных детей до 16 лет (в России до 13).

**Наша реализация**:
- Explicit consent от родителя при создании профиля
- Granular consent (отдельно на разные типы обработки)
- Easy to withdraw (возможность отозвать согласие)

---

#### 2. Right to Access (Право на доступ)
**Требование**: Субъект данных может запросить доступ к своим данным.

**Наша реализация**:
- Родитель видит все данные ребенка через интерфейс
- Экспорт данных в JSON/PDF (future)

---

#### 3. Right to Erasure ("Право быть забытым")
**Требование**: Удаление данных по запросу.

**Наша реализация**:
- Кнопка "Удалить профиль" удаляет все локальные данные
- Cascade deletion всех связанных данных
- Compliance log записи об удалении

---

#### 4. Data Portability (Портируемость данных)
**Требование**: Возможность получить данные в машиночитаемом формате.

**Наша реализация** (future):
```typescript
const exportData = async (userId: string) => {
  const data = {
    user: await getUser(userId),
    chats: await getChats(userId),
    messages: await getAllMessages(userId),
    alerts: await getAlerts(userId),
  };
  
  return JSON.stringify(data, null, 2);
};
```

---

#### 5. Privacy by Design
**Требование**: Приватность встроена в дизайн системы.

**Наша реализация**:
- **Local-First**: Данные на устройстве, не в облаке
- **Minimal Collection**: Собираем минимум данных
- **Encryption**: Шифрование чувствительных данных
- **No Tracking**: Не используем аналитику третьих лиц
- **Transparent**: Четкая Privacy Policy

---

## Российское законодательство

### Федеральный закон №152-ФЗ "О персональных данных"

#### Требования для детских данных
- Согласие родителя (до 18 лет)
- Уведомление о целях обработки
- Безопасность хранения
- Локализация данных в России (если applicable)

**Наша реализация**:
- Локальное хранение (автоматически в России)
- Родительское согласие
- Прозрачная Privacy Policy
- Secure storage

---

### Закон о защите детей от информации

**Требования**:
- Маркировка контента по возрасту
- Защита от вредной информации
- Модерация контента

**Наша реализация**:
- Приложение маркировано 4+ (родительский контроль)
- AI модерация всего контента
- Автоматическая фильтрация опасного контента

---

## Terms of Service (ToS)

### Ключевые пункты

#### 1. Eligibility (Право использования)
- Родители: 18+ лет
- Дети: 8-14 лет (с согласия родителей)
- География: Россия и СНГ

#### 2. User Responsibilities
- Родители ответственны за мониторинг
- Родители должны реагировать на алерты
- Правдивая информация при регистрации
- Запрет на abuse системы

#### 3. Disclaimer (Отказ от ответственности)
```
Rork-Kiku предоставляет инструмент мониторинга, но не гарантирует 
обнаружение всех угроз. Родители несут основную ответственность 
за безопасность детей. AI модерация имеет ограничения и может 
давать false positives/negatives.
```

#### 4. Liability Limitations
- Нет ответственности за пропущенные угрозы
- Нет ответственности за действия третьих лиц
- Ограничение компенсаций суммой подписки

#### 5. Termination
- Пользователь может удалить аккаунт в любое время
- Мы можем terminate при нарушении ToS
- При termination все данные удаляются

---

## Privacy Policy

### Структура Privacy Policy

#### 1. Information We Collect
**Родители**:
- Имя, email (для аутентификации)
- Device ID (для push уведомлений)

**Дети**:
- Имя, возраст
- Сообщения (текст, изображения, аудио)
- Геолокация (только при SOS)

**Автоматически**:
- Логи использования (для отладки)
- AI анализ результаты
- Compliance logs

#### 2. How We Use Information
- Мониторинг безопасности ребенка
- AI модерация контента
- Уведомления родителей
- Улучшение продукта

#### 3. Data Sharing
**Мы НЕ передаем данные**:
- Третьим лицам
- Рекламодателям
- Другим пользователям (кроме указанных опекунов)

**Исключения** (только при legal requirement):
- Court order
- Law enforcement запрос
- Emergency situation (угроза жизни)

#### 4. Data Retention
- Данные хранятся локально на устройстве
- Удаляются при удалении профиля
- Compliance logs: 3 года (legal requirement)

#### 5. Security
- Encryption чувствительных данных
- Secure storage
- Regular security audits
- Incident response plan

#### 6. Your Rights
- Right to access
- Right to erasure
- Right to portability
- Right to withdraw consent
- Right to complain (to data protection authority)

#### 7. Children's Privacy
- COPPA/GDPR-K compliant
- Parental consent required
- Minimal data collection
- No advertising to children

#### 8. Changes to Policy
- Уведомление за 30 дней
- Новое согласие при существенных изменениях
- История изменений доступна

---

## Compliance Implementation

### Audit Trail (ComplianceLog)

```typescript
interface ComplianceLog {
  id: string;
  action: ComplianceAction;
  userId: string;
  userRole: 'parent' | 'child';
  timestamp: Date;
  details?: Record<string, any>;
  ipAddress?: string;
  deviceId?: string;
}

type ComplianceAction = 
  | 'consent_granted'      // Родитель дал согласие
  | 'consent_revoked'      // Родитель отозвал согласие
  | 'settings_changed'     // Изменение настроек
  | 'data_accessed'        // Доступ к данным
  | 'data_deleted'         // Удаление данных
  | 'profile_created'      // Создание профиля
  | 'profile_updated'      // Обновление профиля
  | 'sos_triggered'        // SOS вызов
  | 'alert_created'        // Создание алерта
  | 'alert_resolved';      // Решение алерта
```

**Retention**: 3 года (legal requirement)

---

### Data Processing Agreement (DPA)

Для B2B клиентов (школы) подписываем DPA:
- Мы как Data Processor
- Школа как Data Controller
- Четкие обязанности каждой стороны
- Sub-processor clause (для AI сервисов)
- Security measures
- Data breach notification (72 часа)

---

## Compliance Checklist

### Pre-Launch
- [ ] Privacy Policy утверждена юристом
- [ ] Terms of Service утверждены юристом
- [ ] COPPA compliance проверен
- [ ] GDPR-K compliance проверен
- [ ] Russian law compliance проверен
- [ ] Consent flows реализованы
- [ ] Compliance logging реализован
- [ ] Data deletion функция тестирована

### Post-Launch
- [ ] Privacy audit ежегодно
- [ ] Security audit раз в полгода
- [ ] Terms/Policy review при изменениях
- [ ] Compliance training для команды
- [ ] Incident response plan tested
- [ ] Data breach insurance
- [ ] Legal counsel on retainer

---

## Risk Management

### Potential Legal Issues

1. **Data Breach**
   - Risk: High impact
   - Mitigation: Encryption, audits, insurance
   - Response: Incident response plan, 72h notification

2. **COPPA Violation**
   - Risk: $43,000+ штраф за нарушение
   - Mitigation: Regular compliance audits
   - Response: Immediate remediation, legal counsel

3. **False Negative (пропуск угрозы)**
   - Risk: Lawsuit от родителей
   - Mitigation: Clear disclaimer, insurance
   - Response: Legal defense, improve AI

4. **False Positive (ложная тревога)**
   - Risk: User churn, reputation damage
   - Mitigation: High accuracy AI, feedback loop
   - Response: Apologize, improve

---

## Insurance

### Recommended Coverage

1. **Cyber Liability Insurance**
   - Coverage: $1-2M
   - Cost: ~$2,000/год
   - Covers: Data breaches, cyber attacks

2. **Errors & Omissions (E&O)**
   - Coverage: $2M
   - Cost: ~$3,000/год
   - Covers: Professional negligence, AI errors

3. **General Liability**
   - Coverage: $1M
   - Cost: ~$500/год
   - Covers: Basic business liability

**Total Insurance**: ~$5,500/год

---

## Contacts

**Legal Counsel**: [Law Firm Name]  
**Data Protection Officer**: [Name]  
**Compliance Email**: legal@rork-kiku.com

---

## См. также
- [Security Design](../security/architecture.md)
- [Privacy Policy](./privacy-policy.md)
- [Terms of Service](./terms-of-service.md)
