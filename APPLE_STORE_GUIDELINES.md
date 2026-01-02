# KIKU - Apple App Store Submission Guidelines

## Overview

This document provides guidance for submitting KIKU to the Apple App Store, ensuring compliance with Apple's App Store Review Guidelines, particularly those related to child safety and privacy.

## Pre-Submission Checklist

### 1. App Store Review Guidelines Compliance

#### Kids Category Requirements (Guideline 1.3)

- ✅ **Age Rating**: Set appropriate age rating (9+ or 12+ recommended for safety app)
- ✅ **No Third-Party Advertising**: No ads or third-party advertising networks
- ✅ **No Third-Party Analytics**: Minimal analytics, no behavioral tracking
- ✅ **Parental Gate**: Implement parental authentication for sensitive features
- ✅ **COPPA Compliance**: Full compliance with COPPA for users under 13
- ✅ **Privacy Policy**: Comprehensive, accessible privacy policy

**KIKU Status**: ✅ Compliant
- No advertising or third-party trackers
- Parent authentication required for settings
- COPPA compliant with parental consent system
- Privacy policy available at [PRIVACY_POLICY.md](./PRIVACY_POLICY.md)

#### Privacy Requirements (Guideline 5.1)

- ✅ **Privacy Policy**: Must be provided and easily accessible
- ✅ **Data Use**: Clearly explain what data is collected and why
- ✅ **Data Collection**: Minimize data collection to what's necessary
- ✅ **Consent**: Obtain proper consent before collecting data
- ✅ **Access**: Allow users to access their data
- ✅ **Deletion**: Allow users to delete their data

**KIKU Status**: ✅ Compliant
- Privacy policy in app and documentation
- Local-first architecture minimizes data collection
- Clear consent flows for parents
- Complete data deletion available
- All data viewable by parents

#### Location Services (Guideline 5.1.5)

If using location services:
- ✅ **Purpose String**: Clear explanation in Info.plist
- ✅ **User Consent**: Request permission only when needed
- ✅ **Optional**: Location must be optional, not required

**KIKU Status**: ✅ Compliant
- Location used only for SOS emergency feature
- Clear purpose strings in app.json
- Location is optional and can be disabled
- Parent controls for location sharing

#### Permissions (Guideline 5.1.5)

All permissions must have clear purpose strings:

```json
{
  "ios": {
    "infoPlist": {
      "NSLocationWhenInUseUsageDescription": "KIKU uses your location during emergency SOS alerts to help parents and guardians respond quickly to safety concerns.",
      "NSLocationAlwaysUsageDescription": "KIKU may access your location in the background during active SOS alerts to provide continuous location updates to guardians.",
      "NSMicrophoneUsageDescription": "KIKU needs microphone access to record voice messages for safety monitoring and analysis."
    }
  }
}
```

### 2. App Privacy Details (Privacy Nutrition Labels)

#### Data Types Collected by KIKU

**Contact Info**:
- Name (for account identification)
- Email (for parent accounts only, optional)

**Health & Fitness**: None

**Financial Info**: None

**Location**:
- Precise Location (only during SOS, optional)
- Used for emergency response only

**Contact Info (Child)**:
- Name
- Not linked to identity
- Not used for tracking

**Usage Data**: None (no analytics)

**Identifiers**:
- Device ID (for app functionality)
- Not used for tracking
- Not shared with third parties

#### Purpose of Collection

- **App Functionality**: All data used solely for child safety monitoring
- **No Tracking**: Data not used for tracking across apps/websites
- **No Advertising**: No advertising or marketing purposes
- **No Third Parties**: Data not shared with third parties

### 3. Age Rating Configuration

#### Recommended Age Rating: **9+** or **12+**

**Content Descriptors to Address**:
- Infrequent/Mild Realistic Violence (in monitored content)
- Infrequent/Mild Mature/Suggestive Themes (in monitored content)

**Rationale**: 
- App monitors content that may contain these themes
- App itself does not contain or promote such content
- Designed to protect children from such content

#### Age Rating Configuration in App Store Connect:

1. **Made for Kids**: No (this is a parental control app, not a kids app)
2. **Age Rating**: 9+ or 12+
3. **Content Descriptors**: 
   - Select "Infrequent/Mild" for potentially monitored content types
   - Explain that app monitors and filters such content

