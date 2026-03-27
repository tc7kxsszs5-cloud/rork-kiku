/**
 * Утилиты для экспорта KPI данных для инвесторов
 */

import { AnalyticsMetrics } from '@/constants/AnalyticsContext';
import { generateInvestorProjection } from './kpiModeling';

export interface KPIReport {
  generatedAt: string;
  period: {
    start: string;
    end: string;
  };
  metrics: AnalyticsMetrics;
  projections: ReturnType<typeof generateInvestorProjection>;
  summary: {
    keyMetrics: {
      dau: number;
      mau: number;
      retentionD7: number;
      retentionD30: number;
      activationRate: number;
      premiumConversionRate: number;
    };
    securityMetrics: {
      threatDetectionRate: number;
      falsePositiveRate: number;
      aiAnalysisAccuracy: number;
      averageAlertResponseTime: number;
    };
    engagementMetrics: {
      sessionsPerUserWeekly: number;
      averageSessionDuration: number;
      featureAdoptionRate: number;
    };
    revenueMetrics: {
      arr: number;
      cac: number;
      ltv: number;
      ltvCacRatio: number;
    };
  };
}

/**
 * Генерирует полный KPI отчет для инвесторов
 */
export function generateKPIReport(metrics: AnalyticsMetrics): KPIReport {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const projections = generateInvestorProjection();

  return {
    generatedAt: now.toISOString(),
    period: {
      start: thirtyDaysAgo.toISOString(),
      end: now.toISOString(),
    },
    metrics,
    projections,
    summary: {
      keyMetrics: {
        dau: metrics.dau,
        mau: metrics.mau,
        retentionD7: metrics.retention.d7,
        retentionD30: metrics.retention.d30,
        activationRate: metrics.activationRate,
        premiumConversionRate: metrics.premiumConversionRate,
      },
      securityMetrics: {
        threatDetectionRate: metrics.threatDetectionRate,
        falsePositiveRate: metrics.falsePositiveRate,
        aiAnalysisAccuracy: metrics.aiAnalysisAccuracy,
        averageAlertResponseTime: metrics.averageAlertResponseTime,
      },
      engagementMetrics: {
        sessionsPerUserWeekly: metrics.sessionsPerUserWeekly,
        averageSessionDuration: metrics.averageSessionDuration,
        featureAdoptionRate: metrics.featureAdoptionRate,
      },
      revenueMetrics: {
        arr: metrics.arr,
        cac: metrics.cac,
        ltv: metrics.ltv,
        ltvCacRatio: metrics.ltvCacRatio,
      },
    },
  };
}

/**
 * Экспортирует KPI отчет в JSON формат
 */
export function exportKPIReportJSON(metrics: AnalyticsMetrics): string {
  const report = generateKPIReport(metrics);
  return JSON.stringify(report, null, 2);
}

/**
 * Экспортирует KPI отчет в CSV формат (ключевые метрики)
 */
