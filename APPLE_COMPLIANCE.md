# Apple App Store Compliance Guide - KIKU

## Overview

This document outlines KIKU's compliance with Apple App Store requirements, particularly for child safety applications.

## App Store Guidelines Compliance

### 1. Kids Category Requirements (Guideline 1.3)

KIKU complies with Kids Category guidelines:
- ✅ No third-party advertising
- ✅ No in-app purchases (or parent-gated if added)
- ✅ No links to external websites (or parent-gated)
- ✅ No personal data collection without parental consent
- ✅ Age-appropriate content
- ✅ Privacy Policy included
- ✅ COPPA compliant

### 2. Privacy Requirements (Guideline 5.1)

**Privacy Manifest (PrivacyInfo.xcprivacy)**
Required disclosures:
- Data types collected
- Purpose of collection
- Data usage practices
- Third-party access (none)

**Privacy Policy**
- Accessible within the app
- Describes all data practices
- COPPA/GDPR compliant
- Parent-friendly language

### 3. Data Collection and Storage (Guideline 5.1.1)

**Data Minimization:**
- Only essential data collected
- Stored locally on device
- No cloud sync without consent
- Automatic data cleanup

**Parental Consent:**
- Required for children under 13
- Verifiable consent mechanism
- Parent can review/delete data
- Consent logs maintained

### 4. Permissions (Guideline 5.1.2)

**Required Permissions:**
1. **Location (When In Use)**
   - Purpose: Emergency SOS alerts only
   - User control: Can be disabled
   - Clear explanation provided

2. **Microphone** (if voice messages)
   - Purpose: Voice message transcription
   - User control: Optional feature
   - Clear explanation provided

3. **Notifications**
   - Purpose: Safety alerts to parents
   - User control: Can be disabled
   - Clear explanation provided

4. **Face ID / Touch ID** (if enabled)
   - Purpose: Parent authentication
   - User control: Optional
   - Falls back to PIN

**Permission Strings (Info.plist):**
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>KIKU needs your location only for emergency SOS alerts to notify guardians of your child's location in case of emergency.</string>

<key>NSMicrophoneUsageDescription</key>
<string>KIKU needs microphone access to record and analyze voice messages for child safety.</string>

<key>NSFaceIDUsageDescription</key>
<string>KIKU uses Face ID to securely authenticate parents when accessing sensitive parental controls.</string>
```

### 5. Security (Guideline 2.5.3)

**Encryption:**
- Local data encrypted
- Secure storage for credentials
- TLS for any network communication

**Authentication:**
- PIN protection for parent features
- Biometric authentication support
- Session timeout

### 6. Legal Requirements (Guideline 5.1.4)

**Required Agreements:**
- ✅ Privacy Policy
- ✅ Terms of Service
- ✅ COPPA compliance statement
- ✅ GDPR compliance (for EU)

**Age Gates:**
- Parental verification required
- Child's age collected (for filtering)
- Age-appropriate content

## App Store Connect Metadata

### App Information

**Name:** KIKU - Kids Safety Monitor  
**Subtitle:** AI-Powered Child Communication Safety  
**Category:** Lifestyle or Parenting  
**Age Rating:** 4+ (app itself safe for all ages)

### Age Rating Questionnaire

**Violence:** None  
**Medical/Treatment Information:** None  
**Profanity or Crude Humor:** None  
**Sexual Content or Nudity:** None  
**Horror/Fear Themes:** None  
**Mature/Suggestive Themes:** None  
**Alcohol, Tobacco, or Drug Use:** None  
**Simulated Gambling:** None  
**Contests, Sweepstakes:** None  
**Unrestricted Web Access:** No  
**User-Generated Content:** No

### Privacy Practices (App Privacy Section)

#### Data Collected:

**Contact Info:**
- Email address (parent only, optional)
- Purpose: Account management, notifications
- Not linked to identity
- Not used for tracking

**Identifiers:**
- Device ID
- Purpose: Local storage only
- Not linked to identity
- Not used for tracking

**Location:**
- Precise location (when SOS activated)
- Purpose: Emergency alerts only
- Not linked to identity
- Not used for tracking

**User Content:**
- Messages (for analysis)
- Purpose: Safety monitoring
- Stored locally only
- Not shared with third parties

#### Data Not Collected:
- ❌ No tracking across apps/websites
- ❌ No advertising data
- ❌ No analytics without consent
- ❌ No health data
- ❌ No financial data
- ❌ No contacts (except whitelist)

### Description

**Short Description:**
AI-powered safety monitoring for children's digital communication. Parents protect kids from online threats while respecting privacy.

**Full Description:**
KIKU is a comprehensive child safety application that uses artificial intelligence to protect children from online threats while maintaining family privacy and trust.

**Key Features:**
• AI-powered message analysis for threats, bullying, and inappropriate content
• Real-time safety alerts to parents
• Age-appropriate content filtering
• Time restrictions and screen time management
• Emergency SOS button with location sharing
• Contact whitelist management
• Complete COPPA and GDPR compliance
• All data stored locally on device

**For Parents:**
• Monitor without invading privacy
• Receive alerts only when necessary
• Set age-appropriate boundaries
• Customize safety settings
• Emergency notification system

**For Children:**
• Safe communication environment
• Age-appropriate protections
• Educational safety tips
• Privacy-respecting monitoring

**Safety First:**
KIKU prioritizes child safety while respecting family privacy. All data is stored locally on your device, and we never sell or share personal information.

**Compliance:**
Fully compliant with COPPA, GDPR, and child protection laws. Designed for families who value both safety and privacy.

### Keywords

kiku, kids safety, parental controls, child monitoring, ai safety, child protection, screen time, family safety, coppa compliant, online safety

### Support URL

https://www.kiku-app.com/support

### Marketing URL

https://www.kiku-app.com

### Privacy Policy URL

https://www.kiku-app.com/privacy

## Required Documents for Submission

### 1. Privacy Manifest (PrivacyInfo.xcprivacy)

Location: `ios/[AppName]/PrivacyInfo.xcprivacy`

Contents:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyAccessedAPITypes</key>
    <array>
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>CA92.1</string>
            </array>
        </dict>
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryFileTimestamp</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>C617.1</string>
            </array>
        </dict>
    </array>
    <key>NSPrivacyTracking</key>
    <false/>
    <key>NSPrivacyTrackingDomains</key>
    <array/>
    <key>NSPrivacyCollectedDataTypes</key>
    <array>
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeEmailAddress</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <false/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
            </array>
        </dict>
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypePreciseLocation</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <false/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
```

