# GitHub Actions Workflows Documentation

This document describes all GitHub Actions workflows used in the KIKU project.

## Table of Contents

- [Overview](#overview)
- [Active Workflows](#active-workflows)
- [Workflow Triggers](#workflow-triggers)
- [Required Secrets](#required-secrets)
- [Maintenance](#maintenance)

## Overview

KIKU uses GitHub Actions for automated CI/CD, including:
- Code quality checks (linting, type checking)
- iOS builds and TestFlight submission
- Backend deployment
- Sponsor updates

## Active Workflows

### 1. CI - Lint & TypeCheck (`ci.yml`)

**Purpose:** Ensures code quality on every push and pull request.

**Triggers:**
- Push to `main` or `prepare/*` branches
- Pull requests (opened, synchronized, reopened)

**Steps:**
1. Checkout code
2. Setup Node.js 18
3. Install Bun
4. Install dependencies with Bun
5. Run ESLint
6. Run TypeScript type checking

**Required Secrets:** None

**Local Testing:**
```bash
bun run ci:all
```

---

### 2. EAS Build & Submit (iOS) (`eas-build.yml`)

**Purpose:** Builds iOS app and optionally submits to TestFlight.

**Triggers:**
- Manual workflow dispatch
- Push to `main` or `release/**` branches

**Steps:**
1. Checkout code
2. Setup Node.js 18
3. Install Bun
4. Install EAS CLI
5. Login to Expo
6. Build iOS app (production profile)
7. Submit to TestFlight (optional, if credentials configured)

**Required Secrets:**
- `EXPO_TOKEN` (required)
- `APPLE_API_KEY_JSON` or `APPLE_SPECIFIC_PASSWORD` + `APPLE_ID` (optional, for TestFlight)

**Local Testing:**
```bash
eas build --platform ios --profile production
```

---

### 3. Deploy Backend (`deploy-backend.yml`)

**Purpose:** Deploys backend API to Vercel when backend code changes.

**Triggers:**
- Push to `main` branch
- Changes in `backend/**` or workflow file

**Steps:**
1. Checkout code
2. Setup Bun
3. Install dependencies
4. Run tests (if configured)
5. Deploy to Vercel

**Required Secrets:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

### 4. Deploy Mobile App (`deploy-mobile.yml`)

**Purpose:** Builds mobile apps and publishes OTA updates.

**Triggers:**
- Push to `main` branch
- Changes in app code or workflow file

**Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies and EAS CLI
4. Build iOS preview
5. Build Android preview
6. Publish OTA update

**Required Secrets:**
- `EXPO_TOKEN`

**Note:** This workflow overlaps with `eas-build.yml`. Consider consolidating.

---

### 5. Sponsors (`sponsors.yml`)

**Purpose:** Updates sponsor list daily.

**Triggers:**
- Daily cron schedule (midnight UTC)

**Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Fetch and update sponsors list

**Required Secrets:**
- `GITHUB_TOKEN` (automatically provided)

---

### 6. CI/CD for rork-kiku (`ci-cd.yml`)

**Purpose:** Basic CI/CD workflow (legacy).

**Triggers:**
- Push to `main`
- Pull requests to `main`

**Status:** ⚠️ **Deprecated** - Superseded by `ci.yml`

**Recommendation:** This workflow is outdated and should be removed or updated.

## Workflow Triggers

### Automatic Triggers

| Workflow | Push to main | Push to feature | Pull Request | Schedule |
|----------|--------------|-----------------|--------------|----------|
| ci.yml | ✅ | prepare/* only | ✅ | ❌ |
| eas-build.yml | ✅ | release/** only | ❌ | ❌ |
| deploy-backend.yml | ✅ | ❌ | ❌ | ❌ |
| deploy-mobile.yml | ✅ | ❌ | ❌ | ❌ |
| sponsors.yml | ❌ | ❌ | ❌ | Daily |

### Manual Triggers

These workflows can be triggered manually via GitHub Actions UI:
- `eas-build.yml` - Supports workflow_dispatch

## Required Secrets

### Essential for All Features

| Secret | Required For | Description |
|--------|--------------|-------------|
| `EXPO_TOKEN` | Mobile builds | Expo authentication token from expo.dev |

### Optional (iOS TestFlight)

| Secret | Required For | Description |
|--------|--------------|-------------|
| `APPLE_API_KEY_JSON` | TestFlight submission | App Store Connect API key (recommended) |
| `APPLE_ID` | TestFlight submission | Apple ID email (alternative method) |
| `APPLE_SPECIFIC_PASSWORD` | TestFlight submission | App-specific password (alternative method) |

### Optional (Backend Deployment)

| Secret | Required For | Description |
|--------|--------------|-------------|
| `VERCEL_TOKEN` | Backend deployment | Vercel authentication token |
| `VERCEL_ORG_ID` | Backend deployment | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Backend deployment | Vercel project ID |

### Setting Up Secrets

1. Go to GitHub repository Settings
2. Navigate to "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add the secret name and value
5. Click "Add secret"

## Maintenance

### Recommended Updates

1. **Remove deprecated workflows:**
   - Consider removing or updating `ci-cd.yml`
   - It's superseded by the more comprehensive `ci.yml`

2. **Consolidate mobile deployment:**
   - Consider merging `deploy-mobile.yml` into `eas-build.yml`
   - Avoid duplicate iOS build jobs

3. **Update Node.js versions:**
   - `ci-cd.yml` uses Node.js 16 (outdated)
   - `sponsors.yml` uses Node.js 16 (outdated)
   - Recommend updating to Node.js 18+

4. **Modernize GitHub Actions:**
   - Update `@actions/checkout@v3` to `@v4`
   - Update `@actions/setup-node@v3` to `@v4`

### Best Practices

1. **Use caching:** Add dependency caching to speed up workflows
2. **Add concurrency limits:** Prevent multiple runs of the same workflow
3. **Use matrix builds:** Test on multiple platforms/versions
4. **Add status badges:** Show workflow status in README
5. **Set timeouts:** Prevent workflows from running too long

### Adding Status Badges

Add to README.md:

```markdown
[![CI](https://github.com/tc7kxsszs5-cloud/rork-kiku/actions/workflows/ci.yml/badge.svg)](https://github.com/tc7kxsszs5-cloud/rork-kiku/actions/workflows/ci.yml)
[![EAS Build](https://github.com/tc7kxsszs5-cloud/rork-kiku/actions/workflows/eas-build.yml/badge.svg)](https://github.com/tc7kxsszs5-cloud/rork-kiku/actions/workflows/eas-build.yml)
```

## Troubleshooting

### Common Issues

**Issue: "Bun not found" in workflows**
- Solution: Ensure Bun installation step uses correct syntax with `>>` for environment variables

**Issue: "EXPO_TOKEN not set"**
- Solution: Add EXPO_TOKEN to repository secrets

**Issue: "EAS build fails"**
- Check EXPO_TOKEN is valid
- Verify app.json configuration
- Check EAS project configuration with `eas build:configure`

**Issue: "Vercel deployment fails"**
- Verify all Vercel secrets are set correctly
- Check Vercel project configuration

### Getting Help

- Check workflow run logs in GitHub Actions tab
- Review [GitHub Actions documentation](https://docs.github.com/en/actions)
- Review [Expo EAS documentation](https://docs.expo.dev/eas/)
- Open an issue with the `ci/cd` label

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Expo Application Services (EAS)](https://docs.expo.dev/eas/)
- [Vercel Deployment](https://vercel.com/docs)
- [Bun Documentation](https://bun.sh/docs)

---

**Last Updated:** January 2025
