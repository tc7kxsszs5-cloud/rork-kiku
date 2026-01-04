# GitHub Projects Setup Guide

This document provides instructions for setting up GitHub Projects for task management and progress visualization.

## Overview

GitHub Projects provides a Kanban-style board for organizing and tracking issues and pull requests. This guide will help you set up a project board with the recommended structure for this repository.

## Creating a GitHub Project

### Method 1: Using GitHub UI (Recommended)

1. **Navigate to Projects**
   - Go to your repository on GitHub
   - Click on the **Projects** tab
   - Click **New project**

2. **Choose Template**
   - Select **Board** layout (Kanban style)
   - Or start with **Blank project** for full customization

3. **Name Your Project**
   - Name: `Rork Kiku Development`
   - Description: `Task management and progress tracking for the Rork Kiku mobile app`

### Method 2: Using GitHub CLI

```bash
# Create a new project
gh project create --owner tc7kxsszs5-cloud --title "Rork Kiku Development" --body "Task management and progress tracking"

# Or create for organization
gh project create --org tc7kxsszs5-cloud --title "Rork Kiku Development"
```

## Project Board Configuration

### Columns (Status)

Set up the following columns in your project board:

1. **📋 Backlog**
   - Issues that are planned but not ready to start
   - No immediate action required
   - Used for future planning

2. **📝 To Do**
   - Issues that are ready to be worked on
   - All requirements and details are clear
   - Prioritized and waiting for assignment

3. **🏗️ In Progress**
   - Issues currently being worked on
   - Assigned to team members
   - Active development happening

4. **👀 In Review**
   - Pull requests under review
   - Awaiting code review and approval
   - Testing in progress

5. **✅ Done**
   - Completed issues and merged PRs
   - Deployed to production (if applicable)
   - Closed and resolved

### Optional Columns

- **🚫 Blocked**: Issues blocked by dependencies or external factors
- **🧪 Testing**: Issues in QA/testing phase
- **📱 Ready for Deploy**: Features ready for production deployment

## Workflow Automation

### Built-in Automations

Enable these GitHub Project automations:

1. **Auto-add items**
   - When issues are created → Add to **Backlog**
   - When PRs are opened → Add to **In Review**

2. **Auto-move items**
   - When issues are assigned → Move to **To Do**
   - When PRs are approved → Keep in **In Review**
   - When issues/PRs are closed → Move to **Done**

3. **Auto-archive**
   - After 7 days in Done → Archive item

### Manual Configuration

1. Go to your project
2. Click on **...** (more options)
3. Select **Workflows**
4. Enable built-in automations
5. Configure custom workflows if needed

## Field Configuration

Add these custom fields to your project for better tracking:

### Priority Field
- Type: Single select
- Options: 
  - 🔴 Critical
  - 🟠 High
  - 🟡 Medium
  - 🟢 Low

### Platform Field
- Type: Multi-select
- Options:
  - 📱 iOS
  - 🤖 Android
  - 🌐 Web

### Size/Effort Field
- Type: Single select
- Options:
  - XS (< 1 hour)
  - S (1-4 hours)
  - M (1-2 days)
  - L (3-5 days)
  - XL (> 1 week)

### Sprint/Milestone Field
- Type: Iteration
- Duration: 2 weeks
- Configure start dates

## Linking Issues to Project

### Automatic Linking

Issues are automatically added when:
- Automation is enabled (see above)
- Issue is created with specific labels

### Manual Linking

1. **From Issue Page**
   - Open an issue
   - On the right sidebar, under **Projects**
   - Click **Add to project**
   - Select your project

2. **From Project Board**
   - Open your project
   - Click **+ Add item**
   - Search for and select issues

3. **Bulk Add**
   - Go to Issues tab
   - Select multiple issues with checkboxes
   - Use bulk actions to add to project

## Using Keywords to Auto-Close Issues

When creating pull requests, use these keywords in the PR description to automatically close related issues when the PR is merged:

### Keywords
- `Closes #123`
- `Fixes #123`
- `Resolves #123`
- `Closes: #123`

### Examples

```markdown
## Description
This PR implements user authentication.

Closes #45
Fixes #67
Resolves #89
```

