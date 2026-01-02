# Apple Developer Compliance Guide for KIKU

## App Store Review Guidelines Compliance

### 1. Children's Category (1.3)

KIKU is designed for children and families, requiring special attention to:

#### 1.3.1 Apps Designed for Children
- **Age Rating**: Set to 4+ (suitable for all ages with parental guidance)
- **Parental Controls**: Comprehensive parental control features implemented
- **Data Collection**: Minimal data collection with parental consent
- **Advertising**: No advertising or in-app purchases aimed at children
- **External Links**: All external links protected by parental gate

#### 1.3.2 COPPA Compliance
- **Parental Consent**: Required for children under 13
- **Privacy Policy**: Clear, accessible privacy policy
- **Data Practices**: Transparent data collection and usage
- **No Behavioral Advertising**: No tracking for advertising purposes
- **Data Security**: Enhanced security for children's data

### 2. Privacy (5.1)

#### 5.1.1 Data Collection and Storage
**What We Collect:**
- User profile information (name, date of birth)
- Parent/guardian contact details
- Location data (only for SOS emergency features)
- Message content (for safety analysis only)
- Images and voice recordings (for content moderation)

**How We Use It:**
- Safety monitoring and threat detection
- Emergency response (SOS alerts)
- Parental control enforcement
- Age-appropriate content filtering
- Compliance with legal requirements

**Data Storage:**
- Local storage on device (primary)
- Encrypted using hardware-backed security (iOS Keychain)
- No cloud storage of personal content
- No sharing with third parties

#### 5.1.2 Privacy Policy
- Accessible in app and at www.kiku-app.com/privacy
- Written in plain language
- Available before account creation
- Covers all data practices
- Updated with user notification

### 3. Permission Requests (5.1.2)

All permission requests include clear, specific purpose descriptions:

#### Location Services
**Purpose**: "KIKU uses your location to provide emergency SOS alerts with precise location data to parents and guardians in critical situations."

**When Used**:
- Only during SOS activation
- Background location only during active emergency
- Can be disabled (disables SOS features)

#### Microphone
**Purpose**: "KIKU uses your microphone to analyze voice messages for child safety and detect inappropriate content or threats."

**When Used**:
- Voice message recording
- Real-time safety analysis
- Stored locally, not uploaded

#### Camera
**Purpose**: "KIKU uses your camera to capture and analyze images for inappropriate content, helping protect children from harmful visual material."

**When Used**:
- Photo sharing in monitored chats
- Image content analysis
- Stored locally with encryption

#### Contacts
**Purpose**: "KIKU accesses your contacts to help parents create whitelists of approved contacts for their children."

**When Used**:
- Setting up approved contact list
- Read-only access
- No contact data uploaded

#### Face ID / Touch ID
**Purpose**: "KIKU uses Face ID to provide secure biometric authentication, protecting sensitive parental controls and child safety settings."

**When Used**:
- Parental control access
- Account authentication
- Optional security feature

### 4. Data Security (5.1.3)

#### Encryption
- **At Rest**: iOS Keychain for sensitive data
- **In Transit**: HTTPS/TLS for all network requests
- **Local Storage**: AsyncStorage with encryption layer

#### Access Controls
- Biometric authentication for parental controls
- Role-based access (parent vs. child)
- Session timeout (30 minutes)
- Secure session management

#### Data Retention
- Account data: Until deletion requested
- Safety logs: 90 days
- SOS records: 1 year (legal requirement)
- Deleted data: Permanently removed within 30 days

### 5. App Functionality (2.1)

#### Core Features
1. **Message Monitoring**: AI-powered content analysis
2. **Parental Controls**: Time limits, contact restrictions
3. **Emergency SOS**: One-tap emergency alerts with location
4. **Activity Dashboard**: Usage statistics and risk reports
5. **Age-Based Filtering**: Content filtering by age group

#### Platform Compatibility
- iOS 13.0 or later
- iPadOS 13.0 or later
- Native iOS app (not web wrapper)
- Optimized for iPhone and iPad

### 6. Performance (2.3)

#### App Size
- Binary size: < 200MB
- On-demand resources for optional features
- Efficient asset compression

#### Battery Usage
- Background location only during SOS
- Optimized background processing
- No unnecessary background tasks

#### Resource Management
- Efficient memory usage
- Local processing (no constant server calls)
- Graceful degradation on older devices

### 7. User Interface (4.0)

#### Design Guidelines
- Follows Human Interface Guidelines
- Native iOS controls and patterns
- Clear navigation and hierarchy
- Accessibility support (VoiceOver, Dynamic Type)

#### Child-Friendly Design
- Large, clear buttons
- Simple navigation
- Age-appropriate UI elements
- Safety indicators visible

### 8. Localization (5.1.1)

#### Initial Release
- English (US)
- Russian

