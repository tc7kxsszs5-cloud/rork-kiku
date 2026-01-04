# Contributing to Rork-Kiku

Thank you for your interest in contributing to the Rork-Kiku project! This document provides guidelines and best practices for contributing to this repository.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Testing](#testing)
- [Security](#security)

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions with other contributors.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm)
- **Bun** - [Install Bun](https://bun.sh/docs/installation)
- **Git** - for version control

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/rork-kiku.git
   cd rork-kiku
   ```

3. **Add the upstream repository** as a remote:
   ```bash
   git remote add upstream https://github.com/tc7kxsszs5-cloud/rork-kiku.git
   ```

4. **Install dependencies**:
   ```bash
   bun install
   ```

5. **Verify your setup** by running the development server:
   ```bash
   bun run start-web
   ```

## Development Workflow

### Branching Strategy

We follow a structured branching model:

- **`main`** - Production-ready code. Protected branch requiring reviews and passing CI.
- **`feature/*`** - New features (e.g., `feature/add-user-profile`)
- **`bugfix/*`** - Bug fixes (e.g., `bugfix/fix-login-issue`)
- **`hotfix/*`** - Urgent production fixes
- **`docs/*`** - Documentation updates

### Creating a New Branch

Always create your feature branch from the latest `main`:

```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

### Keeping Your Branch Up to Date

Regularly sync your branch with the upstream `main`:

```bash
git checkout main
git pull upstream main
git checkout your-branch
git rebase main
```

## Pull Request Process

### Before Submitting a Pull Request

1. **Run all checks locally**:
   ```bash
   bun run ci:all
   ```
   This runs:
   - ESLint for code linting
   - TypeScript type checking
   - All automated tests

2. **Ensure your code builds successfully**:
   ```bash
   bun run start-web
   ```

3. **Test your changes thoroughly** on different platforms (iOS, Android, Web) if applicable

4. **Write or update tests** for your changes when applicable

5. **Update documentation** if your changes affect user-facing features or APIs

### Submitting a Pull Request

1. **Push your branch** to your fork:
   ```bash
   git push origin your-branch-name
   ```

2. **Open a Pull Request** on GitHub from your fork to the upstream repository

3. **Fill out the PR template** with:
   - Clear description of the changes
   - Related issue numbers (if applicable)
   - Screenshots or videos for UI changes
   - Testing notes

4. **Wait for CI checks** to pass - all automated tests must succeed

5. **Request reviews** from at least two team members

6. **Address review feedback** promptly and professionally

### Pull Request Requirements

All Pull Requests must meet the following criteria before merging:

✅ **CI Checks Pass**: All automated tests, linting, and type checks must succeed  
✅ **Code Reviews**: Minimum of **2 approvals** from team members required  
✅ **Signed Commits**: All commits must be signed with GPG/SSH keys  
✅ **No Merge Conflicts**: Branch must be up-to-date with `main`  
✅ **Documentation Updated**: If applicable, documentation must be updated  
✅ **Security Scan**: No new security vulnerabilities introduced  

### After PR Approval

- **Squash and merge** is preferred for keeping clean git history
- Delete your branch after merging
- Close any related issues with appropriate references

## Coding Standards

### TypeScript & JavaScript

- Use **TypeScript** for all new code
- Follow **Expo** and **React Native** best practices
- Use **functional components** with hooks (no class components)
- Keep components small and focused (single responsibility)
- Use meaningful variable and function names

### Code Style

We use ESLint and the Expo configuration for code style. Run the linter before committing:

```bash
bun run lint
```

Key style guidelines:
- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Use **semicolons** at the end of statements
- Use **PascalCase** for component names
- Use **camelCase** for variables and functions
- Use **UPPER_SNAKE_CASE** for constants

### File Organization

```
app/                    # App screens (Expo Router)
components/             # Reusable components
hooks/                  # Custom React hooks
lib/                    # Utility functions and helpers
constants/              # App-wide constants
types/                  # TypeScript type definitions
backend/                # Backend API and tRPC routes
```

### Import Order

Organize imports in the following order:
1. React and React Native imports
2. Third-party libraries
3. Local components
4. Local utilities and hooks
5. Types
6. Styles

## Commit Guidelines

### Commit Message Format

We follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add user login functionality

fix(ui): resolve button alignment on iOS

docs(readme): update installation instructions

chore(deps): update expo to v54
```

### Signed Commits

All commits must be signed with a GPG or SSH key:

```bash
# Configure Git to sign commits
git config --global commit.gpgsign true

# Sign a commit
git commit -S -m "feat: add new feature"
```

[Learn how to set up commit signing](https://docs.github.com/en/authentication/managing-commit-signature-verification)

## Testing

### Running Tests

```bash
# Run all tests
bun run test

# Run linter
bun run lint

# Run type checks
bun x tsc --noEmit
```

### Writing Tests

- Write tests for all new features and bug fixes
- Aim for high test coverage on critical paths
- Use descriptive test names
- Follow existing test patterns in the codebase

## Security

### Reporting Security Vulnerabilities

Please see our [Security Policy](SECURITY.md) for information on reporting security vulnerabilities.

### Security Best Practices

- **Never commit secrets** or sensitive data (API keys, passwords, tokens)
- Use **GitHub Secrets** for sensitive CI/CD variables
- Keep **dependencies up to date** using Dependabot
- Run **security audits** regularly:
  ```bash
  bun audit
  ```
- Follow the **principle of least privilege** for access control

### Handling Sensitive Data

- Use environment variables for sensitive configuration
- Use Expo Secure Store for sensitive user data
- Never log sensitive information
- Sanitize user input to prevent XSS and injection attacks

## Getting Help

If you need help or have questions:

- **Check the documentation**: Start with [README.md](README.md)
- **Search existing issues**: Someone may have already asked your question
- **Open a new issue**: Provide clear details about your question or problem
- **Join the discussion**: Participate in Pull Request discussions

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Rork-Kiku! 🚀
