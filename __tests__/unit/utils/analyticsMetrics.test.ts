/**
 * Модульные тесты для вычисления аналитических метрик
 * Только детерминированные тесты - никаких интеграций/асинхронности
 */

import { calculateMetrics } from '@/utils/analyticsMetrics';
import { AnalyticsEventData } from '@/constants/AnalyticsContext';

describe('calculateMetrics', () => {
  it('должен возвращать дефолтные метрики для пустого массива событий', () => {
    const metrics = calculateMetrics([]);

    expect(metrics.totalMessages).toBe(0);
    expect(metrics.totalAlerts).toBe(0);
    expect(metrics.totalSOS).toBe(0);
    expect(metrics.messagesAnalyzed).toBe(0);
    expect(metrics.averageRiskLevel).toBe(0);
    expect(metrics.mostActiveChat).toBeNull();
  });

  it('должен правильно подсчитывать общее количество сообщений', () => {
    const events: AnalyticsEventData[] = [
      { event: 'message_sent', timestamp: Date.now() },
      { event: 'message_sent', timestamp: Date.now() },
      { event: 'message_sent', timestamp: Date.now() },
    ];

    const metrics = calculateMetrics(events);

    expect(metrics.totalMessages).toBe(3);
    expect(metrics.eventsByType['message_sent']).toBe(3);
  });

  it('должен правильно подсчитывать проанализированные сообщения', () => {
    const events: AnalyticsEventData[] = [
      {
        event: 'message_analyzed',
        timestamp: Date.now(),
        properties: { riskLevel: 'low' },
      },
      {
        event: 'message_analyzed',
        timestamp: Date.now(),
        properties: { riskLevel: 'medium' },
      },
    ];

    const metrics = calculateMetrics(events);

    expect(metrics.messagesAnalyzed).toBe(2);
    expect(metrics.riskDistribution.low).toBe(1);
    expect(metrics.riskDistribution.medium).toBe(1);
  });

  it('должен правильно вычислять средний уровень риска', () => {
    const events: AnalyticsEventData[] = [
      {
        event: 'message_analyzed',
        timestamp: Date.now(),
        properties: { riskLevel: 'safe' }, // 0
      },
      {
        event: 'message_analyzed',
        timestamp: Date.now(),
        properties: { riskLevel: 'low' }, // 1
      },
      {
        event: 'message_analyzed',
        timestamp: Date.now(),
        properties: { riskLevel: 'medium' }, // 2
      },
      {
        event: 'message_analyzed',
        timestamp: Date.now(),
        properties: { riskLevel: 'high' }, // 3
      },
    ];

    const metrics = calculateMetrics(events);

    // (0 + 1 + 2 + 3) / 4 = 1.5
    expect(metrics.averageRiskLevel).toBe(1.5);
  });

  it('должен правильно определять самый активный чат', () => {
    const events: AnalyticsEventData[] = [
      {
        event: 'message_analyzed',
        timestamp: Date.now(),
        properties: { chatId: 'chat1', riskLevel: 'safe' },
      },
      {
        event: 'message_analyzed',
        timestamp: Date.now(),
        properties: { chatId: 'chat1', riskLevel: 'safe' },
      },
      {
        event: 'message_analyzed',
        timestamp: Date.now(),
        properties: { chatId: 'chat2', riskLevel: 'safe' },
      },
    ];

    const metrics = calculateMetrics(events);

    expect(metrics.mostActiveChat).toBe('chat1');
  });

  it('должен правильно подсчитывать alerts и SOS', () => {
    const events: AnalyticsEventData[] = [
      { event: 'alert_created', timestamp: Date.now() },
      { event: 'alert_created', timestamp: Date.now() },
      { event: 'alert_resolved', timestamp: Date.now() },
      { event: 'sos_triggered', timestamp: Date.now() },
    ];

    const metrics = calculateMetrics(events);

    expect(metrics.totalAlerts).toBe(2);
    expect(metrics.alertsResolved).toBe(1);
    expect(metrics.totalSOS).toBe(1);
  });

  it('должен правильно группировать события по дням', () => {
    const baseTime = new Date('2024-01-15T10:00:00Z').getTime();
    const events: AnalyticsEventData[] = [
      { event: 'message_sent', timestamp: baseTime },
      { event: 'message_sent', timestamp: baseTime + 3600000 }, // +1 час, тот же день
      { event: 'message_sent', timestamp: baseTime + 86400000 }, // +1 день
    ];

    const metrics = calculateMetrics(events);

    expect(metrics.dailyActivity.length).toBeGreaterThan(0);
    const day1 = metrics.dailyActivity.find((d) => d.date === '2024-01-15');
    expect(day1?.events).toBe(2);
  });

  it('должен правильно обрабатывать все уровни риска', () => {
    const riskLevels: Array<'safe' | 'low' | 'medium' | 'high' | 'critical'> = [
      'safe',
      'low',
      'medium',
      'high',
      'critical',
    ];

    const events: AnalyticsEventData[] = riskLevels.map((level) => ({
      event: 'message_analyzed',
      timestamp: Date.now(),
      properties: { riskLevel: level },
    }));

    const metrics = calculateMetrics(events);

    expect(metrics.riskDistribution.safe).toBe(1);
    expect(metrics.riskDistribution.low).toBe(1);
    expect(metrics.riskDistribution.medium).toBe(1);
    expect(metrics.riskDistribution.high).toBe(1);
    expect(metrics.riskDistribution.critical).toBe(1);
  });

  it('должен возвращать 0 для averageRiskLevel если нет проанализированных сообщений', () => {
    const events: AnalyticsEventData[] = [
      { event: 'message_sent', timestamp: Date.now() },
      { event: 'alert_created', timestamp: Date.now() },
    ];

    const metrics = calculateMetrics(events);

    expect(metrics.averageRiskLevel).toBe(0);
    expect(metrics.messagesAnalyzed).toBe(0);
  });
});