export function exportKPIReportCSV(metrics: AnalyticsMetrics): string {
  const report = generateKPIReport(metrics);
  const { keyMetrics, securityMetrics, engagementMetrics, revenueMetrics } = report.summary;

  const rows = [
    ['Category', 'Metric', 'Value'],
    ['Growth', 'DAU', keyMetrics.dau.toString()],
    ['Growth', 'MAU', keyMetrics.mau.toString()],
    ['Growth', 'Retention D7', (keyMetrics.retentionD7 * 100).toFixed(2) + '%'],
    ['Growth', 'Retention D30', (keyMetrics.retentionD30 * 100).toFixed(2) + '%'],
    ['Growth', 'Activation Rate', (keyMetrics.activationRate * 100).toFixed(2) + '%'],
    ['Security', 'Threat Detection Rate', (securityMetrics.threatDetectionRate * 100).toFixed(2) + '%'],
    ['Security', 'False Positive Rate', (securityMetrics.falsePositiveRate * 100).toFixed(2) + '%'],
    ['Security', 'AI Analysis Accuracy', (securityMetrics.aiAnalysisAccuracy * 100).toFixed(2) + '%'],
    ['Security', 'Avg Alert Response Time', securityMetrics.averageAlertResponseTime.toFixed(2) + 's'],
    ['Engagement', 'Sessions per User (Weekly)', engagementMetrics.sessionsPerUserWeekly.toFixed(2)],
    ['Engagement', 'Avg Session Duration', engagementMetrics.averageSessionDuration.toFixed(2) + ' min'],
    ['Engagement', 'Feature Adoption Rate', (engagementMetrics.featureAdoptionRate * 100).toFixed(2) + '%'],
    ['Revenue', 'ARR', '$' + revenueMetrics.arr.toFixed(2)],
    ['Revenue', 'CAC', '$' + revenueMetrics.cac.toFixed(2)],
    ['Revenue', 'LTV', '$' + revenueMetrics.ltv.toFixed(2)],
    ['Revenue', 'LTV/CAC Ratio', revenueMetrics.ltvCacRatio.toFixed(2)],
  ];

  return rows.map(row => row.join(',')).join('\n');
}

/**
 * Форматирует KPI метрики для презентации инвесторам
 */
export function formatKPIsForInvestors(metrics: AnalyticsMetrics): string {
  const report = generateKPIReport(metrics);
  const { keyMetrics, securityMetrics, engagementMetrics, revenueMetrics } = report.summary;
  const projections = report.projections;

  return `
📊 KPI REPORT - KIDS by KIKU
Generated: ${report.generatedAt}

🎯 KEY METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DAU (Daily Active Users):        ${keyMetrics.dau.toLocaleString()}
MAU (Monthly Active Users):      ${keyMetrics.mau.toLocaleString()}
Retention D7:                    ${(keyMetrics.retentionD7 * 100).toFixed(1)}%
Retention D30:                   ${(keyMetrics.retentionD30 * 100).toFixed(1)}%
Activation Rate:                 ${(keyMetrics.activationRate * 100).toFixed(1)}%
Premium Conversion Rate:          ${(keyMetrics.premiumConversionRate * 100).toFixed(1)}%

🛡️ SECURITY METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Threat Detection Rate:           ${(securityMetrics.threatDetectionRate * 100).toFixed(1)}%
False Positive Rate:              ${(securityMetrics.falsePositiveRate * 100).toFixed(1)}%
AI Analysis Accuracy:             ${(securityMetrics.aiAnalysisAccuracy * 100).toFixed(1)}%
Avg Alert Response Time:          ${securityMetrics.averageAlertResponseTime.toFixed(1)}s

📈 ENGAGEMENT METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sessions per User (Weekly):      ${engagementMetrics.sessionsPerUserWeekly.toFixed(1)}
Avg Session Duration:             ${engagementMetrics.averageSessionDuration.toFixed(1)} min
Feature Adoption Rate:             ${(engagementMetrics.featureAdoptionRate * 100).toFixed(1)}%

💰 REVENUE METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARR (Annual Recurring Revenue):   $${revenueMetrics.arr.toLocaleString()}
CAC (Customer Acquisition Cost): $${revenueMetrics.cac.toFixed(2)}
LTV (Lifetime Value):             $${revenueMetrics.ltv.toFixed(2)}
LTV/CAC Ratio:                    ${revenueMetrics.ltvCacRatio.toFixed(2)}:1

📊 PROJECTIONS (6 months)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Projected DAU:                    ${projections.projections[5].dau.toLocaleString()}
Projected MAU:                    ${projections.projections[5].mau.toLocaleString()}
Projected ARR:                    $${projections.projections[5].arr.toLocaleString()}
Projected Premium Users:          ${projections.projections[5].premiumUsers.toLocaleString()}
  `.trim();
}
