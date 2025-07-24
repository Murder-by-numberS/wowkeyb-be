# Automatic Semantic Versioning

This directory contains scripts for automatic semantic versioning based on Git changes.

## Overview

The system automatically bumps the version in `package.json` based on the types of changes detected:

- **Patch** (1.23.0 → 1.23.1): Bug fixes, improvements, and modifications to existing functions
- **Minor** (1.23.0 → 1.24.0): New files, new functions, new routes
- **Major** (1.23.0 → 2.0.0): Breaking changes (manual only)

## Files

- `version-bump.js` - Main script that analyzes changes and bumps version
- `version-config.json` - Configuration file for versioning rules
- `.git/hooks/pre-commit` - Git hook that runs the version bump script

## How It Works

### Pre-commit Hook
The pre-commit hook automatically runs before each commit and:

1. Checks if `package.json` version was manually updated
2. If not manually updated, analyzes staged changes
3. Determines appropriate version bump type
4. Updates `package.json` and stages the change

### Version Bump Logic

#### Patch Version (1.23.0 → 1.23.1)
- Modified existing functions
- Bug fixes
- Documentation updates
- Configuration changes
- Script improvements

#### Minor Version (1.23.0 → 1.24.0)
- New files created
- New functions added
- New routes added
- New controllers added
- New models added

#### Major Version (1.23.0 → 2.0.0)
- Breaking changes (manual only)
- API changes that break existing functionality

## Configuration

Edit `version-config.json` to customize the versioning rules:

```json
{
  "versionRules": {
    "minor": {
      "files": ["src/routes/", "src/controllers/"],
      "patterns": ["feat:", "feature:", "new:"]
    },
    "patch": {
      "files": ["src/config/", "src/scripts/"],
      "patterns": ["fix:", "refactor:", "docs:"]
    }
  }
}
```

## Manual Version Override

To manually set a version (including major version bumps):

1. Edit `package.json` and update the version field
2. Stage the change: `git add package.json`
3. Commit: The hook will detect the manual change and skip automatic versioning

## Installation

1. Make the pre-commit hook executable:
   ```bash
   chmod +x .git/hooks/pre-commit
   ```

2. Make the version bump script executable:
   ```bash
   chmod +x scripts/version-bump.js
   ```

## Testing

You can test the version bump script manually:

```bash
node scripts/version-bump.js
```

## Examples

### New Route (Minor Version)
```bash
# Create a new route file
touch src/routes/api/new-feature.js
git add src/routes/api/new-feature.js
git commit -m "feat: add new API endpoint"
# Version: 1.23.0 → 1.24.0
```

### Bug Fix (Patch Version)
```bash
# Modify existing controller
# Edit src/controllers/user/index.js
git add src/controllers/user/index.js
git commit -m "fix: resolve user authentication issue"
# Version: 1.23.0 → 1.23.1
```

### Manual Major Version
```bash
# Manually update version in package.json
# Edit package.json: "version": "2.0.0"
git add package.json
git commit -m "BREAKING CHANGE: major API refactor"
# Version: 1.23.0 → 2.0.0 (manual)
```

## Troubleshooting

### Hook Not Running
- Ensure the hook is executable: `chmod +x .git/hooks/pre-commit`
- Check that the script path is correct in the hook

### Version Not Updating
- Check if version was manually updated in `package.json`
- Verify the script has proper permissions
- Check the console output for error messages

### False Positives
- Adjust the patterns in `version-config.json`
- Modify the function detection logic in `version-bump.js`
