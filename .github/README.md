# GitHub Configuration

This directory contains GitHub-specific configurations, templates, and documentation for the Rork Kiku project.

## Directory Structure

```
.github/
├── ISSUE_TEMPLATE/           # Issue templates for bugs, features, and enhancements
│   ├── bug_report.yml        # Bug report template
│   ├── feature_request.yml   # Feature request template
│   ├── enhancement.yml       # Enhancement template
│   └── config.yml            # Template configuration
├── workflows/                # GitHub Actions workflows
│   ├── ci.yml               # Continuous Integration (lint & typecheck)
│   └── eas-build.yml        # EAS Build & Submit (iOS)
├── PULL_REQUEST_TEMPLATE.md  # Pull request template
├── PROJECT_SETUP.md          # Guide for setting up GitHub Projects
├── labels.md                 # Label configuration and guidelines
└── README.md                 # This file
```

## Issue Templates

We provide three issue templates to standardize issue reporting:

### 🐛 Bug Report
Use this template to report bugs or unexpected behavior.
- **Fields**: Problem description, reproduction steps, expected behavior, actual behavior, platform, environment info
- **Label**: Automatically tagged with `bug`

### ✨ Feature Request
Use this template to suggest new features.
- **Fields**: Problem description, proposed solution, alternatives, platform, priority, use case
- **Label**: Automatically tagged with `feature`

### 🚀 Enhancement
Use this template to suggest improvements to existing features.
- **Fields**: Current behavior, proposed improvement, benefits, impact, implementation suggestions
- **Label**: Automatically tagged with `enhancement`

## Pull Request Template

Our PR template helps ensure consistency and completeness:
- **Description** and **Type of Change**
- **Related Issues** with auto-closing keywords
- **Changes Made** and **Testing** details
- **Platform testing** checkboxes
- **Checklist** for code quality
- **Screenshots/Videos** section

### Auto-Closing Issues

Use these keywords in PR descriptions to automatically close related issues:
- `Closes #123`
- `Fixes #456`
- `Resolves #789`

## GitHub Actions Workflows

### CI Workflow (`.github/workflows/ci.yml`)

Runs automatically on:
- Push to `main` or `prepare/*` branches
- All pull requests

**Jobs:**
1. Install dependencies with Bun
2. Run ESLint linting
3. Run TypeScript type checking
4. Build verification (optional)
5. Generate job summary

**Status**: Check marks appear on PRs and commits

### EAS Build Workflow (`.github/workflows/eas-build.yml`)

Runs on:
- Manual trigger via GitHub Actions UI
- Push to `main` or `release/**` branches

**Jobs:**
1. Build iOS app with EAS
2. Optional: Submit to TestFlight

**Required Secrets:**
- `EXPO_TOKEN`: For Expo authentication
- `APPLE_API_KEY_JSON` or `APPLE_SPECIFIC_PASSWORD`: For TestFlight submission

## Labels

We use a comprehensive labeling system for better organization:

### Type Labels
- `bug` - Something isn't working
- `feature` - New feature or request
- `enhancement` - Improvement to existing feature
- `documentation` - Documentation updates
- `refactor` - Code refactoring

### Priority Labels
- `priority:critical` - Needs immediate attention
- `priority:high` - High priority
- `priority:medium` - Medium priority
- `priority:low` - Low priority

### Platform Labels
- `platform:ios` - iOS specific
- `platform:android` - Android specific
- `platform:web` - Web specific

### Area Labels
- `area:ui` - User interface
- `area:api` - API and backend
- `area:performance` - Performance
- `area:security` - Security
- `area:testing` - Testing
- `area:ci-cd` - CI/CD

### Status Labels
- `status:in-progress` - Currently being worked on
- `status:blocked` - Blocked by dependencies
- `status:ready` - Ready to be worked on
- `status:needs-review` - Needs code review
- `status:needs-testing` - Needs testing

### Help Labels
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested

See [labels.md](labels.md) for complete documentation.

## GitHub Projects

We use GitHub Projects for Kanban-style task management.

### Recommended Board Structure
- 📋 **Backlog**: Planned but not ready
- 📝 **To Do**: Ready to work on
- 🏗️ **In Progress**: Currently being worked on
- 👀 **In Review**: Under review
- ✅ **Done**: Completed and closed

See [PROJECT_SETUP.md](PROJECT_SETUP.md) for detailed setup instructions.

## Best Practices

### Creating Issues

1. Choose the appropriate template
2. Fill in all required fields
3. Add relevant labels
4. Link to related issues if applicable
5. Add to project board

### Creating Pull Requests

1. Use the PR template
2. Reference related issues with closing keywords
3. Add clear description of changes
4. Check all relevant platforms tested
5. Complete the checklist
6. Request review from team members

### Code Review

1. Review code thoroughly
2. Test on relevant platforms
3. Provide constructive feedback
4. Approve when satisfied
5. Ensure CI checks pass

### Merging

1. Ensure all CI checks pass
2. Get required approvals
3. Resolve any conflicts
4. Use squash merge for clean history
5. Delete branch after merge

## Workflow Triggers

### When CI Runs
- Every push to main
- Every push to prepare/* branches
- Every pull request (open, update, reopen)

### When EAS Build Runs
- Manual trigger via Actions tab
- Push to main branch
- Push to release/** branches

## Required Secrets

Configure these in **Settings → Secrets and variables → Actions**:

### For EAS Build
- `EXPO_TOKEN` - Expo authentication token

### For TestFlight (Optional)
- `APPLE_API_KEY_JSON` - App Store Connect API key (recommended)
- Or: `APPLE_ID` + `APPLE_SPECIFIC_PASSWORD`

## Automation Features

### Issue Auto-Assignment
- Issues labeled with `good first issue` are great for new contributors
- Use GitHub Actions to auto-assign issues

### PR Status Updates
- CI status shows on PR page
- Branch protection can require passing checks
- Auto-merge when checks pass (if configured)

### Stale Issue Management
Consider adding a workflow to:
- Mark inactive issues as stale
- Close stale issues after warning period
- Keep active discussions going

## Troubleshooting

### CI Failures

1. **Lint errors**: Run `bun run lint` locally to fix
2. **Type errors**: Run `bunx tsc --noEmit` locally
3. **Build errors**: Check dependencies and configuration

### Template Not Showing

1. Ensure files are in `.github/ISSUE_TEMPLATE/`
2. Check file extension (`.yml` not `.yaml`)
3. Validate YAML syntax
4. Wait a few minutes for GitHub to update

### Workflow Not Running

1. Check workflow file syntax
2. Verify trigger conditions
3. Check branch names match patterns
4. Review repository permissions

## Contributing

When making changes to GitHub configurations:

1. Test templates before committing
2. Validate YAML syntax
3. Update documentation
4. Inform team of changes
5. Get review for workflow changes

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Issues Documentation](https://docs.github.com/en/issues)
- [GitHub Projects Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [Expo EAS Documentation](https://docs.expo.dev/eas/)

## Support

For questions about GitHub configurations:
1. Check this README and related docs
2. Review GitHub documentation
3. Ask in team discussions
4. Create an issue with `area:ci-cd` label

---

**Maintained By**: Development Team
**Last Updated**: January 2026
