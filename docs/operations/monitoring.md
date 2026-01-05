# Monitoring & Operations Guide - Rork-Kiku

## Monitoring Strategy

Comprehensive monitoring для обеспечения высокой доступности и производительности приложения.

## Key Metrics to Monitor

### 1. Application Metrics

#### Performance
- **Response Time**: P50, P95, P99
  - Target: P95 < 200ms
- **Render Time**: Первичный рендер экрана
  - Target: < 500ms
- **Bundle Size**: Размер приложения
  - Target: < 50MB
- **Memory Usage**: Потребление памяти
  - Target: < 200MB

#### Reliability
- **Crash Rate**: Процент сессий с крашами
  - Target: < 0.1%
- **Error Rate**: API errors
  - Target: < 1%
- **ANR Rate** (Android): Application Not Responding
  - Target: < 0.5%

#### Engagement
- **DAU/MAU**: Daily/Monthly Active Users
  - Target: > 35%
- **Session Duration**: Среднее время в приложении
  - Target: > 5 минут
- **Sessions per User**: Частота использования
  - Target: > 3/день

### 2. Business Metrics

#### User Acquisition
- **New Users**: Ежедневные регистрации
- **CAC**: Customer Acquisition Cost
- **Conversion Rate**: Free → Paid
  - Target: > 10%

#### Retention
- **Day 1**: Target > 70%
- **Day 7**: Target > 60%
- **Day 30**: Target > 40%
- **Churn Rate**: Месячный отток
  - Target: < 10%

#### Revenue
- **MRR**: Monthly Recurring Revenue
- **ARPU**: Average Revenue Per User
- **LTV**: Lifetime Value

### 3. Technical Metrics

#### API Health
- **Uptime**: Доступность API
  - Target: > 99.5%
- **Request Rate**: Requests per second
- **Error Rate**: API errors
  - Target: < 1%
- **Latency**: Response time
  - Target: P95 < 500ms

#### AI Metrics
- **Accuracy**: Correct classifications
  - Target: > 87%
- **Precision**: True positives rate
  - Target: > 85%
- **Recall**: Coverage of threats
  - Target: > 90%
- **F1 Score**: Harmonic mean
  - Target: > 0.87
- **Inference Time**: Time to analyze
  - Target: < 3s

#### Infrastructure
- **CPU Usage**: Average and peak
  - Target: < 70%
- **Memory Usage**: Average and peak
  - Target: < 80%
- **Disk I/O**: Read/write operations
- **Network Bandwidth**: Data transfer

---

## Monitoring Tools

### 1. Error Tracking: Sentry

**Setup**:
```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Sanitize sensitive data
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
    }
    return event;
  },
});
```

**Alerts**:
- Error rate > 5% (5 min window)
- New error type discovered
- Critical error (crash)

### 2. Performance: React Native Performance

**Custom Tracking**:
```typescript
import Performance from 'react-native-performance';

// Mark important events
Performance.mark('ai_analysis_start');
await analyzeMessage(text);
Performance.mark('ai_analysis_end');

// Measure duration
Performance.measure('ai_analysis', 'ai_analysis_start', 'ai_analysis_end');

// Get measurements
const measurements = Performance.getEntriesByType('measure');
console.log('AI Analysis Time:', measurements[0].duration);
```

### 3. Analytics: Custom Implementation

**Event Tracking**:
```typescript
const logEvent = async (event: string, properties?: Record<string, any>) => {
  const eventData = {
    event,
    properties,
    timestamp: new Date().toISOString(),
    userId: user?.id,
    sessionId: getSessionId(),
    platform: Platform.OS,
    appVersion: Constants.expoConfig?.version,
  };
  
  // Store locally (batch send later)
  await AsyncStorage.setItem(
    `@analytics_${Date.now()}`,
    JSON.stringify(eventData)
  );
  
  // Batch send to backend (future)
  if (shouldSendBatch()) {
    await sendAnalyticsBatch();
  }
};

// Usage
await logEvent('message_sent', {
  chatId: chat.id,
  messageType: 'text',
  riskLevel: analysis.level,
});
```

