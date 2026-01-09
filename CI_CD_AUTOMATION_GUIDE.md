# CI/CD Automation Guide

## Overview
This repository uses GitHub Actions for continuous integration and deployment. All workflows are designed to work with Bun as the primary package manager and runtime.

## Workflows

### 1. CI/CD (`ci-cd.yml`)
**Trigger**: Push or Pull Request to `main` branch

**Purpose**: Main CI pipeline that runs on every push and PR

**Steps**:
- Checkout code
- Install Bun runtime
- Install dependencies with `bun install`
- Run linter with `bun run lint`
- Type check with `bunx tsc --noEmit`
- Run tests (if configured)

**Required Secrets**: None

---

### 2. CI - Lint & Typecheck (`ci.yml`)
**Trigger**: Push to `main` or `prepare/*` branches, and all PRs

**Purpose**: Dedicated linting and type checking workflow

**Steps**:
- Checkout code
- Setup Node.js 18
- Install Bun
- Install dependencies
- Run lint checks
- Run TypeScript type checking

**Required Secrets**: None

---

### 3. Deploy Backend (`deploy-backend.yml`)
**Trigger**: Push to `main` when backend files change

**Purpose**: Deploy backend services to Vercel

**Steps**:
- Checkout code
- Setup Bun
- Install backend dependencies
- Run backend tests
- Deploy to Vercel

**Required Secrets**:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

### 4. Deploy Mobile App (`deploy-mobile.yml`)
**Trigger**: Push to `main` when mobile app files change

**Purpose**: Build and deploy mobile applications via EAS

**Steps**:
- Checkout code
- Setup Node.js and Bun
- Install EAS CLI and dependencies
- Build iOS preview
- Build Android preview
- Publish OTA updates

**Required Secrets**:
- `EXPO_TOKEN`

---

### 5. EAS Build (`eas-build.yml`)
**Trigger**: Manual trigger or push to `main`/`release/**` branches

**Purpose**: Build iOS apps for production

**Steps**:
- Checkout code
- Setup Node.js and Bun
- Install EAS CLI
- Login to Expo
- Build iOS app
- Submit to TestFlight (optional)

**Required Secrets**:
- `EXPO_TOKEN`
- `APPLE_API_KEY_JSON` or `APPLE_SPECIFIC_PASSWORD` (optional, for TestFlight)
- `APPLE_ID` (optional)

---

### 6. Sponsors (`sponsors.yml`)
**Trigger**: Daily cron job or manual trigger

**Purpose**: Update sponsors list from GitHub Sponsors

**Steps**:
- Checkout code
- Setup Node.js
- Install @octokit/rest
- Run sponsor sync script

**Required Secrets**: 
- `GITHUB_TOKEN` (automatically provided)

---

## Local Development

### Prerequisites
- Node.js 18 or higher
- Bun installed (`curl -fsSL https://bun.sh/install | bash`)

### Installation
```bash
bun install
```

### Running Locally
```bash
# Start development server
bun start

# Run linter
bun run lint

# Type check
bun run ci:tsc

# Run all CI checks
bun run ci:all
```

---

## Package Management

This project uses **Bun** as the primary package manager. The `package.json` includes:

- **Dependencies**: Production dependencies for the Expo/React Native app
- **DevDependencies**: Build tools, TypeScript, ESLint

### Key Scripts:
- `ci:install`: Install dependencies
- `ci:lint`: Run linter
- `ci:tsc`: Type check
- `ci:all`: Run all CI checks

---

## Submodules

Currently, this repository has no Git submodules configured (`.gitmodules` does not exist). If submodules are needed in the future:

1. Add submodule: `git submodule add <repo-url> <path>`
2. Initialize: `git submodule update --init --recursive`
3. Update workflows to include submodule checkout

---

## Troubleshooting

### Workflow Fails on Dependencies
- Ensure `bun.lock` is committed
- Check that all dependencies in `package.json` are compatible

### EAS Build Failures
- Verify `EXPO_TOKEN` secret is set
- Check `eas.json` configuration
- Review build logs in Expo dashboard

### Type Check Errors
- Run `bunx tsc --noEmit` locally
- Fix all TypeScript errors before pushing

---

## Contributing

1. Create a feature branch from `main`
2. Make changes and ensure all CI checks pass
3. Submit a pull request
4. Wait for CI workflows to complete
5. Address any review feedback

---

## Maintenance

### Updating Dependencies
```bash
bun update
```

### Updating Workflows
- Test workflow changes on a feature branch
- Use `workflow_dispatch` for manual testing
- Monitor workflow runs in GitHub Actions tab

---

## Support

For issues with:
- **Workflows**: Check GitHub Actions logs
- **Bun**: See [Bun documentation](https://bun.sh/docs)
- **EAS**: See [Expo documentation](https://docs.expo.dev)
- **Repository**: Open an issue in the repository