### 4. App Store Connect Configuration

#### App Information

**Name**: KIKU

**Subtitle**: Child Safety & Parental Controls

**Category**: 
- Primary: Utilities or Lifestyle
- Secondary: Education (optional)

**Keywords** (100 characters max):
```
child safety, parental controls, monitoring, cyberbullying, family, kids protection, safe messaging
```

#### Description

**Template**:
```
KIKU - Protecting Children in the Digital World

KIKU is a comprehensive child safety platform that helps parents protect their children in digital communications through intelligent AI monitoring, robust parental controls, and full compliance with child protection laws.

KEY FEATURES:

🛡️ AI-Powered Safety
• Real-time content analysis
• Automatic threat detection
• Bullying and harassment protection
• Inappropriate content filtering

👨‍👩‍👧 Parental Controls
• Age-based content filtering
• Time restrictions and usage limits
• Contact management (whitelist/blacklist)
• Activity monitoring and alerts
• Emergency SOS with location

🔒 Privacy & Compliance
• COPPA, GDPR, and Texas HB 18 compliant
• Local-first data storage
• No third-party sharing
• Comprehensive parental consent
• Complete data control

DESIGNED FOR FAMILIES:
• Parent accounts with full oversight
• Child accounts with age-appropriate protections
• Secure parent-child account linking
• Real-time safety notifications

PEACE OF MIND:
KIKU gives parents the tools they need to protect their children online while respecting privacy and promoting healthy digital habits.

PRIVACY FIRST:
All data stored locally on device. No ads, no tracking, no third-party sharing. Your family's data belongs to you.

Learn more: [your website]
Privacy Policy: [link to privacy policy]
```

#### App Preview and Screenshots

**Required Screenshots** (per device size):
- 6.7" Display (iPhone 14 Pro Max, etc.)
- 6.5" Display (iPhone 11 Pro Max, etc.)
- 5.5" Display (iPhone 8 Plus, etc.)
- 12.9" Display (iPad Pro)

**Screenshot Guidelines**:
1. Show parental dashboard/controls
2. Demonstrate age verification
3. Show privacy settings
4. Display safety alerts
5. Show SOS feature (optional)

**Do NOT show**:
- Mock conversations with inappropriate content
- Children's faces (use stock photos or illustrations)
- Real personal information

#### App Preview Video (Optional)

- Length: 15-30 seconds
- Focus: Parent perspective and controls
- Avoid: Showing actual monitored content
- Highlight: Safety features and compliance

### 5. Required Documentation for Review

#### App Review Information

**Contact Information**:
- First Name: [Your Name]
- Last Name: [Your Name]
- Phone: [Support Phone]
- Email: support@kiku-app.com

**Demo Account**:
Provide test accounts for reviewers:
```
Parent Account:
Email: demo-parent@kiku-app.com
Password: [Test Password]

Child Account:
Email: demo-child@kiku-app.com
Password: [Test Password]
Note: Linked to parent account above
```

**Notes for Reviewer**:
```
KIKU is a child safety monitoring application designed for parents to protect their children in digital communications.

KEY POINTS FOR REVIEW:
1. Requires parent account creation first
2. Child accounts must be linked to parent
3. Age verification is mandatory
4. Location only used for optional SOS feature
5. All data stored locally on device
6. Fully COPPA, GDPR, and Texas HB 18 compliant

TESTING THE APP:
1. Create a parent account (role: parent, age 18+)
2. Create a child account (role: child, age <13)
3. Link child to parent via settings
4. Test parental controls in parent account
5. Test SOS feature (optional location access)

PRIVACY:
- No third-party analytics or advertising
- Local storage only
- No data transmission except optional features
- Complete privacy policy available in-app

For questions: support@kiku-app.com
```

### 6. Common Rejection Reasons to Avoid

#### Guideline 1.3 - Kids Category
- ❌ **Third-party advertising** → KIKU has none
- ❌ **Third-party analytics** → KIKU has minimal, privacy-focused analytics
- ❌ **Links to external sites** → Avoid or use parental gate
- ❌ **Purchases not for parents** → All IAP should require parent authentication

#### Guideline 2.1 - App Completeness
- ❌ **Broken features** → Test all features thoroughly
- ❌ **Placeholder content** → Ensure all content is final
- ❌ **Crashes** → Test on multiple devices and iOS versions

