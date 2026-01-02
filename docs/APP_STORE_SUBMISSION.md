# App Store Submission Guide - KIKU Child Safety Platform

**Version:** 1.0  
**Last Updated:** January 2, 2026

## Overview

This guide provides detailed instructions for submitting KIKU to the Apple App Store and Google Play Store, ensuring compliance with platform requirements and maximizing approval chances.

---

## Table of Contents

1. [Pre-Submission Checklist](#pre-submission-checklist)
2. [Apple App Store Submission](#apple-app-store-submission)
3. [Google Play Store Submission](#google-play-store-submission)
4. [App Store Assets](#app-store-assets)
5. [Marketing Materials](#marketing-materials)
6. [Compliance Documentation](#compliance-documentation)
7. [Review Tips](#review-tips)

---

## 1. Pre-Submission Checklist

### Technical Requirements

**Both Platforms:**
- [ ] App builds successfully without errors
- [ ] All features tested on physical devices
- [ ] Crash reporting implemented
- [ ] Performance optimized (app size < 200MB)
- [ ] All APIs properly implemented
- [ ] Network security configured
- [ ] Deep linking configured

**iOS Specific:**
- [ ] App Store Connect account created
- [ ] Developer Program enrolled ($99/year)
- [ ] Bundle identifier registered
- [ ] Provisioning profiles configured
- [ ] App uses required privacy settings
- [ ] Encryption declaration ready

**Android Specific:**
- [ ] Google Play Console account created ($25 one-time)
- [ ] App signing key generated
- [ ] Package name registered
- [ ] Target API level 33+ (Android 13)
- [ ] Privacy policy URL added

### Legal Requirements

- [ ] Privacy Policy published and accessible
- [ ] Terms of Service published and accessible
- [ ] COPPA compliance verified
- [ ] GDPR compliance verified
- [ ] Age rating determined
- [ ] Content rating questionnaire completed
- [ ] Export compliance documentation ready

### Content Requirements

- [ ] App icon (1024x1024 PNG)
- [ ] App screenshots (multiple sizes)
- [ ] App preview video (optional but recommended)
- [ ] Feature graphic (Google Play)
- [ ] App description written
- [ ] Keywords optimized
- [ ] What's New text prepared
- [ ] Support email configured
- [ ] Marketing website ready

---

## 2. Apple App Store Submission

### 2.1 App Store Connect Setup

**Account Configuration:**
```
1. Visit: https://appstoreconnect.apple.com
2. Navigate to: My Apps → + → New App
3. Fill in:
   - Platform: iOS
   - Name: KIKU - Child Safety
   - Primary Language: English
   - Bundle ID: com.kiku.childsafety
   - SKU: kiku-child-safety-001
```

### 2.2 App Information

**Basic Details:**
```
Name: KIKU - Child Safety
Subtitle: Protect Kids from Online Dangers
Category: Primary - Parenting
         Secondary - Education
Age Rating: 4+
Price: Free (with future in-app purchases)
```

**Description:**
```
KIKU is a comprehensive child safety platform designed to protect children from cyberbullying, harassment, inappropriate content, and online dangers.

FEATURES:
• AI-Powered Content Monitoring
• Real-time Threat Detection
• Parental Controls & Oversight
• Age-Appropriate Customization
• Emergency SOS Button
• End-to-End Encryption
• COPPA & GDPR Compliant

SAFETY FIRST:
KIKU uses advanced AI to analyze messages, images, and voice communications for potential threats, giving parents peace of mind while respecting children's appropriate privacy.

AGE-APPROPRIATE:
Automatically adapts features based on child's age (3-7, 8-11, 12-14, 15-17) ensuring developmentally appropriate experiences.

PARENTAL CONTROL:
• Monitor all communications
• Set time restrictions
• Manage contacts
• Receive instant safety alerts
• Export all data anytime

PRIVACY & COMPLIANCE:
• COPPA Compliant
• GDPR Compliant
• Local data storage
• End-to-end encryption
• No advertising
• No data sales

Perfect for parents who want to keep their children safe online while fostering healthy digital habits.
```

**Keywords:**
```
child safety, parental control, cyberbullying, kids protection, online safety, messaging monitor, child monitoring, family safety, COPPA, safe messaging
```

**Support URL:**
```
https://kiku-app.com/support
```

**Marketing URL:**
```
https://kiku-app.com
```

**Privacy Policy URL:**
```
https://kiku-app.com/privacy
```

### 2.3 Age Rating Questionnaire

**Content Rating:**
```
Cartoon or Fantasy Violence: None
Realistic Violence: None
Sexual Content or Nudity: None
Profanity or Crude Humor: None
Alcohol, Tobacco, or Drug Use: None
Mature/Suggestive Themes: None
Horror/Fear Themes: None
Medical/Treatment Information: None
Gambling: None
```

**Result:** 4+ (All Ages)

### 2.4 App Privacy Details

**Data Collection:**

**Contact Info:**
- [ ] Name (for personalization)
- [ ] Email Address (parent verification)
- [ ] Phone Number (parent verification)

**User Content:**
- [ ] Photos or Videos (safety analysis)
- [ ] Audio Data (voice message transcription)
- [ ] Customer Support (help requests)
- [ ] Other User Content (messages for safety)

**Identifiers:**
- [ ] Device ID (session management)

**Location:**
- [ ] Precise Location (SOS emergencies only)

**Purpose:** Safety monitoring and child protection

**Linked to User:** Yes  
**Used for Tracking:** No

### 2.5 Build Upload

**Using EAS Build:**
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for App Store
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

**Manual Upload (if needed):**
```bash
# Archive the app in Xcode
# Product → Archive → Distribute App → App Store Connect

# Or use Transporter app
# Download from Mac App Store
# Upload .ipa file
```

### 2.6 TestFlight Testing

**Internal Testing:**
```
1. Add internal testers in App Store Connect
2. Distribute build to testers
3. Collect feedback
4. Fix critical issues
5. Submit new build if needed
```

**External Testing:**
```
1. Requires basic app review
2. Add external testers (up to 10,000)
3. Public link available
4. Collect broader feedback
```

### 2.7 App Review Information

**Contact Information:**
```
First Name: [Your Name]
Last Name: [Your Last Name]
Phone Number: [Your Phone]
Email: review@kiku-app.com
```

**Demo Account:**
```
Username: demo_parent@kiku-app.com
Password: DemoPassword123!

Note: This is a parent account with one linked child account for review purposes.
```

**Notes for Reviewer:**
```
KIKU is a child safety monitoring platform compliant with COPPA and GDPR.

HOW TO TEST:
1. Login with provided parent account
2. View the linked child's monitored conversations
3. Test SOS emergency button (simulated)
4. Review parental control settings
5. Check age-appropriate features

IMPORTANT:
- All AI analysis is performed for child safety only
- Data stored locally on device
- No advertising or marketing to children
- Parental consent required for all child accounts
- Complies with Apple's child privacy guidelines

PERMISSIONS EXPLAINED:
- Location: Only for SOS emergencies
- Microphone: For voice message transcription and analysis
- Camera/Photos: For image safety analysis

Please contact review@kiku-app.com with any questions.
```

### 2.8 Encryption Declaration

**Export Compliance:**
```
Does your app use encryption? YES

App uses encryption that is:
- [ ] Exempt (standard encryption only)
- [X] Non-exempt (requires declaration)

Reason: App uses end-to-end encryption for child safety communications.

CCATS/ERN: [To be obtained from BIS]

Alternatively: Self-classify as mass market encryption if using standard algorithms only.
```

---

## 3. Google Play Store Submission

### 3.1 Google Play Console Setup

**Create App:**
```
1. Visit: https://play.google.com/console
2. Click: Create app
3. Fill in:
   - App name: KIKU - Child Safety
   - Default language: English (United States)
   - App or game: App
   - Free or paid: Free
```

### 3.2 Store Listing

**Short Description (80 chars):**
```
Protect children from cyberbullying & online dangers with AI-powered safety
```

**Full Description (4000 chars max):**
```
[Use same as iOS with Android-specific formatting]
```

**App Category:**
```
Primary: Parenting
Tags: Child Safety, Parental Controls, Cyberbullying Prevention
```

**Contact Details:**
```
Email: support@kiku-app.com
Phone: [Your Phone]
Website: https://kiku-app.com
```

### 3.3 Graphics Assets

**Required:**
- App icon: 512x512 PNG (32-bit, with alpha)
- Feature graphic: 1024x500 PNG or JPEG
- Phone screenshots: Min 2, max 8 (JPEG or PNG, 16:9 or 9:16)
- 7-inch tablet screenshots: Optional
- 10-inch tablet screenshots: Optional

**Promotional:**
- Promo graphic: 180x120 PNG or JPEG
- Promo video: YouTube URL

### 3.4 Content Rating

**IARC Questionnaire:**
```
Does your app contain:
- Violence: No
- Sexual content: No
- Profanity: No
- Controlled substances: No
- User interaction: Yes (monitored communication)
- Share location: Yes (emergency only)
- User-generated content: Yes (monitored messages)
- Gambling: No

Target Age: Designed for everyone, requires parental supervision
```

**Expected Rating:** E (Everyone) or PEGI 3

### 3.5 Privacy & Safety

**Data Safety Section:**

**Data Collection:**
```
Personal Info:
- Name: Required for child safety monitoring
- Email: Parent verification only
- Phone: Parent verification only

Photos and Videos:
- Photos: Analyzed for safety, not stored permanently

Audio Files:
- Voice recordings: Transcribed and analyzed for safety

App Activity:
- App interactions: Monitored for safety purposes

Location:
- Precise location: Emergency SOS only
```

**Data Usage:**
```
Purpose: App functionality (safety monitoring)
Is collection optional: No (required for safety)
Is data encrypted: Yes
Can users request data deletion: Yes
```

**Data Sharing:**
```
Does app share data with third parties: No
```

### 3.6 App Content

**Target Audience:**
```
Target age group: Ages 5 and under, Ages 6-8, Ages 9-12, Teen
Is app directed at children: Yes
Ads: No
In-app purchases: No (currently)
```

**COVID-19 Contact Tracing:**
```
Is this a contact tracing app: No
```

### 3.7 Release

**Countries/Regions:**
```
Available in: All countries (or select specific)
```

**Production Release:**
```
Release type: Managed publishing
Rollout: 100% (or staged rollout: 1%, 5%, 10%, 50%, 100%)
```

**App Signing:**
```
Use Google Play App Signing: Yes (recommended)
Upload key: Generated via EAS or manually
```

### 3.8 Build Upload

**Using EAS:**
```bash
# Build for Google Play
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android
```

**Manual Upload:**
```bash
# Build AAB (Android App Bundle)
# Upload .aab file to Google Play Console
# Release → Production → Create new release
```

---

## 4. App Store Assets

### 4.1 Screenshot Requirements

**iPhone (Required):**
- 6.7" Display: 1290×2796 (iPhone 15 Pro Max)
- 6.5" Display: 1284×2778 (iPhone 13 Pro Max)
- 5.5" Display: 1242×2208 (iPhone 8 Plus)

**iPad (Optional):**
- 12.9" Display: 2048×2732 (iPad Pro)
- 11" Display: 1668×2388 (iPad Pro 11")

**Screenshot Content Ideas:**
1. Main monitoring dashboard
2. AI threat detection in action
3. Parental controls interface
4. SOS emergency feature
5. Age-appropriate customization
6. Safety statistics/reports
7. Settings and privacy controls
8. Testimonial or feature highlights

### 4.2 App Preview Video

**Specifications:**
- Resolution: 1080p or 4K
- Format: .mov, .m4v, or .mp4
- Length: 15-30 seconds
- Orientation: Portrait

**Content Script:**
```
0:00-0:05 - "Keep your children safe online"
0:05-0:10 - Show main dashboard with AI alerts
0:10-0:15 - Demonstrate parental controls
0:15-0:20 - Show age-appropriate features
0:20-0:25 - Highlight SOS emergency button
0:25-0:30 - End with "Download KIKU today"
```

### 4.3 Icon Guidelines

**Requirements:**
- Size: 1024×1024 pixels
- Format: PNG (no transparency)
- Color space: RGB
- No rounded corners (iOS adds automatically)
- No text overlay
- Recognizable at small sizes

**Design Tips:**
- Use shield or protection symbol
- Incorporate child safety theme
- Bright, trustworthy colors
- Simple, memorable design

---

## 5. Marketing Materials

### 5.1 Website Landing Page

**Essential Elements:**
- Hero section with main value proposition
- Feature showcase with screenshots
- Parent testimonials (when available)
- Security and compliance badges
- Privacy policy link
- Terms of service link
- Download buttons (App Store & Play Store)
- FAQ section
- Contact information

### 5.2 Press Kit

**Include:**
- Company overview
- App description
- Key features list
- Screenshots (high-resolution)
- App icon (various sizes)
- Founder photo and bio
- Press release
- Contact information

### 5.3 Launch Strategy

**Pre-Launch:**
- [ ] Beta testing with select parents
- [ ] Gather testimonials
- [ ] Create social media presence
- [ ] Prepare PR materials
- [ ] Contact parenting blogs/influencers

**Launch Day:**
- [ ] Submit to app review directories
- [ ] Post on social media
- [ ] Email marketing campaign
- [ ] Press release distribution
- [ ] Monitor reviews and feedback

**Post-Launch:**
- [ ] Respond to all reviews
- [ ] Fix reported bugs quickly
- [ ] Collect user feedback
- [ ] Plan feature updates
- [ ] Build community

---

## 6. Compliance Documentation

### 6.1 Required Documents

**For Review:**
1. Privacy Policy (linked in app and stores)
2. Terms of Service (linked in app and stores)
3. COPPA Compliance Statement
4. Data Processing Agreement (if applicable)
5. Age Verification Process Documentation

**Location:**
- All documents in `/docs` folder
- Published on website
- Accessible in-app

### 6.2 App Store Specific

**Apple:**
- Privacy nutrition labels configured
- Age rating questionnaire completed
- Export compliance documentation
- Parental consent mechanism explained

**Google:**
- Data safety form completed
- Designed for Families compliance (if applicable)
- Teacher approved (if targeting schools)

---

## 7. Review Tips

### 7.1 Common Rejection Reasons

**To Avoid:**
- Incomplete information
- Buggy app or crashes
- Poor app performance
- Privacy policy issues
- Misleading descriptions
- Placeholder content
- Insufficient parental consent
- Child privacy violations
- Unclear value proposition

### 7.2 Apple Review Guidelines

**Relevant Sections:**
- 1.1: Objectionable Content (child safety)
- 1.2: User Generated Content (monitoring)
- 1.3: Kids Category (COPPA compliance)
- 2.1: Performance (crashes, bugs)
- 2.3: Accurate Metadata
- 5.1.1: Privacy (data collection)
- 5.1.2: Data Retention and Deletion

### 7.3 Google Play Policies

**Key Policies:**
- Families Policy (child-directed apps)
- User Data (privacy and security)
- Permissions (only request necessary)
- Dangerous Products (child safety)
- Deceptive Behavior (accurate representation)

### 7.4 Response to Rejections

**If Rejected:**
1. Read rejection reason carefully
2. Address ALL issues mentioned
3. Test fixes thoroughly
4. Reply to review team with:
   - Explanation of changes made
   - Testing evidence
   - Additional context if needed
5. Resubmit promptly

**Appeal Process:**
- Available if you believe rejection was incorrect
- Provide detailed explanation
- Reference specific guidelines
- Be professional and respectful

---

## 8. Post-Approval

### 8.1 Monitoring

**Track:**
- Download numbers
- User ratings and reviews
- Crash reports
- User feedback
- Performance metrics

**Tools:**
- App Store Connect Analytics
- Google Play Console Statistics
- Firebase Analytics
- Crash reporting (Sentry, Firebase)

### 8.2 Updates

**Release Cycle:**
- Bug fixes: As needed (immediately)
- Minor updates: Monthly
- Major features: Quarterly
- Security updates: Immediately

**Update Notes Template:**
```
What's New:

✨ New Features
• [Feature 1]
• [Feature 2]

🔧 Improvements
• Enhanced [feature]
• Improved [performance]

🐛 Bug Fixes
• Fixed [issue]
• Resolved [problem]

Thank you for keeping your children safe with KIKU!
```

### 8.3 User Support

**Response Times:**
- Critical issues: 4 hours
- Bug reports: 24 hours
- Feature requests: 48 hours
- General inquiries: 48 hours

**Support Channels:**
- In-app support
- Email: support@kiku-app.com
- FAQ page
- Help center

---

## 9. Checklist Summary

### Pre-Submission ✓
- [ ] App tested on multiple devices
- [ ] All features working correctly
- [ ] Compliance documents prepared
- [ ] Marketing materials ready
- [ ] Support infrastructure set up

### Store Submission ✓
- [ ] App Store Connect configured
- [ ] Google Play Console configured
- [ ] All required assets uploaded
- [ ] Descriptions optimized
- [ ] Privacy details completed

### Post-Submission ✓
- [ ] Monitoring tools configured
- [ ] Support team ready
- [ ] Update plan prepared
- [ ] Marketing launch ready
- [ ] Community engagement planned

---

## 10. Resources

**Official Documentation:**
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Developer Policies](https://play.google.com/about/developer-content-policy/)
- [COPPA Rule](https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/childrens-online-privacy-protection-rule)

**Tools:**
- [EAS Build & Submit](https://docs.expo.dev/submit/introduction/)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)

**Support:**
- Email: submissions@kiku-app.com
- Review status updates: Check consoles regularly

---

**Document Version:** 1.0  
**Last Updated:** January 2, 2026  
**Next Review:** March 1, 2026

© 2026 KIKU - Child Safety Platform

**Good luck with your submission! 🚀**
