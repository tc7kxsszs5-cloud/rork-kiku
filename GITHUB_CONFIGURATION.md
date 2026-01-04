# GitHub Repository Configuration Guide

This document provides instructions for repository administrators to configure security and collaboration settings that cannot be automated through code.

## Table of Contents

1. [Branch Protection Rules](#branch-protection-rules)
2. [Team Access & Permissions](#team-access--permissions)
3. [Required Settings](#required-settings)
4. [GitHub Secrets Configuration](#github-secrets-configuration)
5. [Security Features](#security-features)
6. [Two-Factor Authentication](#two-factor-authentication)

---

## Branch Protection Rules

### Protecting the `main` Branch

Navigate to **Settings** → **Branches** → **Add branch protection rule**

Configure the following rules for the `main` branch:

#### Branch name pattern
```
main
```

#### Protection Rules (Check ALL of the following):

##### Require a pull request before merging
- ✅ **Require approvals**: Set to **2** (minimum two reviewers)
- ✅ **Dismiss stale pull request approvals when new commits are pushed**
- ✅ **Require review from Code Owners** (if CODEOWNERS file exists)
- ✅ **Restrict who can dismiss pull request reviews**: Limit to administrators

##### Require status checks to pass before merging
- ✅ **Require branches to be up to date before merging**
- Required status checks:
  - ✅ `lint-and-typecheck` (from CI workflow)
  - ✅ `analyze` (from CodeQL workflow)

##### Require conversation resolution before merging
- ✅ **Enabled**: All PR comments must be resolved

##### Require signed commits
- ✅ **Enabled**: All commits must be signed with GPG or SSH keys

##### Require linear history
- ✅ **Enabled**: Prevents merge commits (use squash or rebase)

##### Require deployments to succeed before merging
- ⬜ **Optional**: Enable if you have deployment previews

##### Lock branch
- ⬜ **Disabled**: Allow normal operations

##### Do not allow bypassing the above settings
- ✅ **Enabled**: Administrators must follow the same rules
- ⬜ **Optional**: Allow specific actors to bypass (use sparingly)

##### Restrict who can push to matching branches
- ✅ **Enabled** (Recommended for high-security projects)
- Restrict pushes to: Repository administrators only
- ⬜ Allow force pushes: **Disabled**
- ⬜ Allow deletions: **Disabled**

#### Apply Rules
Click **Create** or **Save changes** to apply the protection rules.

---

## Team Access & Permissions

### Setting Up Team Structure

Navigate to **Settings** → **Collaborators and teams** → **Manage access**

#### Recommended Team Structure:

##### 1. Administrators
- **Role**: Admin
- **Permissions**: Full access to repository settings
- **Members**: Project leads, repository owners
- **Access Level**:
  - Read, write, and delete repository
  - Manage settings, webhooks, and integrations
  - Manage branch protection rules
  - Manage GitHub Actions secrets

##### 2. Maintainers
- **Role**: Maintain
- **Permissions**: Manage repository without sensitive settings access
- **Members**: Senior developers, team leads
- **Access Level**:
  - Push to protected branches (if configured)
  - Manage issues and pull requests
  - Manage releases
  - Cannot modify repository settings

##### 3. Contributors
- **Role**: Write
- **Permissions**: Push to repository, create branches
- **Members**: Regular developers, contributors
- **Access Level**:
  - Create and push to branches
  - Create pull requests
  - Review pull requests
  - Cannot push directly to `main`

##### 4. Reviewers (Optional)
- **Role**: Triage
- **Permissions**: Manage issues and pull requests without write access
- **Members**: Code reviewers, quality assurance team
- **Access Level**:
  - Review and comment on pull requests
  - Manage issues
  - Cannot push code

##### 5. Viewers (Optional)
- **Role**: Read
- **Permissions**: Read-only access
- **Members**: Stakeholders, observers
- **Access Level**:
  - View repository contents
  - Clone repository
  - Cannot create issues or pull requests

### Adding Team Members

1. Click **Add people** or **Add teams**
2. Enter GitHub username or team name
3. Select appropriate role from dropdown
4. Click **Add [username/team] to this repository**

### Team Permissions Matrix

| Permission | Admin | Maintain | Write | Triage | Read |
|------------|-------|----------|-------|--------|------|
| View repository | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create branches | ✅ | ✅ | ✅ | ❌ | ❌ |
| Push to branches | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create PRs | ✅ | ✅ | ✅ | ✅ | ❌ |
| Review PRs | ✅ | ✅ | ✅ | ✅ | ❌ |
| Merge PRs | ✅ | ✅ | ✅ | ❌ | ❌ |
| Manage settings | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage secrets | ✅ | ❌ | ❌ | ❌ | ❌ |
| Delete repository | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## Required Settings

### General Settings

Navigate to **Settings** → **General**

#### Pull Requests
- ✅ **Allow squash merging**: Enable with default commit message
- ⬜ **Allow merge commits**: Disable (use squash for clean history)
- ✅ **Allow rebase merging**: Enable
- ✅ **Always suggest updating pull request branches**
- ✅ **Automatically delete head branches**: Clean up after merge

#### Archives
- ⬜ **Include Git LFS objects in archives**: Enable if using Git LFS

---

## GitHub Secrets Configuration

### Adding Secrets for CI/CD

Navigate to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

#### Required Secrets:

##### 1. EXPO_TOKEN
**Purpose**: Authentication for Expo Application Services (EAS)

**How to create**:
1. Visit [expo.dev/accounts/[account]/settings/access-tokens](https://expo.dev/accounts/)
2. Click **Create Token**
3. Name: `GitHub Actions CI`
4. Copy the generated token

**Add to GitHub**:
- Name: `EXPO_TOKEN`
- Value: Paste the token
- Click **Add secret**

##### 2. APPLE_API_KEY_JSON (Optional - for iOS deployment)
**Purpose**: App Store Connect API authentication for TestFlight

**How to create**:
1. Visit [App Store Connect API Keys](https://appstoreconnect.apple.com/access/api)
2. Create a new API key with App Manager role
3. Download the `.p8` private key file
4. Note the Key ID and Issuer ID

**Format as JSON**:
```json
{
  "key_id": "YOUR_KEY_ID",
  "issuer_id": "YOUR_ISSUER_ID",
  "key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----"
}
```

**Add to GitHub**:
- Name: `APPLE_API_KEY_JSON`
- Value: Paste the JSON
- Click **Add secret**

##### 3. APPLE_ID & APPLE_SPECIFIC_PASSWORD (Alternative to API Key)
**Purpose**: Alternative authentication for TestFlight submission

**How to create**:
1. Visit [appleid.apple.com](https://appleid.apple.com/account/manage)
2. Go to **Security** → **App-Specific Passwords**
3. Generate a new password for "GitHub Actions"

**Add to GitHub**:
- Name: `APPLE_ID`
- Value: Your Apple ID email
- Name: `APPLE_SPECIFIC_PASSWORD`
- Value: Generated app-specific password

#### Additional Secrets (As Needed):

Add other secrets for third-party services:
- API keys for backend services
- Database connection strings
- Third-party authentication tokens
- Analytics tokens
- Deployment credentials

#### Environment-Specific Secrets:

For multiple environments (staging, production):
1. Navigate to **Settings** → **Environments**
2. Create environments: `staging`, `production`
3. Add environment-specific secrets
4. Configure protection rules per environment

---

## Security Features

### Enable Security Features

Navigate to **Settings** → **Code security and analysis**

#### Dependabot
- ✅ **Dependabot alerts**: Enable (automatically enabled with dependabot.yml)
- ✅ **Dependabot security updates**: Enable
- ✅ **Dependabot version updates**: Enable (configured via .github/dependabot.yml)

#### Code Scanning
- ✅ **CodeQL analysis**: Enable (configured via .github/workflows/codeql.yml)
- ✅ **Set up more code scanning tools**: Add additional scanners if needed

#### Secret Scanning
- ✅ **Secret scanning**: Enable (automatically scans for exposed secrets)
- ✅ **Push protection**: Enable (prevents accidental secret commits)

#### Private Vulnerability Reporting
- ✅ **Enable private vulnerability reporting**: Allow security researchers to report issues privately

### Security Advisories

Navigate to **Security** → **Advisories**

- Review and respond to security advisories
- Create private security advisories for vulnerabilities
- Coordinate disclosure with reporters

### Security Policy

- ✅ Ensure `SECURITY.md` is present in the repository
- Regularly review and update the security policy
- Monitor security@github.com for notifications

---

## Two-Factor Authentication

### Enforcing 2FA for Organization

If this repository is part of an organization:

Navigate to **Organization Settings** → **Authentication security**

- ✅ **Require two-factor authentication**: Enable for all members
- Set grace period for compliance (e.g., 14 days)
- Remove non-compliant members automatically

### Individual Account 2FA Setup

All team members must enable 2FA on their GitHub accounts:

1. Go to **Settings** → **Password and authentication**
2. Click **Enable two-factor authentication**
3. Choose method:
   - **Authenticator app** (Recommended): Use Google Authenticator, Authy, or 1Password
   - **SMS**: Text message verification (less secure)
   - **Security keys**: Hardware keys like YubiKey (most secure)

4. Save recovery codes securely

#### Recommended 2FA Apps:
- **Authy**: Multi-device support
- **Google Authenticator**: Simple and reliable
- **1Password**: Password manager with 2FA support
- **Microsoft Authenticator**: Enterprise-friendly

---

## Commit Signature Verification

### Requiring Signed Commits

Signed commits are enforced via branch protection rules (see above).

### User Setup for Signed Commits

Team members must configure GPG or SSH signing:

#### GPG Signing (Recommended)

1. **Generate GPG key**:
   ```bash
   gpg --full-generate-key
   ```
   - Select RSA and RSA, 4096 bits
   - Enter your GitHub email

2. **List GPG keys**:
   ```bash
   gpg --list-secret-keys --keyid-format=long
   ```

3. **Export public key**:
   ```bash
   gpg --armor --export YOUR_KEY_ID
   ```

4. **Add to GitHub**:
   - Go to **Settings** → **SSH and GPG keys**
   - Click **New GPG key**
   - Paste the public key

5. **Configure Git**:
   ```bash
   git config --global user.signingkey YOUR_KEY_ID
   git config --global commit.gpgsign true
   ```

#### SSH Signing (Alternative)

1. **Generate SSH key** (if not already done):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Add to GitHub**:
   - Go to **Settings** → **SSH and GPG keys**
   - Add as a **Signing key** (not authentication key)

3. **Configure Git**:
   ```bash
   git config --global gpg.format ssh
   git config --global user.signingkey ~/.ssh/id_ed25519.pub
   git config --global commit.gpgsign true
   ```

### Verification

Test signing:
```bash
git commit -S -m "Test signed commit"
git log --show-signature
```

On GitHub, verified commits show a **Verified** badge.

---

## Monitoring & Maintenance

### Regular Reviews

- **Weekly**: Review Dependabot PRs
- **Monthly**: Review access permissions
- **Quarterly**: Security audit of repository settings
- **Annually**: Review and update security policy

### Audit Log

Navigate to **Settings** → **Audit log** (for organizations)

- Monitor access changes
- Review security events
- Track configuration changes

---

## Troubleshooting

### Branch Protection Not Working
- Verify you're not an admin bypassing rules
- Check that status checks are correctly named
- Ensure required apps/actions have repository access

### Secrets Not Available in Workflow
- Verify secret names match exactly (case-sensitive)
- Check workflow has correct permissions
- Ensure secrets are set at correct level (repo vs. environment)

### Signed Commits Failing
- Verify GPG key is added to GitHub account
- Check Git configuration for signing key
- Ensure GPG agent is running
- Verify email in GPG key matches GitHub email

### 2FA Issues
- Keep recovery codes in safe place
- Have multiple 2FA methods configured
- Contact GitHub support if locked out

---

## Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [Managing Access to Repositories](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/managing-teams-and-people-with-access-to-your-repository)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Commit Signature Verification](https://docs.github.com/en/authentication/managing-commit-signature-verification)
- [Securing Your Organization](https://docs.github.com/en/organizations/keeping-your-organization-secure)

---

**Last Updated**: January 2026
