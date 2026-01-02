# KIKU Implementation Guide - Authentication & Compliance

## Overview

This guide documents the newly implemented features for authentication, age-based content filtering, and compliance with child safety regulations.

## New Features

### 1. Enhanced Authentication System

#### Biometric Authentication
The app now supports Face ID and Touch ID for parent authentication:

```typescript
import { useUser } from '@/constants/UserContext';

const { authenticateWithBiometric, enableBiometric } = useUser();

// Enable biometric authentication
await enableBiometric();

// Authenticate before sensitive operations
const success = await authenticateWithBiometric();
if (success) {
  // Proceed with sensitive operation
}
```

#### PIN Protection
Parents can set a PIN for additional security:

```typescript
const { setPIN, verifyPIN } = useUser();

// Set a PIN
await setPIN('1234');

// Verify PIN
const isValid = await verifyPIN('1234');
```

#### Age Groups
Children are automatically assigned to age groups based on their age:

- **Early Childhood (3-6 years)**: Strictest filtering
- **Middle Childhood (7-9 years)**: High filtering
- **Pre-Teen (10-12 years)**: Moderate filtering
- **Teen (13-17 years)**: Balanced filtering

```typescript
import { useUser, getAgeGroup } from '@/constants/UserContext';

// Age group is automatically calculated
const { user } = useUser();
console.log(user?.ageGroup); // 'middle-childhood'

// Or calculate manually
const ageGroup = getAgeGroup(8); // 'middle-childhood'
```

### 2. Age-Based AI Moderation

The AI moderation system now adapts to the child's age group:

```typescript
import { useMonitoring } from '@/constants/MonitoringContext';

const { updateAnalysisOptions } = useMonitoring();

// Update analysis based on child's age
updateAnalysisOptions({
  ageGroup: 'middle-childhood',
  sensitivity: 'high',
  blockedCategories: ['violence', 'sexual', 'drugs'],
});
```

#### AI Sensitivity Levels

- **Low**: Minimal filtering, fewer false positives
- **Medium**: Balanced approach (default)
- **High**: More cautious, catches more potential issues
- **Strict**: Maximum protection, may have more false positives

#### Content Categories

Parents can block specific content categories:
- `violence` - Violent content and threats
- `profanity` - Inappropriate language
- `sexual` - Sexual content
- `drugs` - Drug and substance references
- `bullying` - Bullying and harassment
- `threats` - Threats to safety
- `privacy` - Privacy violations

### 3. GDPR/COPPA Compliance

#### Data Export

Users can export all their data:

```typescript
import { exportAndShareData } from '@/constants/gdprUtils';

// Export and share data as JSON file
await exportAndShareData();
```

#### Data Deletion

Users have the right to delete all their data:

```typescript
import { deleteAllUserData } from '@/constants/gdprUtils';

// Delete all data (keeps compliance logs by default)
await deleteAllUserData(userId, true);
```

#### Parental Consent

Record and track parental consent:

```typescript
import { recordParentalConsent, hasRequiredConsents } from '@/constants/gdprUtils';

// Record consent
await recordParentalConsent(
  userId,
  'data_collection',
  true, // granted
  { version: '1.0' }
);

// Check if all required consents are granted
const { hasAllRequired, missing } = await hasRequiredConsents(userId);
```

#### Data Retention

View data retention policies:

```typescript
import { getDataRetentionSummary } from '@/constants/gdprUtils';

const summary = await getDataRetentionSummary();
console.log(summary.categories);
```

### 4. Parental Consent Screen

A new screen for managing consents and data rights:

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/parental-consent');
```

Features:
- Toggle consent for data collection, monitoring, location sharing
- View consent history with audit trail
- Export all user data
- Delete all user data
- View data retention policies
- Access privacy policy and terms of service

## Integration Guide

### Step 1: Update User Profile Creation

When creating a child profile, include age information:

```typescript
const { identifyUser } = useUser();

await identifyUser({
  name: 'Child Name',
  role: 'child',
  age: 8, // Age will auto-calculate ageGroup
  email: 'parent@example.com',
});
```

### Step 2: Configure AI Moderation

Set up age-based moderation in your parent controls:

```typescript
const { user } = useUser();
const { updateAnalysisOptions } = useMonitoring();
const { settings } = useParentalControls();

// Update AI analysis options when child profile changes
useEffect(() => {
  if (user?.role === 'child' && user.ageGroup) {
    updateAnalysisOptions({
      ageGroup: user.ageGroup,
      sensitivity: settings.aiSensitivity || 'medium',
      blockedCategories: settings.blockedCategories,
    });
  }
}, [user, settings]);
```

### Step 3: Implement Consent Flow

Before enabling monitoring features, ensure parental consent:

```typescript
import { hasRequiredConsents, recordParentalConsent } from '@/constants/gdprUtils';

