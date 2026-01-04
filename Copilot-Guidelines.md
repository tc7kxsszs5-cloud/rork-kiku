# GitHub Copilot Guidelines

This document provides guidelines and best practices for using GitHub Copilot in the Rork mobile app development process.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Best Practices](#best-practices)
- [Creating Effective Prompts](#creating-effective-prompts)
- [Code Generation Guidelines](#code-generation-guidelines)
- [Limitations and Cautions](#limitations-and-cautions)
- [Project-Specific Conventions](#project-specific-conventions)
- [Security Considerations](#security-considerations)
- [Examples](#examples)

## Overview

GitHub Copilot is an AI-powered code completion tool that can significantly accelerate development. However, it should be used thoughtfully to maintain code quality, security, and consistency with project standards.

### When to Use Copilot

✅ **Recommended Use Cases:**
- Generating boilerplate code and repetitive patterns
- Writing unit tests and test cases
- Creating component structures and hooks
- Implementing common algorithms and utilities
- Generating type definitions and interfaces
- Writing documentation and comments
- Translating requirements into code structure

❌ **Not Recommended For:**
- Security-critical code without thorough review
- Complex business logic without understanding
- Code involving sensitive data or credentials
- Final implementation without testing and validation

## Getting Started

### Installation

1. Install the [GitHub Copilot extension](https://github.com/features/copilot) for your IDE (VS Code, Cursor, etc.)
2. Sign in with your GitHub account
3. Verify Copilot is active (check the status icon)

### Configuration

For this project, we recommend:
- Enable Copilot for TypeScript, JavaScript, and Markdown files
- Use Copilot Chat for complex questions and explanations
- Enable inline suggestions for faster coding

## Best Practices

### 1. Always Review Generated Code

**Never blindly accept Copilot suggestions.** Always:
- Read and understand the generated code
- Verify it follows project conventions
- Test the functionality thoroughly
- Check for potential security issues
- Ensure proper error handling

### 2. Provide Clear Context

Help Copilot understand your intent:
- Write descriptive comments before generating code
- Use meaningful variable and function names
- Include type annotations in TypeScript
- Reference related files and components

### 3. Iterative Refinement

- Start with a clear comment describing what you need
- Review the initial suggestion
- Refine your prompt if needed
- Iterate until you get the desired result

### 4. Maintain Code Quality

- Follow existing code patterns in the project
- Use proper TypeScript types
- Add appropriate error handling
- Include meaningful comments
- Write tests for generated code

## Creating Effective Prompts

### Structure of a Good Prompt

```typescript
// [ACTION] [WHAT] that [REQUIREMENTS] and [CONSTRAINTS]
// Example: Create a custom hook that fetches user data and handles loading states
```

### Prompt Templates

#### For Components

```typescript
// Create a [ComponentName] component that:
// - [Requirement 1]
// - [Requirement 2]
// - Uses [specific library/pattern]
// - Handles [edge case/error state]
```

#### For Hooks

```typescript
// Create a custom hook use[HookName] that:
// - [Main functionality]
// - Returns [expected return values]
// - Handles [specific cases]
```

#### For Utilities

```typescript
// Create a utility function [functionName] that:
// - Takes [parameters] as input
// - Returns [return type]
// - [Additional requirements]
```

#### For Tests

```typescript
// Write tests for [component/function] that verify:
// - [Test case 1]
// - [Test case 2]
// - [Edge case]
```

## Code Generation Guidelines

### React Native Components

**Good Prompt:**
```typescript
// Create a reusable Button component with the following features:
// - Accept title, onPress, variant (primary/secondary), and disabled props
// - Use Expo's haptic feedback on press
// - Support loading state with activity indicator
// - Apply proper TypeScript types
```

**What Copilot Should Generate:**
- Component with proper TypeScript interface
- Haptic feedback integration
- Loading state handling
- Platform-specific styling considerations

### API Calls and tRPC

**Good Prompt:**
```typescript
// Create a tRPC mutation for updating user profile that:
// - Accepts userId and profile data
// - Validates input using Zod
// - Returns updated user object
// - Handles errors appropriately
```

### State Management

**Good Prompt:**
```typescript
// Create a Zustand store for authentication that:
// - Manages user state, token, and isAuthenticated flag
// - Provides login, logout, and refreshToken actions
// - Persists state to AsyncStorage
// - Types all state and actions properly
```

## Limitations and Cautions

### Known Limitations

1. **Context Window**: Copilot has limited context of your entire codebase
2. **Outdated Patterns**: May suggest deprecated patterns or libraries
3. **Security**: Cannot guarantee secure code generation
4. **Business Logic**: May not understand domain-specific requirements
5. **Dependencies**: May suggest outdated package versions

### Red Flags to Watch For

⚠️ **Stop and Review If You See:**
- Hardcoded credentials or secrets
- Insecure data handling
- Missing error handling
- Deprecated APIs or patterns
- Unclear or overly complex logic
- Missing TypeScript types
- Inconsistent with project style

## Project-Specific Conventions

### Technology Stack Requirements

When using Copilot for this project, ensure generated code uses:

- **React Native**: 0.81.5 or compatible
- **Expo SDK**: 54 (check compatibility)
- **TypeScript**: Strict mode enabled
- **Expo Router**: File-based routing
- **React Query (TanStack Query)**: For server state
- **Zustand**: For client state management
- **Lucide React Native**: For icons (not other icon libraries)

### Code Style

- Use **functional components** with hooks (no class components)
- Use **arrow functions** for component definitions
- Use **TypeScript interfaces** for props and state
- Use **async/await** instead of promises when possible
- Use **proper indentation** (2 spaces, as configured in ESLint)

### File Organization

```
app/              # Screens (Expo Router)
components/       # Reusable components
hooks/            # Custom hooks
lib/              # Utility functions
types/            # TypeScript types
constants/        # App constants
```

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useAuth.ts`)
- **Utils**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINT`)
- **Types/Interfaces**: PascalCase (e.g., `UserProfile`)

## Security Considerations

### Never Accept Copilot Suggestions For

❌ **Absolutely Avoid:**
- API keys, tokens, or credentials
- Hardcoded passwords or secrets
- Insecure data storage patterns
- Unvalidated user input handling
- SQL queries (we use tRPC with Zod)
- Sensitive user data without encryption

### Always Validate

✅ **Manual Review Required:**
- Authentication and authorization logic
- Data validation and sanitization
- File upload and processing
- Payment processing code
- User data handling
- External API integrations

### Use Environment Variables

Instead of hardcoded values:
```typescript
// ❌ Bad (Copilot might suggest)
const API_URL = "https://api.example.com";

// ✅ Good (what you should use)
const API_URL = process.env.EXPO_PUBLIC_API_URL;
```

## Examples

### Example 1: Creating a Custom Hook

**Prompt:**
```typescript
// Create a custom hook useDebounce that:
// - Takes a value and delay as parameters
// - Returns the debounced value
// - Uses useEffect and useState
// - Has proper TypeScript types
```

**Expected Output:**
```typescript
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### Example 2: Creating a Screen Component

**Prompt:**
```typescript
// Create a ProfileScreen component that:
// - Displays user avatar, name, and email
// - Shows a loading state while fetching data
// - Handles error states with error message
// - Uses Expo Image for avatar
// - Uses proper TypeScript types
```

### Example 3: API Integration

**Prompt:**
```typescript
// Create a tRPC query hook for fetching user profile that:
// - Uses React Query with proper types
// - Handles loading and error states
// - Returns user data with UserProfile type
// - Includes refetch functionality
```

## Tips for Maximum Productivity

### 1. Keyboard Shortcuts

Learn and use:
- **Tab**: Accept suggestion
- **Esc**: Dismiss suggestion
- **Alt+]** / **Alt+[**: Cycle through suggestions
- **Ctrl+Enter**: Open Copilot in side panel

### 2. Chat vs. Inline Suggestions

- **Use Chat** for: Explanations, debugging, complex problems
- **Use Inline** for: Quick completions, repetitive code

### 3. Multi-line Editing

- Write a descriptive comment
- Press Enter to start a new line
- Copilot will suggest the implementation
- Review and accept/modify as needed

### 4. Test Generation

- Select a function or component
- Use Copilot Chat: "Generate tests for this code"
- Review and adjust test cases as needed

## Feedback and Improvement

### Report Issues

If Copilot generates problematic code:
1. Don't use the suggestion
2. Report the issue to the team
3. Document the pattern to avoid

### Share Good Patterns

When Copilot generates excellent code:
1. Document the prompt that worked well
2. Share with the team
3. Add to this guide as an example

## Conclusion

GitHub Copilot is a powerful tool that can accelerate development, but it requires thoughtful use. Always prioritize:

1. **Code Quality**: Review and test all generated code
2. **Security**: Never trust suggestions involving sensitive data
3. **Consistency**: Ensure code matches project conventions
4. **Understanding**: Only use code you understand

Remember: **Copilot is an assistant, not a replacement for developer judgment.**

---

**Last Updated**: January 2026
**Maintained By**: Development Team

For questions or suggestions about these guidelines, please open an issue or discussion.
