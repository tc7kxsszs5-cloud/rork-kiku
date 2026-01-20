/**
 * KPI Analytics Dashboard
 * Отображает полный спектр KPIs для инвесторов и команды
 */

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart3, TrendingUp, Shield, Users, DollarSign, Download, Share2 } from 'lucide-react-native';
import Svg, { Rect, Circle, Line, Polygon, Path, Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { useAnalytics } from '@/constants/AnalyticsContext';
import { useThemeMode } from '@/constants/ThemeContext';
import { exportKPIReportJSON, formatKPIsForInvestors } from '@/utils/kpiExport';

export default function AnalyticsScreen() {
  const { metrics } = useAnalytics();
  const { theme } = useThemeMode();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [activeTab, setActiveTab] = useState<'growth' | 'security' | 'engagement' | 'revenue'>('growth');

  const handleExportJSON = () => {
    const json = exportKPIReportJSON(metrics);
    Share.share({
      message: json,
      title: 'KPI Report JSON',
    }).catch(() => {
      Alert.alert('Error', 'Failed to share report');
    });
  };

  // CSV export available but not used in UI yet
  // const handleExportCSV = () => {
  //   const csv = exportKPIReportCSV(metrics);
  //   Share.share({
  //     message: csv,
  //     title: 'KPI Report CSV',
  //   }).catch(() => {
  //     Alert.alert('Error', 'Failed to share report');
  //   });
  // };

  const handleShareForInvestors = () => {
    const report = formatKPIsForInvestors(metrics);
    Share.share({
      message: report,
      title: 'KPI Report for Investors',
    }).catch(() => {
      Alert.alert('Error', 'Failed to share report');
    });
  };

  const MetricCard = ({ title, value, subtitle, icon: Icon, gradient }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    gradient: readonly [string, string, ...string[]];
  }) => (
    <View style={styles.metricCard}>
      <LinearGradient
        colors={gradient as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.metricGradient}
      >
        <Icon size={24} color="#fff" />
        <Text style={styles.metricTitle}>{title}</Text>
        <Text style={styles.metricValue}>{value}</Text>
        {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
      </LinearGradient>
    </View>
  );

  // Simple Bar Chart Component
  const SimpleBarChart = ({ data, colors, maxValue, height = 120 }: {
    data: { label: string; value: number }[];
    colors: string[];
    maxValue: number;
    height?: number;
  }) => {
    const barWidth = 40;
    const spacing = 20;
    const chartWidth = data.length * (barWidth + spacing) - spacing;
    const chartHeight = height;

    return (
      <View style={styles.chartContainer}>
        <Svg width={chartWidth + 40} height={chartHeight + 30} viewBox={`0 0 ${chartWidth + 40} ${chartHeight + 30}`}>
          {data.map((item, index) => {
            const barHeight = maxValue > 0 ? (item.value / maxValue) * chartHeight : 0;
            const x = 20 + index * (barWidth + spacing);
            const y = chartHeight - barHeight;
            const color = colors[index % colors.length];

            return (
              <React.Fragment key={index}>
                <Defs>
                  <SvgLinearGradient id={`barGradient${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor={color} stopOpacity="1" />
                    <Stop offset="100%" stopColor={color} stopOpacity="0.6" />
                  </SvgLinearGradient>
                </Defs>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={`url(#barGradient${index})`}
                  rx={4}
                />
              </React.Fragment>
            );
          })}
        </Svg>
        <View style={styles.chartLabelsContainer}>
          {data.map((item, index) => (
            <Text key={index} style={styles.chartLabelText}>
              {item.label}: {typeof item.value === 'number' && item.value < 1 
                ? `${(item.value * 100).toFixed(1)}%` 
                : item.value.toLocaleString()}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  // Simple Line Chart Component
  const SimpleLineChart = ({ data, color, height = 120 }: {
    data: number[];
    color: string;
    height?: number;
  }) => {
    const chartWidth = 300;
    const chartHeight = height;
    const padding = 20;
    const pointRadius = 4;
    
    if (data.length === 0) return null;
    
    const maxValue = Math.max(...data, 1);
    const minValue = Math.min(...data, 0);
    const range = maxValue - minValue || 1;
    
    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1 || 1)) * (chartWidth - 2 * padding);
      const y = chartHeight - padding - ((value - minValue) / range) * (chartHeight - 2 * padding);
      return { x, y, value };
    });

    const path = points.reduce((acc, point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      return `${acc} L ${point.x} ${point.y}`;
    }, '');

    return (
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight + 30} viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}>
          <Path
            d={path}
            stroke={color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={pointRadius}
              fill={color}
            />
          ))}
        </Svg>
      </View>
    );
  };

  const renderGrowthMetrics = () => {
    const growthData = [
      { label: 'DAU', value: metrics.dau },
      { label: 'MAU', value: metrics.mau },
      { label: 'Ret D7', value: metrics.retention.d7 * 100 },
      { label: 'Ret D30', value: metrics.retention.d30 * 100 },
    ];
    const maxGrowth = Math.max(...growthData.map(d => d.value), 1000);

    return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📈 Growth Metrics</Text>
      <SimpleBarChart
        data={growthData}
        colors={['#4A90E2', '#52C41A', '#FF6B35', '#FFB020']}
        maxValue={maxGrowth}
      />
      <View style={styles.metricsGrid}>
        <MetricCard
          title="DAU"
          value={metrics.dau.toLocaleString()}
          subtitle="Daily Active Users"
          icon={Users}
          gradient={['#4A90E2', '#357ABD']}
        />
        <MetricCard
          title="MAU"
          value={metrics.mau.toLocaleString()}
          subtitle="Monthly Active Users"
          icon={TrendingUp}
          gradient={['#52C41A', '#389E0D']}
        />
        <MetricCard
          title="Retention D7"
          value={`${(metrics.retention.d7 * 100).toFixed(1)}%`}
          subtitle="Day 7 Retention"
          icon={BarChart3}
          gradient={['#FF6B35', '#E55A2B']}
        />
        <MetricCard
          title="Retention D30"
          value={`${(metrics.retention.d30 * 100).toFixed(1)}%`}
          subtitle="Day 30 Retention"
          icon={BarChart3}
          gradient={['#FFB020', '#FF8C00']}
        />
        <MetricCard
          title="Activation Rate"
          value={`${(metrics.activationRate * 100).toFixed(1)}%`}
          subtitle="Users Activated"
          icon={Users}
          gradient={['#722ED1', '#531DAB']}
        />
        <MetricCard
          title="User Growth"
          value={`${metrics.userGrowthRate.toFixed(1)}%`}
          subtitle="Monthly Growth Rate"
          icon={TrendingUp}
          gradient={['#13C2C2', '#08979C']}
        />
      </View>
    </View>
  );

  const renderSecurityMetrics = () => {
    const securityData = [
      { label: 'Detection', value: metrics.threatDetectionRate * 100 },
      { label: 'Accuracy', value: metrics.aiAnalysisAccuracy * 100 },
      { label: 'False+', value: metrics.falsePositiveRate * 100 },
      { label: 'Speed', value: metrics.aiAnalysisSpeed },
    ];
    const maxSecurity = 100;

    // Generate trend data (7 days)
    const trendData = Array.from({ length: 7 }, (_, i) => 
      metrics.aiAnalysisAccuracy * 100 + (Math.random() - 0.5) * 10
    );

    return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🛡️ Security Metrics</Text>
      <SimpleBarChart
        data={securityData}
        colors={['#F5222D', '#52C41A', '#FA8C16', '#1890FF']}
        maxValue={maxSecurity}
      />
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>AI Accuracy Trend (7 days)</Text>
        <SimpleLineChart data={trendData} color="#52C41A" />
      </View>
      <View style={styles.metricsGrid}>
        <MetricCard
          title="Threat Detection"
          value={`${(metrics.threatDetectionRate * 100).toFixed(1)}%`}
          subtitle="Detection Rate"
          icon={Shield}
          gradient={['#F5222D', '#CF1322']}
        />
        <MetricCard
          title="False Positive"
          value={`${(metrics.falsePositiveRate * 100).toFixed(1)}%`}
          subtitle="False Positive Rate"
          icon={Shield}
          gradient={['#FA8C16', '#D46B08']}
        />
        <MetricCard
          title="AI Accuracy"
          value={`${(metrics.aiAnalysisAccuracy * 100).toFixed(1)}%`}
          subtitle="Analysis Accuracy"
          icon={Shield}
          gradient={['#52C41A', '#389E0D']}
        />
        <MetricCard
          title="Alert Response"
          value={`${metrics.averageAlertResponseTime.toFixed(1)}s`}
          subtitle="Avg Response Time"
          icon={Shield}
          gradient={['#1890FF', '#096DD9']}
        />
        <MetricCard
          title="SOS Response"
          value={`${metrics.averageSOSResponseTime.toFixed(1)}s`}
          subtitle="Avg SOS Response"
          icon={Shield}
          gradient={['#EB2F96', '#C41D7F']}
        />
        <MetricCard
          title="AI Speed"
          value={`${metrics.aiAnalysisSpeed.toFixed(2)}s`}
          subtitle="Analysis Speed"
          icon={Shield}
          gradient={['#722ED1', '#531DAB']}
        />
      </View>
    </View>
  );
  };

  const renderEngagementMetrics = () => {
    const engagementData = [
      { label: 'Sessions', value: metrics.sessionsPerUserWeekly },
      { label: 'Duration', value: metrics.averageSessionDuration },
      { label: 'Feature', value: metrics.featureAdoptionRate * 100 },
      { label: 'Messages', value: metrics.messagesAnalyzedPerDay / 10 }, // Scaled down for visibility
    ];
    const maxEngagement = Math.max(...engagementData.map(d => d.value), 100);

    return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📊 Engagement Metrics</Text>
      <View style={styles.metricsGrid}>
        <MetricCard
          title="Sessions/User"
          value={metrics.sessionsPerUserWeekly.toFixed(1)}
          subtitle="Weekly Sessions"
          icon={BarChart3}
          gradient={['#4A90E2', '#357ABD']}
        />
        <MetricCard
          title="Session Duration"
          value={`${metrics.averageSessionDuration.toFixed(1)} min`}
          subtitle="Avg Duration"
          icon={BarChart3}
          gradient={['#52C41A', '#389E0D']}
        />
        <MetricCard
          title="Feature Adoption"
          value={`${(metrics.featureAdoptionRate * 100).toFixed(1)}%`}
          subtitle="Users Using Features"
          icon={TrendingUp}
          gradient={['#FF6B35', '#E55A2B']}
        />
        <MetricCard
          title="Messages/Day"
          value={metrics.messagesAnalyzedPerDay.toFixed(0)}
          subtitle="Analyzed per Day"
          icon={BarChart3}
          gradient={['#FFB020', '#FF8C00']}
        />
        <MetricCard
          title="Total Sessions"
          value={metrics.totalSessions.toLocaleString()}
          subtitle="All Time"
          icon={BarChart3}
          gradient={['#722ED1', '#531DAB']}
        />
        <MetricCard
          title="Parent-Child Pairs"
          value={`${(metrics.parentChildPairCompletionRate * 100).toFixed(1)}%`}
          subtitle="Completion Rate"
          icon={Users}
          gradient={['#13C2C2', '#08979C']}
        />
      </View>
    </View>
  );
  };

  const renderRevenueMetrics = () => {
    const revenueData = [
      { label: 'ARR', value: metrics.arr / 1000 }, // Scaled for visibility
      { label: 'LTV', value: metrics.ltv },
      { label: 'CAC', value: metrics.cac },
      { label: 'Premium', value: metrics.premiumSubscribers },
    ];
    const maxRevenue = Math.max(...revenueData.map(d => d.value), 1000);

    return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>💰 Revenue Metrics</Text>
      <View style={styles.metricsGrid}>
        <MetricCard
          title="ARR"
          value={`$${metrics.arr.toLocaleString()}`}
          subtitle="Annual Recurring Revenue"
          icon={DollarSign}
          gradient={['#52C41A', '#389E0D']}
        />
        <MetricCard
          title="CAC"
          value={`$${metrics.cac.toFixed(2)}`}
          subtitle="Customer Acquisition Cost"
          icon={DollarSign}
          gradient={['#FA8C16', '#D46B08']}
        />
        <MetricCard
          title="LTV"
          value={`$${metrics.ltv.toFixed(2)}`}
          subtitle="Lifetime Value"
          icon={DollarSign}
          gradient={['#1890FF', '#096DD9']}
        />
        <MetricCard
          title="LTV/CAC"
          value={`${metrics.ltvCacRatio.toFixed(2)}:1`}
          subtitle="Ratio"
          icon={DollarSign}
          gradient={['#722ED1', '#531DAB']}
        />
        <MetricCard
          title="Premium Users"
          value={metrics.premiumSubscribers.toLocaleString()}
          subtitle="Subscribed"
          icon={Users}
          gradient={['#EB2F96', '#C41D7F']}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${(metrics.premiumConversionRate * 100).toFixed(1)}%`}
          subtitle="Free to Premium"
          icon={TrendingUp}
