# kiku - AI-Powered Child Safety Messenger Monitor

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey.svg)
![React Native](https://img.shields.io/badge/React%20Native-Expo-blue.svg)

## 🎯 Миссия Проекта

**kiku** - это революционная платформа для защиты детей в цифровом мире, использующая мощь искусственного интеллекта для проактивного обнаружения угроз, сохраняя при этом баланс между безопасностью и приватностью.

Мы создаем **экосистему цифровой безопасности для детей**, которая:
- 🛡️ **Защищает проактивно** - предотвращает угрозы до того, как они нанесут вред
- 🔒 **Уважает приватность** - локальное хранение, end-to-end шифрование
- 🤖 **Использует AI** - понимает контекст, тон, скрытые намерения
- 🌍 **Доступна всем** - cross-platform (iOS, Android, Web)
- 👨‍👩‍👧 **Family-centric** - инструмент для диалога, а не шпионажа

> **"Каждый ребенок заслуживает безопасного цифрового детства. kiku делает это возможным."**

📖 [Подробнее о миссии проекта](./MISSION.md)

## 🚀 Почему kiku?

Традиционные методы родительского контроля либо **неэффективны** (простые фильтры по ключевым словам), либо **нарушают доверие** (тотальная слежка). kiku предлагает третий путь:

- **AI-first подход**: Современные NLP модели, понимающие контекст
- **Privacy-first**: Данные хранятся локально, не отправляются на внешние серверы
- **Real-time защита**: Мгновенный анализ текста, изображений, голосовых сообщений
- **5-уровневая система рисков**: От безопасного до критического
- **COPPA/GDPR-K compliant**: Полное соответствие законам защиты детей

## ✨ Основные Функции

### Безопасность и Мониторинг
- ✅ AI анализ текстовых сообщений (угрозы, травля, насилие, мошенничество)
- ✅ Анализ изображений на неприемлемый контент
- ✅ Транскрипция и анализ голосовых сообщений
- ✅ Кнопка SOS с геолокацией
- ✅ Real-time уведомления для родителей

### Родительский Контроль
- ✅ Временные ограничения использования
- ✅ Белый список контактов
- ✅ Блокировка неизвестных собеседников
- ✅ Настраиваемые email уведомления
- ✅ Панель управления настройками

### Приватность и Compliance
- ✅ Локальное хранение данных (AsyncStorage)
- ✅ End-to-end шифрование
- ✅ COPPA/GDPR-K соответствие
- ✅ Audit trail для родительских согласий

### Аналитика
- ✅ Детальная статистика безопасности
- ✅ AI рекомендации по безопасности
- ✅ Визуализация рисков и прогресса

## 🤝 Как Присоединиться

Мы ищем **талантливых энтузиастов**, которые разделяют нашу миссию защиты детей:

### Для Разработчиков
- AI/ML инженеры
- Mobile разработчики (React Native, iOS, Android)
- Backend инженеры
- Security специалисты

### Для Экспертов
- Детские психологи
- Специалисты по детской безопасности
- Privacy/compliance юристы
- UX/UI дизайнеры

### Для Community
- Маркетологи
- Контент-криейторы
- Амбассадоры проекта

📋 [Правила участия и contribution guide](./PARTICIPATION-GUIDELINES.md)

## 💰 Инвестиционные Возможности

kiku - это не только социальный проект, но и **огромная бизнес-возможность**:

- **Рынок**: $5+ млрд (детская безопасность онлайн)
- **Рост**: 25%+ ежегодный рост
- **Монетизация**: Freemium B2C, B2B (школы), API licensing
- **Преимущество**: AI-first + privacy focus + cross-platform

💡 [Подробнее об инвестировании](./INVESTMENT.md)

## 📊 Project Management

Мы используем GitHub для полной прозрачности разработки:

- **Project Board**: Kanban board для отслеживания задач
- **Issues**: Баги, feature requests, обсуждения
- **Discussions**: Идеи, вопросы, инвестирование
- **CI/CD**: Автоматизация проверки кода и сборки

📌 [Инструкция по настройке Project Board](./PROJECT_BOARD_SETUP.md)

## 📢 Маркетинг и Продвижение

Наша стратегия привлечения пользователей и участников:

- GitHub ecosystem (Discussions, Stars, Contributors)
- Developer communities (Reddit, Dev.to, Hacker News)
- Social media (Twitter, LinkedIn, YouTube)
- Content marketing (Blog, guest posts, podcasts)
- Partnerships (NGOs, schools, tech companies)

📣 [Полная маркетинговая стратегия](./MARKETING.md)

---

## Project info

This is a native cross-platform mobile app created with [Rork](https://rork.com)

**Platform**: Native iOS & Android app, exportable to web
**Framework**: Expo Router + React Native

## How can I edit this code?

There are several ways of editing your native mobile application.

### **Use Rork**

Simply visit [rork.com](https://rork.com) and prompt to build your app with AI.

Changes made via Rork will be committed automatically to this GitHub repo.

Whenever you make a change in your local code editor and push it to GitHub, it will be also reflected in Rork.

### **Use your preferred code editor**

If you want to work locally using your own code editor, you can clone this repo and push changes. Pushed changes will also be reflected in Rork.

If you are new to coding and unsure which editor to use, we recommend Cursor. If you're familiar with terminals, try Claude Code.

The only requirement is having Node.js & Bun installed - [install Node.js with nvm](https://github.com/nvm-sh/nvm) and [install Bun](https://bun.sh/docs/installation)

Follow these steps:

```bash
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
bun i

# Step 4: Start the instant web preview of your Rork app in your browser, with auto-reloading of your changes
bun run start-web

# Step 5: Start iOS preview
# Option A (recommended):
bun run start  # then press "i" in the terminal to open iOS Simulator
# Option B (if supported by your environment):
bun run start -- --ios
```

### **Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

## What technologies are used for this project?

This project is built with the most popular native mobile cross-platform technical stack:

- **React Native** - Cross-platform native mobile development framework created by Meta and used for Instagram, Airbnb, and lots of top apps in the App Store
- **Expo** - Extension of React Native + platform used by Discord, Shopify, Coinbase, Telsa, Starlink, Eightsleep, and more
- **Expo Router** - File-based routing system for React Native with support for web, server functions and SSR
- **TypeScript** - Type-safe JavaScript
- **React Query** - Server state management
- **Lucide React Native** - Beautiful icons

## How can I test my app?

### **On your phone (Recommended)**

1. **iOS**: Download the [Rork app from the App Store](https://apps.apple.com/app/rork) or [Expo Go](https://apps.apple.com/app/expo-go/id982107779)
2. **Android**: Download the [Expo Go app from Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
3. Run `bun run start` and scan the QR code from your development server

### **In your browser**

Run `bun start-web` to test in a web browser. Note: The browser preview is great for quick testing, but some native features may not be available.

### **iOS Simulator / Android Emulator**

You can test Rork apps in Expo Go or Rork iOS app. You don't need XCode or Android Studio for most features.

**When do you need Custom Development Builds?**

- Native authentication (Face ID, Touch ID, Apple Sign In)
- In-app purchases and subscriptions
- Push notifications
- Custom native modules

Learn more: [Expo Custom Development Builds Guide](https://docs.expo.dev/develop/development-builds/introduction/)

If you have XCode (iOS) or Android Studio installed:

```bash
# iOS Simulator
bun run start -- --ios

# Android Emulator
bun run start -- --android
```

## How can I deploy this project?

### **Publish to App Store (iOS)**

1. **Install EAS CLI**:

   ```bash
   bun i -g @expo/eas-cli
   ```

2. **Configure your project**:

   ```bash
   eas build:configure
   ```

3. **Build for iOS**:

   ```bash
   eas build --platform ios
   ```

4. **Submit to App Store**:
   ```bash
   eas submit --platform ios
   ```

For detailed instructions, visit [Expo's App Store deployment guide](https://docs.expo.dev/submit/ios/).

### **Publish to Google Play (Android)**

1. **Build for Android**:

   ```bash
   eas build --platform android
   ```

2. **Submit to Google Play**:
   ```bash
   eas submit --platform android
   ```

For detailed instructions, visit [Expo's Google Play deployment guide](https://docs.expo.dev/submit/android/).

### **Publish as a Website**

Your React Native app can also run on the web:

1. **Build for web**:

   ```bash
   eas build --platform web
   ```

2. **Deploy with EAS Hosting**:
   ```bash
   eas hosting:configure
   eas hosting:deploy
   ```

Alternative web deployment options:

- **Vercel**: Deploy directly from your GitHub repository
- **Netlify**: Connect your GitHub repo to Netlify for automatic deployments

## App Features

This template includes:

- **Cross-platform compatibility** - Works on iOS, Android, and Web
- **File-based routing** with Expo Router
- **Tab navigation** with customizable tabs
- **Modal screens** for overlays and dialogs
- **TypeScript support** for better development experience
- **Async storage** for local data persistence
- **Vector icons** with Lucide React Native

## Project Structure

```
├── app/                    # App screens (Expo Router)
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── _layout.tsx    # Tab layout configuration
│   │   └── index.tsx      # Home tab screen
│   ├── _layout.tsx        # Root layout
│   ├── modal.tsx          # Modal screen example
│   └── +not-found.tsx     # 404 screen
├── assets/                # Static assets
│   └── images/           # App icons and images
├── constants/            # App constants and configuration
├── app.json             # Expo configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Custom Development Builds

For advanced native features, you'll need to create a Custom Development Build instead of using Expo Go.

### **When do you need a Custom Development Build?**

- **Native Authentication**: Face ID, Touch ID, Apple Sign In, Google Sign In
- **In-App Purchases**: App Store and Google Play subscriptions
- **Advanced Native Features**: Third-party SDKs, platform-specifc features (e.g. Widgets on iOS)
- **Background Processing**: Background tasks, location tracking

### **Creating a Custom Development Build**

```bash
# Install EAS CLI
bun i -g @expo/eas-cli

# Configure your project for development builds
eas build:configure

# Create a development build for your device
eas build --profile development --platform ios
eas build --profile development --platform android

# Install the development build on your device and start developing
bun start --dev-client
```

**Learn more:**

- [Development Builds Introduction](https://docs.expo.dev/develop/development-builds/introduction/)
- [Creating Development Builds](https://docs.expo.dev/develop/development-builds/create-a-build/)
- [Installing Development Builds](https://docs.expo.dev/develop/development-builds/installation/)

## Advanced Features

### **Add a Database**

Integrate with backend services:

- **Supabase** - PostgreSQL database with real-time features
- **Firebase** - Google's mobile development platform
- **Custom API** - Connect to your own backend

### **Add Authentication**

Implement user authentication:

**Basic Authentication (works in Expo Go):**

- **Expo AuthSession** - OAuth providers (Google, Facebook, Apple) - [Guide](https://docs.expo.dev/guides/authentication/)
- **Supabase Auth** - Email/password and social login - [Integration Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- **Firebase Auth** - Comprehensive authentication solution - [Setup Guide](https://docs.expo.dev/guides/using-firebase/)

**Native Authentication (requires Custom Development Build):**

- **Apple Sign In** - Native Apple authentication - [Implementation Guide](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- **Google Sign In** - Native Google authentication - [Setup Guide](https://docs.expo.dev/guides/google-authentication/)

### **Add Push Notifications**

Send notifications to your users:

- **Expo Notifications** - Cross-platform push notifications
- **Firebase Cloud Messaging** - Advanced notification features

### **Add Payments**

Monetize your app:

**Web & Credit Card Payments (works in Expo Go):**

- **Stripe** - Credit card payments and subscriptions - [Expo + Stripe Guide](https://docs.expo.dev/guides/using-stripe/)
- **PayPal** - PayPal payments integration - [Setup Guide](https://developer.paypal.com/docs/checkout/mobile/react-native/)

**Native In-App Purchases (requires Custom Development Build):**

- **RevenueCat** - Cross-platform in-app purchases and subscriptions - [Expo Integration Guide](https://www.revenuecat.com/docs/expo)
- **Expo In-App Purchases** - Direct App Store/Google Play integration - [Implementation Guide](https://docs.expo.dev/versions/latest/sdk/in-app-purchases/)

**Paywall Optimization:**

- **Superwall** - Paywall A/B testing and optimization - [React Native SDK](https://docs.superwall.com/docs/react-native)
- **Adapty** - Mobile subscription analytics and paywalls - [Expo Integration](https://docs.adapty.io/docs/expo)

## I want to use a custom domain - is that possible?

For web deployments, you can use custom domains with:

- **EAS Hosting** - Custom domains available on paid plans
- **Netlify** - Free custom domain support
- **Vercel** - Custom domains with automatic SSL

For mobile apps, you'll configure your app's deep linking scheme in `app.json`.

## Troubleshooting

### **App not loading on device?**

1. Make sure your phone and computer are on the same WiFi network
2. Try using tunnel mode: `bun start -- --tunnel`
3. Check if your firewall is blocking the connection

### **Build failing?**

1. Clear your cache: `bunx expo start --clear`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && bun install`
3. Check [Expo's troubleshooting guide](https://docs.expo.dev/troubleshooting/build-errors/)

### **Need help with native features?**

- Check [Expo's documentation](https://docs.expo.dev/) for native APIs
- Browse [React Native's documentation](https://reactnative.dev/docs/getting-started) for core components
- Visit [Rork's FAQ](https://rork.com/faq) for platform-specific questions

## 🌟 Contributing

We welcome contributions from everyone! Whether you're a developer, designer, security expert, or passionate about child safety, there's a place for you in the kiku community.

### Quick Start for Contributors

1. **Read the mission**: Understand our [mission and values](./MISSION.md)
2. **Check the guidelines**: Review [participation guidelines](./PARTICIPATION-GUIDELINES.md)
3. **Find a task**: Look for issues with `good first issue` or `help wanted` labels
4. **Join discussions**: Participate in [GitHub Discussions](https://github.com/tc7kxsszs5-cloud/rork-kiku/discussions)
5. **Submit PR**: Follow our contribution workflow

### Areas of Contribution

- 🧠 **AI/ML**: Improve threat detection models
- 📱 **Mobile Dev**: Enhance UI/UX, add features
- 🔐 **Security**: Audit, improve privacy, compliance
- 📚 **Documentation**: Improve guides, translations
- 🎨 **Design**: UI/UX improvements, branding
- 🧪 **Testing**: Write tests, find bugs

### Recognition

All contributors are recognized in our [Contributors](https://github.com/tc7kxsszs5-cloud/rork-kiku/graphs/contributors) page and significant contributions are highlighted in release notes!

## 📬 Contact & Support

- **Email**: team@kiku-app.com
- **Investments**: invest@kiku-app.com
- **Website**: www.kiku-app.com
- **GitHub Discussions**: [Ask questions, share ideas](https://github.com/tc7kxsszs5-cloud/rork-kiku/discussions)

## 📄 Documentation

- [MISSION.md](./MISSION.md) - Project vision and mission
- [PARTICIPATION-GUIDELINES.md](./PARTICIPATION-GUIDELINES.md) - How to contribute
- [INVESTMENT.md](./INVESTMENT.md) - Investment opportunities
- [PROJECT_BOARD_SETUP.md](./PROJECT_BOARD_SETUP.md) - Project management setup
- [MARKETING.md](./MARKETING.md) - Marketing strategy
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Technical summary
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide

## About Rork

Rork builds fully native mobile apps using React Native and Expo - the same technology stack used by Discord, Shopify, Coinbase, Instagram, and nearly 30% of the top 100 apps on the App Store.

Your Rork app is production-ready and can be published to both the App Store and Google Play Store. You can also export your app to run on the web, making it truly cross-platform.

## CI & iOS TestFlight (EAS)

This project includes automated CI workflows for linting, type checking, and building iOS apps for TestFlight distribution using Expo Application Services (EAS).

### GitHub Secrets Setup

To use the CI workflows, you'll need to configure the following secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):

#### Required Secrets

**EXPO_TOKEN** (Required for all workflows)
- Create an Expo access token at [expo.dev/accounts/[account]/settings/access-tokens](https://expo.dev/accounts/)
- Add it as a repository secret named `EXPO_TOKEN`

#### Optional Secrets for TestFlight Submission

Choose one of these authentication methods:

**Option 1: App Store Connect API Key (Recommended)**
- Create an API key in [App Store Connect](https://appstoreconnect.apple.com/access/api)
- Download the `.p8` key file
- Create a JSON file with the following structure:
  ```json
  {
    "key_id": "YOUR_KEY_ID",
    "issuer_id": "YOUR_ISSUER_ID",
    "key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
  }
  ```
- Store the entire JSON as `APPLE_API_KEY_JSON` secret
- Alternatively, base64-encode the JSON and decode in workflow: `echo "$APPLE_API_KEY_JSON" | base64 -d > /tmp/apple-api-key.json`

**Option 2: Apple ID + App-Specific Password**
- Set `APPLE_ID` to your Apple ID email
- Generate an app-specific password at [appleid.apple.com](https://appleid.apple.com/account/manage)
- Store it as `APPLE_SPECIFIC_PASSWORD` secret

### Workflows

#### CI Workflow (Lint & Type Check)
- **Trigger**: Automatically runs on push to `main` or `prepare/*` branches, and on pull requests
- **Purpose**: Validates code quality with ESLint and TypeScript checks
- **Runner**: Ubuntu (fast and cost-effective)

#### EAS Build & Submit Workflow (iOS)
- **Trigger**: Manually via GitHub Actions UI, or automatically on push to `main` or `release/**` branches
- **Purpose**: Builds iOS app and optionally submits to TestFlight
- **Runner**: macOS (required for iOS builds)

### Local Development & Testing

Run these commands locally to test before pushing:

```bash
# Install dependencies
bun install

# Run linter
bun run lint

# Run TypeScript check
bun run ci:tsc

# Run all CI checks locally
bun run ci:all

# Start development server
bun run start

# Create a development build (requires EXPO_TOKEN or login)
eas build --platform ios --profile development
```

### Triggering Manual Builds

1. Go to your repository on GitHub
2. Navigate to **Actions** tab
3. Select **EAS Build & Submit (iOS)** workflow
4. Click **Run workflow**
5. Select the branch (e.g., `copilot/prepareapple-ci` or `main`)
6. Click **Run workflow** button

The build will be queued on Expo's servers. You can monitor progress in the GitHub Actions log or at [expo.dev](https://expo.dev).

### Build Profiles

This project includes two build profiles in `eas.json`:

- **production**: Creates an optimized archive build for TestFlight and App Store distribution
- **development**: Creates a development client with debugging capabilities

To use a specific profile:
```bash
eas build --platform ios --profile production
eas build --platform ios --profile development
```

### Troubleshooting CI

- **Lint failures**: Run `bun run lint` locally to see and fix issues
- **Type check failures**: Run `bunx tsc --noEmit` locally to see type errors
- **Build failures**: Check the EAS build logs in GitHub Actions or at expo.dev
- **Authentication issues**: Verify your `EXPO_TOKEN` is valid and not expired
- **TestFlight submission issues**: Ensure your Apple credentials are correctly configured and your bundle identifier matches your App Store Connect app

---

## License

This project is open source and available under the [MIT License](LICENSE).

## Star History

If you find this project useful, please consider giving it a ⭐ star on GitHub! It helps others discover the project and motivates us to continue improving it.

---

**kiku** © 2024-2026 - Protecting children in the digital world 🛡️

*Built with ❤️ by a community that cares about child safety*
