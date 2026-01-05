# Contributing to kiku

Thank you for your interest in contributing to kiku! We welcome contributions from the community to help improve this AI-powered child safety messenger monitoring app.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Communication](#communication)

## Getting Started

Before you begin:
- Read the [README.md](README.md) to understand the project
- Review the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - all contributors must follow it
- Check the [Issues](https://github.com/tc7kxsszs5-cloud/rork-kiku/issues) page for existing discussions
- Familiarize yourself with the project structure and technologies used

## Development Setup

### Prerequisites

- **Node.js** (v18 or later) - [Install with nvm](https://github.com/nvm-sh/nvm)
- **Bun** - [Installation guide](https://bun.sh/docs/installation)
- **Git** - For version control

### Initial Setup

1. **Fork the repository**
   - Visit [https://github.com/tc7kxsszs5-cloud/rork-kiku](https://github.com/tc7kxsszs5-cloud/rork-kiku)
   - Click the "Fork" button in the top-right corner
   - This creates a copy of the repository in your GitHub account

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/rork-kiku.git
   cd rork-kiku
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/tc7kxsszs5-cloud/rork-kiku.git
   ```

4. **Install dependencies**
   ```bash
   bun install
   ```

5. **Start the development server**
   ```bash
   # For web preview
   bun run start-web
   
   # For mobile preview
   bun run start
   ```

## How to Contribute

### Finding Something to Work On

- Check the [Issues](https://github.com/tc7kxsszs5-cloud/rork-kiku/issues) page for open issues
- Look for issues labeled `good first issue` or `help wanted`
- Comment on an issue to let others know you're working on it
- If you have a new feature idea, open an issue first to discuss it

### Branch Naming Conventions

Create a descriptive branch name for your work:

- `feature/short-description` - For new features
- `fix/issue-description` - For bug fixes
- `docs/what-you-are-documenting` - For documentation changes
- `refactor/what-you-are-refactoring` - For code refactoring
- `test/what-you-are-testing` - For adding or updating tests

Examples:
```bash
git checkout -b feature/add-notification-settings
git checkout -b fix/sos-button-crash
git checkout -b docs/update-api-documentation
```

### Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clear, concise code
   - Follow the coding standards (see below)
   - Add comments where necessary
   - Update documentation if needed

3. **Test your changes**
   ```bash
   # Run linter
   bun run lint
   
   # Run TypeScript type check
   bun run ci:tsc
   
   # Run all CI checks
   bun run ci:all
   ```

4. **Commit your changes**
   - Write clear, descriptive commit messages
   - Use present tense ("Add feature" not "Added feature")
   - Reference issue numbers when applicable
   
   ```bash
   git add .
   git commit -m "Add notification settings feature (#123)"
   ```

5. **Keep your branch up to date**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Ensure proper typing - avoid using `any`
- Use interfaces for object shapes
- Export types that may be reused

### Code Style

- Follow the existing ESLint configuration
- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Keep lines under 100 characters when possible

### React Native / Expo

- Use functional components with hooks
- Use `useState`, `useEffect`, and other React hooks appropriately
- Optimize performance with `useCallback`, `useMemo` when needed
- Follow the Expo and React Native best practices

### File Organization

- Place new screens in the `app/` directory
- Add reusable components to the `components/` directory
- Put constants in the `constants/` directory
- Define types in the `types/` directory
- Keep utility functions in the `lib/` directory

### Comments

- Write self-documenting code when possible
- Add comments for complex logic or non-obvious decisions
- Use JSDoc comments for functions and components
- Document edge cases and assumptions

### Git Commits

- Write meaningful commit messages
- Use conventional commit format when possible:
  - `feat: add new feature`
  - `fix: resolve bug`
  - `docs: update documentation`
  - `style: format code`
  - `refactor: restructure code`
  - `test: add tests`
  - `chore: update dependencies`

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**
   ```bash
   bun run ci:all
   ```

2. **Update documentation**
   - Update README.md if you've changed functionality
   - Add inline code comments for complex logic
   - Update type definitions if needed

3. **Verify your changes**
   - Test on multiple platforms (iOS, Android, Web) if applicable
   - Ensure no console errors or warnings
   - Check that your changes don't break existing functionality

### Submitting a Pull Request

1. **Go to your fork on GitHub**
   - Navigate to the "Pull Requests" tab
   - Click "New Pull Request"

2. **Fill out the PR template**
   - **Title**: Clear, concise description of the change
   - **Description**: 
     - What changes were made and why
     - How to test the changes
     - Screenshots/videos for UI changes
     - Link to related issues

3. **Request review**
   - Tag maintainers or relevant contributors
   - Be responsive to feedback
   - Make requested changes promptly

4. **Wait for approval**
   - PRs require approval from maintainers
   - Address any feedback or requested changes
   - Once approved, a maintainer will merge your PR

### PR Guidelines

- Keep PRs focused and small - one feature or fix per PR
- Link related issues using keywords (e.g., "Fixes #123")
- Include screenshots for UI changes
- Ensure CI checks pass
- Be patient and respectful during code review
- Don't force-push after review has started unless requested

## Testing Guidelines

### Manual Testing

- Test your changes on at least one platform (iOS, Android, or Web)
- Verify that existing functionality still works
- Test edge cases and error conditions
- Check for memory leaks or performance issues

### Testing Checklist

- [ ] Code passes linting (`bun run lint`)
- [ ] TypeScript type check passes (`bun run ci:tsc`)
- [ ] App builds successfully
- [ ] Changes work on target platform(s)
- [ ] No console errors or warnings
- [ ] UI is responsive and accessible
- [ ] Edge cases are handled
- [ ] Related documentation is updated

### Privacy and Safety

Given the nature of this child safety app:
- **Never** commit sensitive data or API keys
- Be mindful of COPPA/GDPR-K compliance requirements
- Test privacy-related features thoroughly
- Ensure proper data encryption and security
- Document any security implications of your changes

## Communication

### Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **Pull Request Comments**: For specific code discussions
- **Discussions**: For general questions and ideas

### Reporting Issues

When reporting a bug, include:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Platform/device information
- Screenshots or error logs if applicable
- Relevant code snippets

### Suggesting Features

When suggesting a feature:
- Explain the use case and benefits
- Consider how it fits with existing functionality
- Discuss potential implementation approaches
- Be open to feedback and alternative solutions

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Recognition

Contributors who have their PRs merged will be recognized in the project. Thank you for helping make kiku better!

## License

By contributing to kiku, you agree that your contributions will be licensed under the same license as the project.

---

**Questions?** Feel free to open an issue or reach out to the maintainers.

Thank you for contributing to kiku! 🛡️
