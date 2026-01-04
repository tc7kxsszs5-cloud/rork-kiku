# GitHub Labels Configuration
# This file documents the standard labels for this repository
# 
# To sync labels automatically, you can use tools like:
# - github-label-sync: https://github.com/Financial-Times/github-label-sync
# - gh label: GitHub CLI extension
#
# Or create them manually in GitHub Settings > Labels

## Label Categories

### Type Labels (what kind of issue/PR)
- name: bug
  color: d73a4a
  description: Something isn't working

- name: feature
  color: 0e8a16
  description: New feature or request

- name: enhancement
  color: a2eeef
  description: Improvement to an existing feature

- name: documentation
  color: 0075ca
  description: Improvements or additions to documentation

- name: refactor
  color: fbca04
  description: Code refactoring without changing functionality

### Priority Labels
- name: priority:critical
  color: b60205
  description: Critical priority - needs immediate attention

- name: priority:high
  color: d93f0b
  description: High priority

- name: priority:medium
  color: fbca04
  description: Medium priority

- name: priority:low
  color: 0e8a16
  description: Low priority

### Status Labels
- name: status:in-progress
  color: fbca04
  description: Currently being worked on

- name: status:blocked
  color: e99695
  description: Blocked by other issues or dependencies

- name: status:ready
  color: 0e8a16
  description: Ready to be worked on

- name: status:needs-review
  color: fbca04
  description: Needs code review

- name: status:needs-testing
  color: d4c5f9
  description: Needs testing

### Platform Labels
- name: platform:ios
  color: 000000
  description: iOS specific

- name: platform:android
  color: 3ddc84
  description: Android specific

- name: platform:web
  color: 1f77b4
  description: Web specific

### Area Labels
- name: area:ui
  color: d4c5f9
  description: User interface related

- name: area:api
  color: 0052cc
  description: API and backend related

- name: area:performance
  color: ff6b6b
  description: Performance related

- name: area:security
  color: b60205
  description: Security related

- name: area:testing
  color: 1d76db
  description: Testing related

- name: area:ci-cd
  color: 2cbe4e
  description: CI/CD related

### Help Labels
- name: good first issue
  color: 7057ff
  description: Good for newcomers

- name: help wanted
  color: 008672
  description: Extra attention is needed

- name: question
  color: d876e3
  description: Further information is requested

### Resolution Labels
- name: duplicate
  color: cfd3d7
  description: This issue or pull request already exists

- name: invalid
  color: e4e669
  description: This doesn't seem right

- name: wontfix
  color: ffffff
  description: This will not be worked on

- name: dependencies
  color: 0366d6
  description: Pull requests that update a dependency file

## How to Apply Labels

### For Issues
- **Always use a type label**: bug, feature, enhancement
- **Add priority when known**: priority:high, priority:medium, priority:low
- **Add platform if specific**: platform:ios, platform:android, platform:web
- **Add area labels as relevant**: area:ui, area:api, etc.
- **Update status**: status:in-progress, status:blocked, status:ready

### For Pull Requests
- **Match the related issue labels**
- **Add status:needs-review** when ready for review
- **Add status:needs-testing** when code review is done

### Examples
1. Bug on iOS: `bug`, `platform:ios`, `priority:high`, `area:ui`
2. New feature: `feature`, `priority:medium`, `area:api`
3. Documentation: `documentation`, `good first issue`
4. Enhancement: `enhancement`, `priority:low`, `area:performance`
