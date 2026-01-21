import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image as RNImage, Pressable, Linking, SafeAreaView, useWindowDimensions } from 'react-native';
import { AlertOctagon, Image as ImageIcon, Clock, Users, Lock, FileText, Eye } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import appIcon from '@/assets/images/icon.png';
import { PayPalButton, QuickDonateButton } from '@/components/PayPalButton';
import { logger } from '@/utils/logger';

const PROJECT_URL = 'https://rork.app/p/d8v7u672uumlfpscvnbps';

type StageHighlight = {
  title: string;
  value: string;
  description: string;
  accent: string;
};


export default function AboutScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;
  const isLargeScreen = width >= 414;

  const handleOpenProjectUrl = () => {
    Linking.openURL(PROJECT_URL).catch((error) => {
      logger.error('Failed to open project URL', error instanceof Error ? error : new Error(String(error)), { component: 'AboutScreen', action: 'handleOpenProjectUrl' });
    });
  };

  const stageHighlights: StageHighlight[] = [
    {
      title: t('about.stage'),
      value: 'Late MVP / Pre-Production',
      description: t('about.currentStatusDescription'),
      accent: '#2ecc71',
    },
    {
      title: t('about.aiContent'),
      value: t('about.ready'),
      description: t('about.aiContent'),
      accent: '#00c2ff',
    },
    {
      title: t('about.remainingSteps'),
      value: 'Integration backend + push',
      description: t('about.releaseReadinessHint'),
      accent: '#ff9f0a',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <RNImage
            source={appIcon}
            style={styles.appIcon}
            resizeMode="contain"
            testID="about-app-icon"
          />
          <Text style={styles.iconLabel} testID="about-app-icon-label" numberOfLines={1}>
            KIDS
          </Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>by Kiku</Text>
        <Text style={styles.subtitle} numberOfLines={2}>{t('about.subtitle')}</Text>
        <Text style={styles.version}>{t('about.version')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('about.currentStatus')}</Text>
        <Text style={styles.description} numberOfLines={0}>
          {t('about.currentStatusDescription')}
        </Text>
        <View style={[styles.stageGrid, isSmallScreen && styles.stageGridSmall]}>
          {stageHighlights.map((item, index) => (
            <View 
              key={item.title} 
              style={[
                styles.stageCard, 
                isSmallScreen && styles.stageCardSmall,
                isLargeScreen && styles.stageCardLarge
              ]} 
              testID={`about-stage-card-${index}`}
            >
              <View style={[styles.stagePill, { backgroundColor: item.accent }]}
                testID={`about-stage-pill-${index}`}
              >
                <Text style={styles.stagePillText} numberOfLines={1}>{item.title}</Text>
              </View>
              <Text style={styles.stageValue} numberOfLines={2}>{item.value}</Text>
              <Text style={styles.stageDescription} numberOfLines={4}>{item.description}</Text>
            </View>
          ))}
        </View>
        <View style={styles.progressBlock} testID="about-stage-progress">
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel} numberOfLines={1}>{t('about.releaseReadiness')}</Text>
            <Text style={styles.progressValue}>{t('about.releaseReadinessValue')}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressHint} numberOfLines={0}>
            {t('about.releaseReadinessHint')}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('about.aboutApp')}</Text>
        <Text style={styles.description} numberOfLines={0}>
          {t('about.aboutAppDescription')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('about.publishUrl')}</Text>
        <Text style={styles.description} numberOfLines={0}>
          {t('about.publishUrlDescription')}
        </Text>
        <Pressable
          style={({ pressed }) => [styles.urlCard, pressed && styles.urlCardPressed]}
          onPress={handleOpenProjectUrl}
          testID="about-project-url"
        >
          <Text style={styles.urlLabel}>{t('about.project')}</Text>
          <Text numberOfLines={1} style={styles.urlValue} ellipsizeMode="middle">
            {PROJECT_URL}
          </Text>
          <Text style={styles.urlHint}>{t('about.clickToOpen')}</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('about.license')}</Text>
        <View style={styles.licenseCard} testID="about-license-card">
          <Text style={styles.licenseStatus} numberOfLines={1}>{t('about.licenseNotFound')}</Text>
          <Text style={styles.licenseHint} numberOfLines={0}>
            {t('about.licenseHint1')}
          </Text>
          <Text style={styles.licenseHint} numberOfLines={0}>
            {t('about.licenseHint2')}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('about.mainFeatures')}</Text>
        
        <View style={styles.feature}>
          <View style={styles.featureIcon}>
            <Eye size={24} color="#FFD700" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle} numberOfLines={2}>{t('about.aiMonitoring')}</Text>
            <Text style={styles.featureDescription} numberOfLines={0}>
              {t('about.aiMonitoringDescription')}
            </Text>
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIcon}>
            <ImageIcon size={24} color="#FFD700" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle} numberOfLines={2}>{t('about.imageFiltering')}</Text>
            <Text style={styles.featureDescription} numberOfLines={0}>
              {t('about.imageFilteringDescription')}
            </Text>
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIcon}>
            <AlertOctagon size={24} color="#FFD700" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle} numberOfLines={2}>{t('about.sosButton')}</Text>
            <Text style={styles.featureDescription} numberOfLines={0}>
              {t('about.sosButtonDescription')}
            </Text>
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIcon}>
            <Clock size={24} color="#FFD700" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle} numberOfLines={2}>{t('about.timeRestrictions')}</Text>
            <Text style={styles.featureDescription} numberOfLines={0}>
              {t('about.timeRestrictionsDescription')}
            </Text>
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIcon}>
            <Users size={24} color="#FFD700" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle} numberOfLines={2}>{t('about.contactWhitelist')}</Text>
            <Text style={styles.featureDescription} numberOfLines={0}>
              {t('about.contactWhitelistDescription')}
            </Text>
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIcon}>
            <Lock size={24} color="#FFD700" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle} numberOfLines={2}>{t('about.dataEncryption')}</Text>
            <Text style={styles.featureDescription} numberOfLines={0}>
              {t('about.dataEncryptionDescription')}
            </Text>
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIcon}>
            <FileText size={24} color="#FFD700" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle} numberOfLines={2}>{t('about.coppaCompliance')}</Text>
            <Text style={styles.featureDescription} numberOfLines={0}>
              {t('about.coppaComplianceDescription')}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('about.technologies')}</Text>
        <View style={styles.techList}>
          <View style={styles.techItem}>
            <Text style={styles.techBullet}>•</Text>
            <Text style={styles.techText} numberOfLines={0}>{t('about.techAiModels')}</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techBullet}>•</Text>
            <Text style={styles.techText} numberOfLines={0}>{t('about.techEncryption')}</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techBullet}>•</Text>
            <Text style={styles.techText} numberOfLines={0}>{t('about.techStorage')}</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techBullet}>•</Text>
            <Text style={styles.techText} numberOfLines={0}>{t('about.techGeolocation')}</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techBullet}>•</Text>
            <Text style={styles.techText} numberOfLines={0}>{t('about.techVoice')}</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techBullet}>•</Text>
            <Text style={styles.techText} numberOfLines={0}>{t('about.techMonitoring')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('about.securityPrivacy')}</Text>
        <Text style={styles.description} numberOfLines={0}>
          {t('about.securityPrivacyDescription')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('about.supportProject')}</Text>
        <Text style={styles.description} numberOfLines={0}>
          {t('about.supportProjectDescription')}
        </Text>
        <View style={styles.donateContainer}>
          <PayPalButton label={t('about.supportProject')} variant="primary" size="large" />
          <QuickDonateButton />
        </View>
        <Text style={styles.donateHint} numberOfLines={0}>
          {t('about.supportProjectHint')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('about.support')}</Text>
        <Text style={styles.description} numberOfLines={0}>
          {t('about.supportDescription')}
        </Text>
        <Text style={styles.contactText} numberOfLines={1}>{t('about.email')}</Text>
        <Text style={styles.contactText} numberOfLines={1}>{t('about.website')}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText} numberOfLines={1}>{t('about.footer')}</Text>
        <Text style={styles.footerSubtext} numberOfLines={1}>
          {t('about.footerSubtext')}
        </Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff9e6',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff9e6',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    padding: 40,
    paddingTop: 20,
    backgroundColor: '#FFD700',
  },
  iconWrapper: {
    width: 128,
    height: 128,
    borderRadius: 32,
    backgroundColor: '#0d1b2a',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  appIcon: {
    width: 128,
    height: 128,
    borderRadius: 32,
  },
  iconLabel: {
    position: 'absolute',
    fontSize: 32,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  title: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: '#1a1a1a',
    marginTop: 16,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#4a4a4a',
    marginTop: 8,
  },
  version: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  section: {
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
  stageGrid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap' as const,
    gap: 16,
    justifyContent: 'space-between',
  },
  stageGridSmall: {
    flexDirection: 'column',
    gap: 12,
  },
  stageCard: {
    flex: 1,
    minWidth: '48%',
    maxWidth: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  stageCardSmall: {
    minWidth: '100%',
    maxWidth: '100%',
  },
  stageCardLarge: {
    minWidth: '31%',
    maxWidth: '31%',
  },
  stagePill: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 12,
  },
  stagePillText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#0d1b2a',
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  stageValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#0d1b2a',
    marginBottom: 6,
    flexShrink: 1,
  },
  stageDescription: {
    fontSize: 13,
    color: '#4a4a4a',
    lineHeight: 18,
    flexShrink: 1,
  },
  progressBlock: {
    marginTop: 24,
    backgroundColor: '#0d1b2a',
    borderRadius: 18,
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#2ecc71',
  },
  progressBar: {
    height: 10,
    borderRadius: 8,
    backgroundColor: '#19273b',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '80%',
    backgroundColor: '#2ecc71',
    borderRadius: 8,
  },
  progressHint: {
    marginTop: 12,
    fontSize: 13,
    color: '#d5e2ff',
    lineHeight: 18,
  },
  feature: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
    flexShrink: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  techList: {
    marginTop: 8,
  },
  techItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingLeft: 8,
  },
  techBullet: {
    fontSize: 20,
    color: '#FFD700',
    marginRight: 12,
    fontWeight: '700' as const,
  },
  techText: {
    flex: 1,
    flexShrink: 1,
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  contactText: {
    fontSize: 15,
    color: '#007AFF',
    marginTop: 8,
  },
  urlCard: {
    marginTop: 16,
    backgroundColor: '#0d1b2a',
    borderRadius: 16,
    padding: 20,
  },
  urlCardPressed: {
    opacity: 0.8,
  },
  urlLabel: {
    fontSize: 14,
    color: '#9ab6d8',
    marginBottom: 4,
    fontWeight: '600' as const,
  },
  urlValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '700' as const,
  },
  urlHint: {
    marginTop: 12,
    fontSize: 12,
    color: '#9ab6d8',
  },
  licenseCard: {
    marginTop: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  licenseStatus: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  licenseHint: {
    fontSize: 14,
    color: '#4a4a4a',
    lineHeight: 20,
    marginTop: 6,
  },
  footer: {
    alignItems: 'center',
    padding: 40,
    paddingBottom: 60,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center',
  },
  donateContainer: {
    marginTop: 20,
    marginBottom: 12,
  },
  donateHint: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});
