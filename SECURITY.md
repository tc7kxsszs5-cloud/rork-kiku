# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of KIKU seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please do NOT:

- Open a public GitHub issue for security vulnerabilities
- Share the vulnerability publicly before it has been addressed

### Please DO:

1. **Email us directly** at: dev@kiku.app
2. **Include the following information** in your report:
   - Type of vulnerability
   - Full paths of source file(s) related to the manifestation of the vulnerability
   - The location of the affected source code (tag/branch/commit or direct URL)
   - Any special configuration required to reproduce the issue
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the issue, including how an attacker might exploit it

### What to expect:

- **Acknowledgment**: We'll acknowledge receipt of your vulnerability report within 48 hours
- **Communication**: We'll keep you informed about the progress of addressing the vulnerability
- **Fix Timeline**: We aim to release a fix within 30 days for critical vulnerabilities
- **Credit**: We'll credit you in the release notes (unless you prefer to remain anonymous)
- **Disclosure**: We'll coordinate with you on the disclosure timeline

## Security Best Practices

When contributing to KIKU, please follow these security best practices:

### Code Security
- Never commit secrets, API keys, or credentials to the repository
- Use environment variables for sensitive configuration
- Validate and sanitize all user inputs
- Follow secure coding guidelines for React Native and Node.js
- Keep dependencies up to date

### Data Protection
- Implement proper encryption for sensitive data
- Follow GDPR-K and COPPA compliance requirements
- Minimize data collection and storage
- Use secure communication protocols (HTTPS, WSS)

### Authentication & Authorization
- Use strong authentication mechanisms
- Implement proper session management
- Follow the principle of least privilege
- Validate tokens and credentials on the server side

### Dependencies
- Regularly update dependencies to patch known vulnerabilities
- Review dependency security advisories
- Use tools like `npm audit` or `bun audit` to check for vulnerabilities
- Only use dependencies from trusted sources

## Security Features in KIKU

KIKU implements several security features to protect children and their data:

- **End-to-End Encryption**: Sensitive communications are encrypted
- **Data Minimization**: We collect only necessary data
- **Compliance**: GDPR-K and COPPA compliant
- **Secure Storage**: Using React Native secure storage mechanisms
- **Regular Security Audits**: We perform periodic security assessments

## Third-Party Security

We rely on several third-party services. Please review their security policies:

- **Expo**: [Expo Security Policy](https://docs.expo.dev/guides/security/)
- **GitHub**: [GitHub Security](https://github.com/security)
- **Cloud Providers**: Review your chosen cloud provider's security documentation

## Updates and Notifications

We'll notify users of security updates through:
- GitHub Security Advisories
- Release notes
- Email notifications (for critical vulnerabilities)

## Questions

If you have questions about this security policy, please email: dev@kiku.app

---

**Last Updated:** January 2025
