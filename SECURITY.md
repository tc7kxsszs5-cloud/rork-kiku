# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The Rork-Kiku team takes security vulnerabilities seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report a Security Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them through one of the following methods:

1. **GitHub Security Advisories** (Recommended):
   - Navigate to the [Security tab](https://github.com/tc7kxsszs5-cloud/rork-kiku/security/advisories) of this repository
   - Click "Report a vulnerability"
   - Fill in the details of the vulnerability

2. **Email**:
   - Send an email to the repository maintainers
   - Include the word "SECURITY" in the subject line
   - Provide detailed information about the vulnerability

### What to Include in Your Report

To help us understand and resolve the issue quickly, please include as much of the following information as possible:

- **Description**: A clear description of the vulnerability
- **Impact**: Potential impact and severity of the issue
- **Steps to Reproduce**: Detailed steps to reproduce the vulnerability
- **Affected Components**: Which parts of the codebase are affected
- **Proof of Concept**: Code or screenshots demonstrating the issue (if applicable)
- **Suggested Fix**: If you have a suggestion for fixing the issue (optional)
- **Environment**: Version numbers, OS, browser, or device information

### What to Expect

When you report a security vulnerability:

1. **Acknowledgment**: We will acknowledge receipt of your report within **48 hours**
2. **Assessment**: We will investigate and assess the severity within **5 business days**
3. **Updates**: We will keep you informed of our progress toward a fix
4. **Disclosure**: We will coordinate with you on the disclosure timeline
5. **Credit**: With your permission, we will credit you in the security advisory

### Disclosure Policy

- **Coordinated Disclosure**: We ask that you allow us time to fix the issue before public disclosure
- **Typical Timeline**: We aim to resolve critical vulnerabilities within 30 days
- **Public Disclosure**: After a fix is released, we will publish a security advisory
- **CVE Assignment**: For significant vulnerabilities, we will request a CVE identifier

## Security Best Practices

### For Contributors

When contributing to this project, please follow these security best practices:

#### Code Security

- **Input Validation**: Always validate and sanitize user input
- **Output Encoding**: Properly encode output to prevent XSS attacks
- **Authentication**: Use secure authentication mechanisms
- **Authorization**: Implement proper access controls
- **Error Handling**: Don't expose sensitive information in error messages
- **Logging**: Don't log sensitive data (passwords, tokens, PII)

#### Secrets Management

- **Never commit secrets**: Don't commit API keys, passwords, tokens, or certificates
- **Use environment variables**: Store sensitive configuration in environment variables
- **GitHub Secrets**: Use GitHub Secrets for CI/CD sensitive data
- **Expo Secure Store**: Use Expo Secure Store for sensitive app data
- **Rotate credentials**: Regularly rotate API keys and access tokens

#### Dependencies

- **Keep dependencies updated**: Regularly update dependencies to get security patches
- **Review dependencies**: Audit new dependencies before adding them
- **Use lock files**: Commit `bun.lock` to ensure reproducible builds
- **Monitor vulnerabilities**: Check for known vulnerabilities using `bun audit`

### For Users

If you're using this application:

#### Account Security

- **Strong Passwords**: Use strong, unique passwords
- **Two-Factor Authentication**: Enable 2FA when available
- **Secure Devices**: Keep your devices and apps updated
- **Logout**: Log out when using shared devices

#### Data Protection

- **Permissions**: Only grant necessary permissions to the app
- **Privacy Settings**: Review and adjust privacy settings
- **Suspicious Activity**: Report any suspicious activity immediately

## Security Measures in This Project

### Authentication & Authorization

- Two-factor authentication (2FA) required for all team members
- Role-based access control for different team roles
- Secure token handling using industry best practices

### Code Protection

- **Branch Protection**: `main` branch is protected and requires:
  - Successful CI checks before merge
  - Code review from 2+ team members
  - Signed commits (GPG/SSH signatures)
  - No force pushes or deletions

- **Automated Scanning**:
  - CodeQL security analysis on all code changes
  - Dependabot automatic dependency vulnerability scanning
  - ESLint security rules enforcement

### CI/CD Security

- **Secrets Management**: Sensitive data stored in GitHub Secrets
- **Access Control**: Limited access to deployment credentials
- **Build Verification**: All builds verified and signed
- **Audit Logs**: All CI/CD activities logged and monitored

### Dependency Management

- **Automated Updates**: Dependabot configured for automatic security updates
- **Vulnerability Scanning**: Regular dependency audits with `bun audit`
- **Lock Files**: Using `bun.lock` for reproducible builds
- **Review Process**: Manual review of dependency updates

### Monitoring & Incident Response

- **Security Alerts**: GitHub Security Advisories enabled
- **Automated Alerts**: Dependabot alerts for vulnerable dependencies
- **Incident Response**: Documented process for handling security incidents
- **Regular Audits**: Periodic security audits of codebase

## Security Tools & Integrations

This project uses the following security tools:

### Static Analysis
- **ESLint**: Code quality and security linting
- **TypeScript**: Type safety to prevent common vulnerabilities
- **CodeQL**: Advanced security analysis

### Dependency Management
- **Dependabot**: Automated dependency updates
- **Bun Audit**: Vulnerability scanning for npm packages

### CI/CD Security
- **GitHub Actions**: Secure CI/CD pipelines
- **Environment Secrets**: Encrypted secrets management
- **Signed Commits**: GPG/SSH commit verification

## Security Checklist for New Features

Before submitting a PR with new features, ensure:

- [ ] User input is validated and sanitized
- [ ] Output is properly encoded
- [ ] Authentication/authorization checks are in place
- [ ] No sensitive data is logged or exposed
- [ ] Dependencies are up-to-date and audited
- [ ] No secrets are committed to the repository
- [ ] Error messages don't leak sensitive information
- [ ] Security tests are included
- [ ] Code follows security best practices

## Known Security Limitations

Please be aware of the following limitations:

- **Mobile Platform Security**: This app relies on device security features
- **Third-Party Dependencies**: Security depends on external package maintainers
- **API Security**: Backend API security is outside the scope of this repository
- **User Behavior**: Cannot prevent all user security mistakes

## Compliance

This project aims to comply with:

- OWASP Mobile Top 10 security risks
- React Native security best practices
- Expo security guidelines
- GitHub security best practices

## Security Updates

Security updates will be:

- Released as soon as possible after discovery
- Documented in release notes
- Announced through GitHub Security Advisories
- Tagged with appropriate CVE identifiers when applicable

## Contact

For security-related questions that are not vulnerabilities:

- Open a GitHub Discussion in the Security category
- Refer to our [Contributing Guide](CONTRIBUTING.md)

## Acknowledgments

We thank the following security researchers for responsibly disclosing vulnerabilities:

- _No vulnerabilities reported yet_

---

**Last Updated**: January 2026

Thank you for helping keep Rork-Kiku secure! 🔒