#### Future Expansions
- Spanish (planned)
- Additional languages based on user feedback

### 9. TestFlight Requirements

#### Beta Testing Checklist
- [ ] All features functional on physical devices
- [ ] Permissions tested and working
- [ ] Push notifications tested
- [ ] SOS system tested with real location
- [ ] Biometric authentication tested
- [ ] Parental controls validated
- [ ] Privacy policy accessible
- [ ] Age verification working

#### Tester Instructions
1. Create parent account first
2. Set up parental controls
3. Create child account (requires parent consent)
4. Test message monitoring
5. Test SOS functionality
6. Verify biometric authentication
7. Check activity dashboard
8. Test time restrictions

### 10. App Store Submission

#### Required Assets
- [ ] App icon (1024x1024px)
- [ ] Screenshots (all required device sizes)
- [ ] App preview video (optional, recommended)
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] Marketing URL

#### Metadata
```
Name: KIKU - Child Safety Monitor
Subtitle: AI-Powered Protection for Children
Category: Education / Parenting
Age Rating: 4+
Price: Free

Description:
KIKU is an AI-powered child safety application designed to protect children in their digital communications. With advanced content analysis, parental controls, and emergency SOS features, KIKU provides peace of mind for parents while respecting children's privacy.

Features:
• AI-powered message and image analysis
• Real-time threat detection and alerts
• Emergency SOS with location sharing
• Comprehensive parental controls
• Age-appropriate content filtering
• Activity monitoring dashboard
• COPPA, GDPR, and TDPSA compliant

Perfect for:
- Parents concerned about online safety
- Families with children using messaging apps
- Schools and educational institutions
- Child welfare organizations

Privacy First:
All data stored locally on device. No cloud storage of personal content. Full transparency and parental control over data collection.

Keywords:
parental control, child safety, content moderation, ai safety, family protection, child monitor, safe messaging
```

#### Privacy Nutrition Labels
**Data Used to Track You**: None

**Data Linked to You**:
- Name
- Date of birth
- Email address (parent)
- Location (only for SOS)
- User content (analyzed locally)

**Data Not Linked to You**: None

**Purpose of Data Collection**:
- App Functionality (safety monitoring)
- Product Personalization (age-appropriate filtering)
- Developer Communications (emergency notifications)

### 11. App Review Notes

**Special Instructions for Reviewers:**

This app requires creating two accounts for full testing:
1. Parent account (no age restrictions)
2. Child account (requires parent consent if under 13)

Test credentials are not needed - reviewers can create test accounts.

**SOS Testing:**
The SOS feature requests location permission. This can be tested without triggering actual alerts to guardians. The app will show a simulated alert in the parental control screen.

**AI Analysis:**
The AI content analysis runs locally on device. Test messages with specific keywords (e.g., "help me", "scared") will trigger different risk levels for demonstration.

**Biometric Authentication:**
Face ID/Touch ID can be enabled in profile settings. This is optional and works with the device's enrolled biometric data.

**Age Verification:**
The app verifies user age through date of birth entry. Users under 13 require explicit parental consent, which is demonstrated through a consent checkbox during account creation.

### 12. Post-Approval Maintenance

#### Regular Updates
- Security patches: Monthly
- Feature updates: Quarterly
- Compliance updates: As regulations change

#### Monitoring
- Crash analytics: Sentry or similar
- Performance monitoring: Firebase Performance
- User feedback: In-app feedback system

#### Support
- Email: support@kiku-app.com
- Website: www.kiku-app.com/support
- Response time: Within 24 hours

### 13. Rejection Prevention

#### Common Rejection Reasons (Avoided)
✅ **2.1 App Completeness**: All features functional
✅ **2.3 Accurate Metadata**: Descriptions match functionality
✅ **4.0 Design**: Follows HIG, native UI
✅ **5.1 Privacy**: Complete privacy policy and permissions
✅ **1.3 Kids Category**: COPPA compliant, no inappropriate content

#### If Rejected
1. Read rejection reason carefully
2. Address all points mentioned
3. Test fixes thoroughly
4. Respond in Resolution Center
5. Resubmit with detailed explanation

### 14. Ongoing Compliance

#### Annual Review
- Privacy policy update
- Security audit
- COPPA compliance check
- Terms of service review
- Age rating verification

#### Regulatory Changes
- Monitor Apple guideline updates
- Track COPPA/GDPR changes
- Update app as needed
- Notify users of material changes

## Contact for Compliance Questions

**Developer Support**
- Email: developer@kiku-app.com
- Phone: [To be added]
- Website: www.kiku-app.com/developers

**Legal Inquiries**
- Email: legal@kiku-app.com
- Address: [To be added]

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0.0 | TBD | Initial release | In Development |

---

**Last Updated**: January 2, 2026
**Next Review**: Before App Store submission
