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
import { useAnalytics } from '@/constants/AnalyticsContext';
import { useThemeMode } from '@/constants/ThemeContext';
import { exportKPIReportJSON, exportKPIReportCSV, formatKPIsForInvestors } from '@/utils/kpiExport';

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

  const handleExportCSV = () => {
    const csv = exportKPIReportCSV(metrics);
    Share.share({
      message: csv,
      title: 'KPI Report CSV',
    }).catch(() => {
      Alert.alert('Error', 'Failed to share report');
    });
  };

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
    gradient: string[];
  }) => (
    <View style={styles.metricCard}>
      <LinearGradient
        colors={gradient}
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

  const renderGrowthMetrics = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📈 Growth Metrics</Text>
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

  const renderSecurityMetrics = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🛡️ Security Metrics</Text>
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

  const renderEngagementMetrics = () => (
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

  const renderRevenueMetrics = () => (
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
          gradient={['#13C2C2', '#08979C']}
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 KPI Dashboard</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShareForInvestors}>
            <Share2 size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleExportJSON}>
            <Download size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'growth' && styles.tabActive]}
          onPress={() => setActiveTab('growth')}
        >
          <Text style={[styles.tabText, activeTab === 'growth' && styles.tabTextActive]}>
            Growth
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'security' && styles.tabActive]}
          onPress={() => setActiveTab('security')}
        >
          <Text style={[styles.tabText, activeTab === 'security' && styles.tabTextActive]}>
            Security
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'engagement' && styles.tabActive]}
          onPress={() => setActiveTab('engagement')}
        >
          <Text style={[styles.tabText, activeTab === 'engagement' && styles.tabTextActive]}>
            Engagement
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'revenue' && styles.tabActive]}
          onPress={() => setActiveTab('revenue')}
        >
          <Text style={[styles.tabText, activeTab === 'revenue' && styles.tabTextActive]}>
            Revenue
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'growth' && renderGrowthMetrics()}
      {activeTab === 'security' && renderSecurityMetrics()}
      {activeTab === 'engagement' && renderEngagementMetrics()}
      {activeTab === 'revenue' && renderRevenueMetrics()}
    </ScrollView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.card,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricGradient: {
    padding: 16,
    alignItems: 'flex-start',
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
    opacity: 0.9,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  metricSubtitle: {
    fontSize: 10,
    color: '#fff',
    marginTop: 4,
    opacity: 0.8,
  },
});
