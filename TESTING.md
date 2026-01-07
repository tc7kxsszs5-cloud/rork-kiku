# Testing Guide for KIKU

This guide explains how to test the KIKU application and maintain code quality.

## Table of Contents

- [Overview](#overview)
- [Testing Strategy](#testing-strategy)
- [Running Tests](#running-tests)
- [Manual Testing](#manual-testing)
- [CI/CD Testing](#cicd-testing)
- [Best Practices](#best-practices)

## Overview

Currently, KIKU uses linting and type checking for code quality. This guide covers current testing practices and recommendations for future test implementations.

## Testing Strategy

### Current Testing Approach

1. **Static Analysis**
   - ESLint for code quality
   - TypeScript for type safety
   - Code review process

2. **Manual Testing**
   - Feature testing on development devices
   - User acceptance testing
   - Integration testing with backend services

### Recommended Future Testing

1. **Unit Tests** (Recommended)
   - Test individual functions and components
   - Use Jest and React Testing Library
   - Aim for critical business logic coverage

2. **Integration Tests** (Recommended)
   - Test component interactions
   - Test API integrations
   - Test navigation flows

3. **End-to-End Tests** (Optional)
   - Use Detox for React Native E2E testing
   - Test complete user workflows
   - Run on actual devices/emulators

## Running Tests

### Linting

```bash
# Run ESLint
bun run lint

# Run ESLint with auto-fix
bun run lint -- --fix
```

### Type Checking

```bash
# Run TypeScript compiler checks
bun run ci:tsc

# Watch mode for development
bunx tsc --noEmit --watch
```

### All Quality Checks

```bash
# Run all CI checks (lint + type check)
bun run ci:all
```

## Manual Testing

### Local Development Testing

1. **Start Development Server**
   ```bash
   bun run start
   ```

2. **Test on Different Platforms**
   ```bash
   # iOS Simulator
   press 'i' in Expo CLI
   
   # Android Emulator
   press 'a' in Expo CLI
   
   # Web Browser
   press 'w' in Expo CLI
   ```

3. **Test Features**
   - Authentication flows
   - Navigation between screens
   - Data synchronization
   - Push notifications
   - AI moderation features
   - Offline functionality

### Device Testing

**iOS Testing:**
1. Install Expo Go app from App Store
2. Scan QR code from development server
3. Test all features on physical device

**Android Testing:**
1. Install Expo Go app from Google Play
2. Scan QR code from development server
3. Test all features on physical device

### Web Testing

```bash
# Start web development server
bun run start-web-dev

# Test in different browsers
# - Chrome
# - Firefox
# - Safari
# - Edge
```

## CI/CD Testing

### Automated Checks

All pull requests automatically run:

1. **Code Linting**
   - Checks code style and potential errors
   - Must pass before merging

2. **Type Checking**
   - Validates TypeScript types
   - Ensures type safety

3. **Build Verification**
   - Ensures project builds successfully
   - Tests dependency resolution

### Manual Build Testing

```bash
# Test iOS build
eas build --platform ios --profile preview --local

# Test Android build
eas build --platform android --profile preview --local
```

## Test Checklist for Pull Requests

Before submitting a PR, ensure:

- [ ] Code passes all linting checks (`bun run lint`)
- [ ] No TypeScript errors (`bun run ci:tsc`)
- [ ] Changes tested locally on development server
- [ ] Tested on at least one target platform (iOS/Android/Web)
- [ ] No console errors or warnings
- [ ] All new features have been manually tested
- [ ] Edge cases have been considered and tested
- [ ] Performance impact has been evaluated
- [ ] Security implications have been reviewed

## Best Practices

### Code Quality

1. **Write Clean Code**
   - Follow TypeScript best practices
   - Use meaningful variable and function names
   - Keep functions small and focused
   - Add comments for complex logic

2. **Type Safety**
   - Always define types for function parameters
   - Avoid using `any` type
   - Use interfaces for object shapes
   - Leverage TypeScript's type inference

3. **Error Handling**
   - Always handle errors gracefully
   - Provide meaningful error messages
   - Log errors for debugging
   - Don't expose sensitive information in errors

### Component Testing

1. **Props Validation**
   - Test with different prop combinations
   - Test with missing optional props
   - Test with edge case values

2. **State Management**
   - Test initial state
   - Test state transitions
   - Test side effects

3. **User Interactions**
   - Test button clicks
   - Test form submissions
   - Test navigation
   - Test gestures

### Integration Testing

1. **API Integration**
   - Test successful responses
   - Test error responses
   - Test network failures
   - Test timeout scenarios

2. **Data Flow**
   - Test data loading
   - Test data updates
   - Test data persistence
   - Test synchronization

### Performance Testing

1. **Monitor Performance**
   - Check render performance
   - Monitor memory usage
   - Track bundle size
   - Measure load times

2. **Optimize as Needed**
   - Use React.memo for expensive renders
   - Implement proper list virtualization
   - Lazy load components
   - Optimize images

## Setting Up Unit Tests (Future)

When ready to add unit tests:

### Install Testing Dependencies

```bash
bun add -d jest @testing-library/react-native @testing-library/jest-native
```

### Configure Jest

Create `jest.config.js`:

```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};
```

### Add Test Scripts

Update `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Example Unit Test

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Hello')).toBeTruthy();
  });

  it('handles button press', () => {
    const onPress = jest.fn();
    const { getByText } = render(<MyComponent onPress={onPress} />);
    
    fireEvent.press(getByText('Press Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

## Setting Up E2E Tests (Future)

For comprehensive E2E testing with Detox:

### Install Detox

```bash
bun add -d detox
detox init -r jest
```

### Example E2E Test

```typescript
describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should login successfully', async () => {
    await element(by.id('email-input')).typeText('user@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [Detox Documentation](https://wix.github.io/Detox/)
- [Expo Testing Guide](https://docs.expo.dev/develop/unit-testing/)

## Questions or Issues?

If you have questions about testing:
- Check existing documentation in the repo
- Open an issue with the `testing` label
- Contact: dev@kiku.app

---

**Last Updated:** January 2025
