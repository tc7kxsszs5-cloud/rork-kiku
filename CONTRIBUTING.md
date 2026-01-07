# Contributing to KIKU

We love your input! We want to make contributing to KIKU as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Local Development Setup

### Prerequisites

- [Bun](https://bun.sh) - Package manager and runtime
- [Node.js](https://nodejs.org) 18+ - JavaScript runtime
- [Expo CLI](https://docs.expo.dev/get-started/installation/) - For mobile development
- [Git](https://git-scm.com/) - Version control

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/rork-kiku.git
cd rork-kiku

# Install dependencies
bun install

# Start the development server
bun run start

# For web development
bun run start-web-dev
```

### Running Tests and Checks

Before submitting a PR, ensure all checks pass:

```bash
# Run all CI checks (lint + type check)
bun run ci:all

# Or run individually:
bun run ci:lint      # ESLint
bun run ci:tsc       # TypeScript type checking
```

## Code Style

- We use ESLint for linting JavaScript/TypeScript code
- Follow the existing code style
- Use TypeScript for type safety
- Write meaningful commit messages
- Keep functions small and focused
- Add comments for complex logic

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

Examples:
```
Fix TypeScript compilation errors in components
Add CI/CD documentation to README
Update dependencies to latest versions
```

## Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/tc7kxsszs5-cloud/rork-kiku/issues/new).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

We love feature requests! Before creating one:

1. Check if the feature has already been requested
2. Explain the problem you're trying to solve
3. Describe your proposed solution
4. Consider alternative solutions

## Code Review Process

The core team looks at Pull Requests on a regular basis. After feedback has been given we expect responses within two weeks. After two weeks we may close the pull request if it isn't showing any activity.

## Community

- Be respectful and constructive
- Follow our [Code of Conduct](CODE_OF_CONDUCT.md)
- Help others when you can
- Share your knowledge

## Documentation

Documentation is crucial! If you:

- Add a new feature, document it in the relevant `.md` file
- Change an API, update the corresponding documentation
- Fix a bug, consider adding a note in the troubleshooting section

## Project Structure

```
rork-kiku/
├── app/              # Expo Router screens
├── components/       # Reusable React components
├── constants/        # Theme, colors, and contexts
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── backend/          # Backend API (Hono + tRPC)
├── assets/           # Images, fonts, and other static assets
├── .github/          # GitHub workflows and templates
└── docs/             # Additional documentation
```

## License

By contributing, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers the project.

## Questions?

Don't hesitate to reach out:
- Open an issue with the question label
- Email: dev@kiku.app
- Check existing documentation in the repo

## Thank You!

Thank you for considering contributing to KIKU. Together, we can make the digital world safer for children! ❤️