### 4. API Monitoring

**Health Check Endpoint**:
```typescript
// backend/hono.ts
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});
```

**Monitoring Service** (external):
- Pingdom или UptimeRobot
- Check every 1 minute
- Alert on 3 consecutive failures

---

## Dashboards

### 1. Operations Dashboard

**Widgets**:
- System Health (uptime, errors)
- API Metrics (latency, throughput)
- Active Users (real-time)
- Error Rate (24h trend)
- AI Performance (accuracy, latency)

**Update Frequency**: Real-time

### 2. Product Dashboard

**Widgets**:
- DAU/MAU
- New Users (daily)
- Retention Curves
- Feature Usage
- Conversion Funnel
- User Feedback (NPS)

**Update Frequency**: Daily

### 3. Business Dashboard

**Widgets**:
- MRR Trend
- Churn Rate
- LTV/CAC Ratio
- Top Revenue Sources
- Growth Rate

**Update Frequency**: Weekly

---

## Alerting

### Critical Alerts (P0)

**Trigger**: Immediate action required
**Response Time**: < 15 minutes
**Notification**: Phone call + SMS + Slack

**Conditions**:
- API downtime > 5 minutes
- Crash rate > 5%
- Data loss detected
- Security breach

### High Priority (P1)

**Trigger**: Action required soon
**Response Time**: < 1 hour
**Notification**: Slack + Email

**Conditions**:
- Error rate > 5% (15 min)
- Latency P95 > 2s
- AI accuracy < 80%
- Critical feature broken

### Medium Priority (P2)

**Trigger**: Monitor closely
**Response Time**: < 4 hours
**Notification**: Slack

**Conditions**:
- Error rate > 2% (1 hour)
- Unusual traffic pattern
- Memory leak suspected
- Performance degradation

### Low Priority (P3)

**Trigger**: Fix in next sprint
**Response Time**: < 1 week
**Notification**: Ticket

**Conditions**:
- Minor UI bugs
- Non-critical warnings
- Documentation gaps

---

## On-Call Rotation

### Schedule
- **Primary**: On-call engineer (24/7)
- **Secondary**: Backup engineer
- **Escalation**: CTO/CEO

### Rotation
- 1 week shifts
- Handoff on Mondays 9 AM
- Compensation: +20% salary for week

### Responsibilities
- Monitor alerts
- Respond to incidents
- Document issues
- Post-mortem reports

---

## Incident Response

### Severity Levels

**SEV-1 (Critical)**
- Complete outage
- Data breach
- Mass user impact
- **Response**: Immediately

**SEV-2 (High)**
- Partial outage
- Major feature broken
- Significant user impact
- **Response**: < 1 hour

**SEV-3 (Medium)**
- Minor feature broken
- Small user impact
- Performance degraded
- **Response**: < 4 hours

**SEV-4 (Low)**
- Cosmetic issues
- Single user impact
- Enhancement requests
- **Response**: Next sprint

### Incident Workflow

1. **Detection**: Alert fired
2. **Assessment**: Determine severity
3. **Communication**: Notify stakeholders
4. **Investigation**: Root cause analysis
5. **Mitigation**: Deploy fix
6. **Verification**: Confirm resolution
7. **Documentation**: Post-mortem

### Communication Template

```markdown
## Incident: [Title]

**Status**: [Investigating / Identified / Monitoring / Resolved]
**Severity**: [SEV-1 / SEV-2 / SEV-3 / SEV-4]
**Impact**: [Description of user impact]
**Started**: [Timestamp]
**Updated**: [Timestamp]

### What happened
[Brief description]

### Current status
[What we're doing]

### Next steps
[What's planned]

### Timeline
- HH:MM - [Event]
- HH:MM - [Event]

### Updates
[Latest information]
```

