# GitHub Workflows Fixes and Improvements

This document describes the fixes and improvements made to the GitHub Actions workflows in this repository.

## Summary of Changes

### 1. Fixed `sponsors.yml` Workflow

**Issues Fixed:**
- JavaScript code was incorrectly placed directly in a `run:` block instead of being in a separate script file
- Missing proper error handling and null checks for API responses
- Incorrect token permissions configuration
- Lack of debugging information

**Changes Made:**
- Created a dedicated Node.js script: `scripts/fetch-sponsors.js`
- Added comprehensive error handling with specific error messages
- Added detailed logging at each step for debugging
- Configured proper `permissions` block in the workflow
- Added `workflow_dispatch` trigger for manual testing
- Updated to use latest action versions (@v4)
- Fixed indentation issues

**Required Token Permissions:**
The `GITHUB_TOKEN` used in this workflow requires the following scopes:
- `repo` - for repository access
- `read:org` - for organization data
- `user` - for user data and sponsors information

**Testing:**
You can manually trigger this workflow from the Actions tab in GitHub to test it.

### 2. Fixed `ci.yml` Workflow

**Issues Fixed:**
- Environment variable syntax error: using `>` instead of `>>` for `$GITHUB_ENV` and `$GITHUB_PATH`
- Missing detailed logging for debugging

**Changes Made:**
- Corrected Bun installation to use `>>` for appending to environment files
- Added logging statements before and after each major step
- Added version checking for Bun after installation

### 3. Fixed `eas-build.yml` Workflow

**Issues Fixed:**
- Same environment variable syntax error as ci.yml
- Lack of debugging information

**Changes Made:**
- Fixed Bun installation environment variable syntax
- Added detailed logging for each build step
- Added version verification for installed tools
- Improved error messages in the submit step

### 4. Improved Other Workflows

**Updated Workflows:**
- `ci-cd.yml` - Added logging for dependency installation and test execution
- `deploy-backend.yml` - Added logging for backend build and test steps
- `deploy-mobile.yml` - Added logging for all EAS build and update steps

### 5. Repository Cleanup

**Issues Fixed:**
- Removed problematic empty directory: `-https-github.com-tc7kxsszs5-cloud-rork-kiku.git-`
- This directory appeared to be a failed submodule and was causing issues

## Sponsor Fetch Script

The `scripts/fetch-sponsors.js` script provides the following features:

### Features
- Validates that `GITHUB_TOKEN` is present before making API calls
- Fetches user information first to verify access
- Handles specific API errors gracefully (404, 403, 401)
- Provides detailed error messages with troubleshooting hints
- Saves sponsors list to `SPONSORS.json` file
- Extensive logging for debugging

### Usage

```bash
# Set the required environment variable
export GITHUB_TOKEN="your_github_token"

# Run the script
node scripts/fetch-sponsors.js
```

### Error Handling

The script handles the following scenarios:

1. **Missing GITHUB_TOKEN**: Exits with error code 1 and clear message
2. **404 Not Found**: Logs warning that GitHub Sponsors may not be enabled
3. **403 Forbidden**: Indicates insufficient token permissions
4. **401 Unauthorized**: Indicates invalid token
5. **Other errors**: Logs full error details for debugging

### Output

- Console logs with detailed progress information
- `SPONSORS.json` file containing the list of sponsors (if any)
- Exit code 0 on success, 1 on failure

## Testing Workflows Locally

### Validate YAML Syntax

```bash
# Using Python's YAML parser
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/sponsors.yml')); print('Valid')"

# Using yamllint (if installed)
yamllint .github/workflows/sponsors.yml
```

### Test the Sponsors Script Locally

```bash
# Install dependencies
npm install @octokit/rest

# Set environment variables
export GITHUB_TOKEN="your_personal_access_token"
export GITHUB_REPOSITORY_OWNER="tc7kxsszs5-cloud"

# Run the script
node scripts/fetch-sponsors.js
```

## Troubleshooting

### Workflow Fails with "GITHUB_TOKEN does not have required permissions"

**Solution:** Ensure the workflow has the correct permissions block:

```yaml
permissions:
  contents: write  # If the workflow needs to commit changes
  # Add other permissions as needed
```

### Bun Installation Fails

**Issue:** Environment variables not being set correctly.

**Solution:** Ensure using `>>` (append) instead of `>` (overwrite):

```bash
echo "BUN_INSTALL=$HOME/.bun" >> $GITHUB_ENV  # Correct
echo "BUN_INSTALL=$HOME/.bun" > $GITHUB_ENV   # Wrong!
```

### Sponsors API Returns 404

**Possible Causes:**
1. GitHub Sponsors is not enabled for the account
2. The account has no sponsors
3. The token lacks required permissions

**Solution:** 
- Verify GitHub Sponsors is enabled for your account
- Ensure token has `user` scope
- Check the workflow logs for detailed error messages

### EAS Build Fails

**Common Issues:**
1. `EXPO_TOKEN` secret not set or invalid
2. EAS project not properly configured
3. Build profile doesn't exist in `eas.json`

**Solution:**
- Verify all required secrets are set in repository settings
- Check `eas.json` has the required build profiles
- Review EAS CLI logs (now included with improved logging)

## Best Practices

1. **Always add logging** - Include echo statements before and after major steps
2. **Validate inputs** - Check environment variables and secrets exist before use
3. **Handle errors gracefully** - Use `|| echo "message"` for non-critical failures
4. **Use latest action versions** - Keep actions up to date (e.g., @v4 instead of @v3)
5. **Test workflows manually** - Use `workflow_dispatch` trigger for testing
6. **Document token permissions** - Clearly document required token scopes

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Octokit REST API](https://octokit.github.io/rest.js/)
- [EAS CLI Documentation](https://docs.expo.dev/eas/)
- [Bun Documentation](https://bun.sh/docs)