const setupMonitoring = async () => {
  const { hasAllRequired, missing } = await hasRequiredConsents(userId);
  
  if (!hasAllRequired) {
    // Show consent screen
    Alert.alert(
      'Consent Required',
      `Please grant consent for: ${missing.join(', ')}`,
      [{ text: 'OK', onPress: () => router.push('/parental-consent') }]
    );
    return;
  }
  
  // Proceed with monitoring setup
};
```

### Step 4: Add Biometric Authentication

Protect sensitive settings with biometric authentication:

```typescript
const { authenticateWithBiometric, user } = useUser();

const handleSensitiveAction = async () => {
  if (user?.biometricEnabled) {
    const success = await authenticateWithBiometric();
    if (!success) {
      Alert.alert('Authentication Failed', 'Biometric authentication required');
      return;
    }
  }
  
  // Proceed with sensitive action
};
```

## Testing

### Test Age-Based Filtering

1. Create child profiles with different ages (5, 8, 11, 15)
2. Send messages with different content types
3. Verify that filtering adapts to age group

### Test Biometric Authentication

1. Enable biometric authentication in profile settings
2. Access sensitive settings
3. Verify Face ID/Touch ID prompt appears
4. Test fallback to PIN

### Test Data Export

1. Create sample data (profile, settings, alerts)
2. Navigate to Parental Consent screen
3. Tap "Export All Data"
4. Verify JSON file is created and shareable

### Test Consent Flow

1. Create new parent account
2. Check required consents status
3. Grant individual consents
4. Verify consent history is logged
5. Attempt to use features requiring consent

## Security Considerations

### Data Storage

- User data: AsyncStorage (encrypted at OS level)
- PINs: expo-secure-store (hardware-backed on supported devices)
- Compliance logs: AsyncStorage (retained for 3 years per legal requirements)

### Authentication

- Biometric authentication uses native Face ID/Touch ID APIs
- PIN fallback available if biometric fails
- Session tracking with lastLoginAt timestamp

### Privacy

- All data stored locally on device
- No data transmitted to external servers without explicit consent
- Data export includes all personal information (GDPR compliance)
- Data deletion is permanent (except compliance logs for legal reasons)

## Compliance Checklist

### COPPA Compliance
- [x] Parental consent before data collection
- [x] Verifiable consent mechanism
- [x] Parent can review collected data
- [x] Parent can delete child's data
- [x] Transparent privacy notice
- [x] Consent audit trail

### GDPR Compliance
- [x] Right to access data (export)
- [x] Right to erasure (deletion)
- [x] Right to data portability (JSON export)
- [x] Transparent data retention policies
- [x] Consent management
- [x] Data minimization (automatic cleanup)
- [x] Privacy by design (local storage)

### Texas SCOPE Act
- [x] Parental notification system
- [x] Content filtering controls
- [x] Age verification (age groups)
- [x] Data privacy protections
- [x] Transparent monitoring practices

### Apple App Store Guidelines
- [x] Kids Category compliance
- [x] No third-party advertising
- [x] Clear privacy policy
- [x] Permission descriptions
- [x] Age-appropriate content filtering
- [x] Parental controls

## Troubleshooting

### Biometric Authentication Not Working

**Issue**: authenticateWithBiometric() fails

**Solutions**:
1. Check if device has biometric hardware: `await LocalAuthentication.hasHardwareAsync()`
2. Check if biometric is enrolled: `await LocalAuthentication.isEnrolledAsync()`
3. Ensure biometricEnabled is true in user profile
4. Fall back to PIN authentication

### Age Group Not Auto-Calculating

**Issue**: ageGroup is undefined after setting age

**Solutions**:
1. Verify age is a number, not string
2. Check age is in valid range (3-17)
3. Call updateUser() after changing age
4. Use getAgeGroup() utility function directly

### Data Export Fails

**Issue**: exportAndShareData() throws error

**Solutions**:
1. Check file system permissions
2. Verify expo-file-system is installed
3. Check sharing is available: `await Sharing.isAvailableAsync()`
4. Test on physical device (not all simulators support sharing)

### Consent Not Being Recorded

**Issue**: recordParentalConsent() succeeds but consent not showing in history

**Solutions**:
1. Verify userId matches current user
2. Check AsyncStorage is working
3. Reload consent history after recording
4. Check compliance log storage key is correct

## Future Enhancements

### Planned Features
- [ ] Multi-language AI moderation (currently Russian/English)
- [ ] Context-aware message analysis (conversation history)
- [ ] Educational content recommendations by age
- [ ] Age-specific UI themes
- [ ] Cloud sync with end-to-end encryption
- [ ] Advanced analytics and reporting

### Integration Opportunities
- [ ] Third-party AI services for enhanced filtering
- [ ] Parental control APIs for cross-platform monitoring
- [ ] Educational content providers
- [ ] Mental health support resources

## Support

For questions or issues:
- **Email**: support@kiku-app.com
- **Privacy**: privacy@kiku-app.com
- **Legal**: legal@kiku-app.com

## License

See LICENSE file for details. This software includes special terms for child safety applications.