### 2. Export Compliance

**Does your app use encryption?**
Yes, for local data storage (exempt under ECCN 5A992)

**Export Compliance Certificate:**
Not required for standard encryption use.

## TestFlight Beta Testing

### Beta Information

**What to Test:**
1. Parental authentication flow
2. AI content analysis accuracy
3. Alert notification system
4. Time restriction enforcement
5. SOS emergency feature
6. Age-appropriate filtering
7. Data privacy controls

**Test Users:**
Recruit diverse families:
- Different age groups
- Various usage patterns
- Multiple device types
- Different languages

**Feedback Areas:**
- Ease of setup
- Alert accuracy
- False positive rate
- Privacy comfort level
- Feature usefulness

## Pre-Submission Checklist

### Technical Requirements
- [ ] App builds without errors
- [ ] All features tested on device
- [ ] Crash-free for 7 days
- [ ] Memory usage optimized
- [ ] Battery usage reasonable
- [ ] Works offline (local storage)

### Content Requirements
- [ ] App icon (1024x1024)
- [ ] Screenshots (all required sizes)
- [ ] Preview video (optional but recommended)
- [ ] App description complete
- [ ] Keywords optimized
- [ ] Support URL active
- [ ] Privacy Policy accessible
- [ ] Terms of Service accessible

### Legal Requirements
- [ ] Privacy Policy reviewed by legal
- [ ] COPPA compliance verified
- [ ] GDPR compliance verified
- [ ] Terms of Service finalized
- [ ] Age gate implemented
- [ ] Parental consent flow working
- [ ] Data deletion working

### Age Rating
- [ ] Age rating questionnaire completed
- [ ] Kids Category requirements met
- [ ] No inappropriate content
- [ ] No external links (or gated)
- [ ] No ads
- [ ] No purchases (or gated)

### Privacy
- [ ] Privacy manifest included
- [ ] Permission strings clear
- [ ] Data collection disclosed
- [ ] No tracking
- [ ] Local storage verified
- [ ] Encryption implemented

## Common Rejection Reasons and Solutions

### 1. Missing Privacy Policy
**Solution:** Link to PRIVACY_POLICY.md in app and App Store Connect

### 2. Inadequate Parental Consent
**Solution:** Implement robust parent verification with email and authentication

### 3. Unclear Permission Usage
**Solution:** Provide clear, user-friendly permission descriptions

### 4. Missing Privacy Manifest
**Solution:** Create PrivacyInfo.xcprivacy with accurate disclosures

### 5. Kids Category Violations
**Solution:** Ensure no ads, proper age-gating, COPPA compliance

## Maintenance and Updates

### Regular Updates Required
- Security patches
- iOS compatibility
- Bug fixes
- Feature improvements

### Update Checklist
- [ ] Test on latest iOS
- [ ] Update privacy policy if needed
- [ ] Review permissions
- [ ] Test all features
- [ ] Update screenshots if UI changed
- [ ] Check for deprecated APIs

## Contact for App Review

If reviewers need clarification:
- Provide test accounts (parent and child)
- Include demo video showing features
- Respond promptly to review questions
- Be prepared to explain AI moderation

## Resources

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [COPPA Compliance](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa)
- [Privacy Manifest Documentation](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)
- [Kids Category Guidelines](https://developer.apple.com/app-store/kids-apps/)

---

**Last Updated:** January 2026  
**Document Version:** 1.0