---

## Post-Mortem Process

### When Required
- All SEV-1 incidents
- All SEV-2 incidents
- Recurring issues
- Near-misses

### Template

```markdown
# Post-Mortem: [Incident Title]

## Summary
[One paragraph summary]

## Timeline
- **Detection**: When/how discovered
- **Response**: Actions taken
- **Resolution**: When resolved

## Root Cause
[Technical explanation]

## Impact
- **Users affected**: [Number/percentage]
- **Duration**: [Time]
- **Revenue loss**: [If applicable]

## What went well
- [Item 1]
- [Item 2]

## What went wrong
- [Item 1]
- [Item 2]

## Action Items
- [ ] [Action with owner and deadline]
- [ ] [Action with owner and deadline]

## Lessons Learned
[Key takeaways]
```

---

## Maintenance Windows

### Scheduled Maintenance
- **Frequency**: Monthly
- **Day**: Second Sunday
- **Time**: 02:00-06:00 MSK
- **Notification**: 7 days advance

### Emergency Maintenance
- **Approval**: CTO required
- **Notification**: 1 hour minimum
- **Communication**: All channels

---

## Backup & Recovery

### Backup Strategy

**What to backup**:
- User data (AsyncStorage exports)
- Compliance logs
- Configuration
- Code repository

**Frequency**:
- Continuous: Git commits
- Daily: Compliance logs
- Weekly: Full data export (optional)

**Retention**:
- 7 days: Daily backups
- 4 weeks: Weekly backups
- 1 year: Monthly backups

### Recovery Procedures

**Data Loss**:
1. Identify scope
2. Restore from backup
3. Verify integrity
4. Notify affected users
5. Post-mortem

**Service Outage**:
1. Switch to backup instance
2. Investigate primary
3. Fix and redeploy
4. Switch back
5. Monitor closely

---

## Capacity Planning

### Growth Projections

| Metric | Current | 3 Months | 6 Months | 12 Months |
|--------|---------|----------|----------|-----------|
| Users | 5K | 15K | 50K | 100K |
| API RPS | 10 | 30 | 100 | 200 |
| Storage | 1GB | 5GB | 20GB | 50GB |
| AI Calls | 1K/day | 5K/day | 20K/day | 50K/day |

### Scaling Thresholds

**Alert when**:
- CPU > 70%
- Memory > 80%
- Disk > 75%
- API latency P95 > 1s

**Scale up**:
- Add API instances
- Increase AI quota
- Expand storage
- Optimize database

---

## Cost Monitoring

### Budget Tracking

**Monthly Budget**: $500

**Breakdown**:
- Infrastructure: $89
- AI API: $100-300
- Monitoring: $26
- Misc: $50

**Alerts**:
- 80% of budget reached
- Unusual spike in costs
- Quota exceeded

---

## Security Monitoring

### Security Metrics
- Failed login attempts
- Suspicious activity patterns
- API abuse
- Data access anomalies

### Security Alerts
- **Critical**: Multiple failed logins
- **High**: Unusual data access
- **Medium**: High API usage
- **Low**: Security warnings

### Security Audits
- **Daily**: Automated scans
- **Weekly**: Log review
- **Monthly**: Manual audit
- **Quarterly**: Penetration test

---

## Reporting

### Daily Report (Automated)
- System health
- Error summary
- User metrics
- AI performance

### Weekly Report
- Product metrics
- Business metrics
- Incident summary
- Action items

### Monthly Report
- Executive summary
- Growth metrics
- Financial metrics
- Strategic initiatives

---

## Contact

**Operations Team**: ops@rork-kiku.com  
**On-Call Phone**: +7 (XXX) XXX-XX-XX  
**Slack Channel**: #ops-alerts

---

## См. также
- [Deployment Guide](./deployment.md)
- [Security Operations](./security-ops.md)
- [Runbook](./runbook.md)