Multiple issues can be closed:
```markdown
Closes #123, #124, #125
```

Or one per line:
```markdown
Closes #123
Closes #124
Closes #125
```

## Progress Visualization

### Project Views

Create multiple views for different perspectives:

1. **Board View** (Default)
   - Kanban-style columns
   - Drag and drop interface
   - Quick status updates

2. **Table View**
   - Spreadsheet-like layout
   - Bulk editing
   - Advanced filtering and sorting

3. **Roadmap View** (if available)
   - Timeline visualization
   - Sprint planning
   - Milestone tracking

### Creating a View

1. In your project, click **+ New view**
2. Choose view type (Board, Table, Roadmap)
3. Configure columns and filters
4. Save and name the view

### Filtering Examples

```
# Show only high priority items
priority:"🟠 High" OR priority:"🔴 Critical"

# Show iOS-specific issues
platform:"📱 iOS"

# Show items in progress
status:"🏗️ In Progress"

# Show items assigned to you
assignee:@me

# Combine filters
status:"📝 To Do" priority:"🔴 Critical" platform:"📱 iOS"
```

## Team Collaboration

### Assigning Issues

1. Open an issue
2. Click **Assignees** in right sidebar
3. Select team member(s)
4. Issue automatically moves to appropriate column (if automation enabled)

### Mentions and Notifications

- Use `@username` to mention team members
- Mentioned users receive notifications
- Keep discussions in issue comments

### Labels Integration

Project board works seamlessly with labels:
- Filter board by labels
- Color-coded visual indicators
- Quick identification of issue types

## Best Practices

### For Project Management

1. **Keep Board Updated**
   - Move cards as work progresses
   - Update status regularly
   - Close completed items promptly

2. **Use Descriptions Effectively**
   - Clear issue descriptions
   - Acceptance criteria defined
   - Links to related issues/PRs

3. **Regular Grooming**
   - Review backlog weekly
   - Prioritize items
   - Remove outdated issues

4. **Sprint Planning**
   - Select items for next sprint
   - Assign team members
   - Estimate effort

### For Developers

1. **Link PRs to Issues**
   - Always reference related issues
   - Use closing keywords
   - Keep PR description updated

2. **Update Status**
   - Move cards when starting work
   - Update when blocked
   - Mark as done when complete

3. **Communication**
   - Comment on progress
   - Ask questions in issues
   - Review teammates' work

## Metrics and Insights

### Available Metrics

GitHub Projects provides insights on:
- Cycle time (time in each status)
- Issue velocity (issues completed per sprint)
- Bottlenecks (columns with many items)
- Team workload distribution

### Accessing Insights

1. Open your project
2. Click on **Insights** tab
3. View charts and metrics
4. Export data if needed

### Custom Reports

Create custom reports by:
1. Using filters and views
2. Exporting to CSV
3. Integrating with external tools
4. Using GitHub API for custom dashboards

## Integration with CI/CD

### PR Status Checks

- CI runs automatically on PRs
- Status shows on project board
- Failed checks prevent merging
- Green checkmarks indicate passing tests

### Deployment Status

- Track deployment status in project
- Link to deployment logs
- Monitor production releases
- Coordinate hotfixes

## Troubleshooting

### Items Not Auto-Adding

1. Check automation settings
2. Verify repository access
3. Review automation workflows
4. Manually add if needed

### Items Not Moving Automatically

1. Verify automation for status changes
2. Check if item is in correct project
3. Review automation logs
4. Use manual drag-and-drop if needed

### Can't See Project

1. Check project visibility settings
2. Verify repository permissions
3. Confirm project is linked to repository
4. Check if project was archived

## Additional Resources

- [GitHub Projects Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub Projects Best Practices](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/best-practices-for-projects)
- [Automating Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project)
- [GitHub CLI Projects](https://cli.github.com/manual/gh_project)

## Support

For questions or issues with GitHub Projects:
1. Check this guide first
2. Review GitHub documentation
3. Ask in team discussions
4. Create an issue with `area:project-management` label

---

**Last Updated**: January 2026
**Maintained By**: Development Team