#### Guideline 5.1.1 - Privacy
- ❌ **No privacy policy** → KIKU has comprehensive policy
- ❌ **Unclear data use** → Clear explanations provided
- ❌ **Excessive data collection** → Local-first approach minimizes this

#### Guideline 5.1.2 - Data Use and Sharing
- ❌ **Data sharing not disclosed** → KIKU doesn't share data
- ❌ **No user consent** → Clear consent flows implemented

### 7. App Store Metadata

#### Primary Category: Utilities
**Rationale**: Parental control and safety monitoring utility

#### Secondary Category: Education (Optional)
**Rationale**: Provides educational resources about online safety

#### License Agreement
Use standard Apple EULA or provide custom terms:
- [TERMS_OF_SERVICE.md](./TERMS_OF_SERVICE.md)

### 8. Post-Submission Monitoring

#### Respond Promptly to Review
- Apple typically reviews within 24-48 hours
- Respond to any questions within 24 hours
- Be prepared to provide additional information

#### Common Review Questions

**Q: How does the app protect children?**
A: KIKU uses AI to analyze messages in real-time, alerting parents to risks. Parents have full control over settings and can see all activity.

**Q: What data is collected?**
A: Name, age (for verification), and monitored messages for safety analysis. All stored locally on device. No third-party sharing.

**Q: Is this COPPA compliant?**
A: Yes, fully compliant. Requires verifiable parental consent for children under 13, minimal data collection, and complete parental control.

**Q: Why do you need location access?**
A: Location is optional and only used for the emergency SOS feature. Parents can disable this in settings.

### 9. Post-Approval Best Practices

#### Regular Updates
- Maintain iOS compatibility
- Address security issues promptly
- Add new safety features
- Update for new regulations

#### Monitor Reviews
- Respond to user reviews
- Address common issues
- Improve based on feedback

#### Compliance Maintenance
- Stay updated on App Store guidelines
- Monitor COPPA/GDPR changes
- Update privacy policy as needed
- Regular security audits

### 10. Resources

#### Apple Developer Documentation
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Privacy Best Practices](https://developer.apple.com/documentation/uikit/protecting_the_user_s_privacy)
- [Kids Category Guidelines](https://developer.apple.com/app-store/review/guidelines/#kids-category)

#### KIKU Documentation
- [COMPLIANCE.md](./COMPLIANCE.md) - Compliance overview
- [PRIVACY_POLICY.md](./PRIVACY_POLICY.md) - Privacy policy
- [TERMS_OF_SERVICE.md](./TERMS_OF_SERVICE.md) - Terms of service
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Feature documentation

#### Support
- **Technical Support**: support@kiku-app.com
- **Privacy Questions**: privacy@kiku-app.com
- **Legal Questions**: legal@kiku-app.com

---

## Checklist Before Submission

- [ ] App tested on multiple iOS devices and versions
- [ ] All features working correctly
- [ ] No crashes or critical bugs
- [ ] Privacy policy accessible in app
- [ ] Terms of service accessible in app
- [ ] Demo accounts prepared for reviewers
- [ ] Clear reviewer notes prepared
- [ ] Screenshots prepared for all required sizes
- [ ] App Store description written and reviewed
- [ ] Keywords optimized
- [ ] Age rating selected and justified
- [ ] Privacy nutrition labels completed accurately
- [ ] All permission purpose strings clear and accurate
- [ ] No third-party advertising or tracking
- [ ] Parental gate implemented for sensitive features
- [ ] COPPA compliance verified
- [ ] Build uploaded to App Store Connect
- [ ] Contact information current and monitored

---

## Important Notes

1. **Be Transparent**: Apple values transparency about data usage and child safety
2. **Prioritize Privacy**: Emphasize local storage and minimal data collection
3. **Document Everything**: Comprehensive documentation helps reviewers understand the app
4. **Test Thoroughly**: A polished, bug-free app speeds approval
5. **Respond Quickly**: Fast responses to reviewer questions expedite approval

---

**Good luck with your submission! 🍀**

For questions about this guide or the submission process, contact: support@kiku-app.com

**Last Updated**: January 2, 2026  
**Version**: 1.0.0
