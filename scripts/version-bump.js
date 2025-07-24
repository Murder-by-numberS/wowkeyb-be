#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Load configuration
let CONFIG = {};
try {
  CONFIG = JSON.parse(fs.readFileSync('scripts/version-config.json', 'utf8'));
} catch (error) {
  console.warn('Warning: Could not load version-config.json, using default configuration');
  CONFIG = {
    versionRules: {
      minor: {
        files: ['src/routes/', 'src/controllers/', 'src/models/', 'src/middlewares/', 'src/validators/', 'src/presenters/', 'src/utils/']
      },
      patch: {
        files: ['src/config/', 'src/scripts/', 'tests/', '.eslintrc', '.gitignore', 'README.md', 'package.json']
      }
    }
  };
}

function getGitDiff() {
  try {
    // Get staged files
    const stagedFiles = execSync('git diff --cached --name-status', { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(line => line.length > 0)
      .map(line => {
        const [status, file] = line.split('\t');
        return { status, file };
      });

    // Get unstaged files (for new files that might not be staged)
    const unstagedFiles = execSync('git diff --name-status', { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(line => line.length > 0)
      .map(line => {
        const [status, file] = line.split('\t');
        return { status, file };
      });

    return { stagedFiles, unstagedFiles };
  } catch (error) {
    console.error('Error getting git diff:', error.message);
    return { stagedFiles: [], unstagedFiles: [] };
  }
}

function analyzeChanges(files) {
  let hasNewFiles = false;
  let hasNewFunctions = false;
  let hasModifiedFunctions = false;
  let hasNewRoutes = false;

  for (const { status, file } of files) {
    if (status === 'A') {
      hasNewFiles = true;

      // Check if it's a new route file
      if (file.includes('src/routes/') && file.endsWith('.js')) {
        hasNewRoutes = true;
      }

      // Check if it's a new controller file
      if (file.includes('src/controllers/') && file.endsWith('.js')) {
        hasNewFunctions = true;
      }
    } else if (status === 'M') {
      // Check if it's a modified route file
      if (file.includes('src/routes/') && file.endsWith('.js')) {
        hasModifiedFunctions = true;
      }

      // Check if it's a modified controller file
      if (file.includes('src/controllers/') && file.endsWith('.js')) {
        hasModifiedFunctions = true;
      }

      // Check for function-level changes in JavaScript files
      if (file.endsWith('.js') && (file.includes('src/controllers/') || file.includes('src/routes/'))) {
        const functionChanges = analyzeFunctionChanges(file);
        if (functionChanges.hasNewFunctions) {
          hasNewFunctions = true;
        }
        if (functionChanges.hasModifiedFunctions) {
          hasModifiedFunctions = true;
        }
      }
    }
  }

  return {
    hasNewFiles,
    hasNewFunctions,
    hasModifiedFunctions,
    hasNewRoutes
  };
}

function analyzeFunctionChanges(filePath) {
  try {
    // Get the diff for this specific file
    const diff = execSync(`git diff --cached ${filePath}`, { encoding: 'utf8' });

    let hasNewFunctions = false;
    let hasModifiedFunctions = false;

    const lines = diff.split('\n');

    for (const line of lines) {
      // Look for function definitions (both arrow functions and regular functions)
      if (line.startsWith('+') && (
        line.includes('function ') ||
        line.includes('= (') ||
        line.includes('= async (') ||
        line.includes('= function') ||
        line.includes('const ') && line.includes('= (') ||
        line.includes('let ') && line.includes('= (') ||
        line.includes('var ') && line.includes('= (')
      )) {
        hasNewFunctions = true;
      }

      // Look for modified function content (lines that start with + or - but not function definitions)
      if ((line.startsWith('+') || line.startsWith('-')) &&
        !line.includes('function ') &&
        !line.includes('= (') &&
        !line.includes('= async (') &&
        !line.includes('= function') &&
        !line.includes('const ') &&
        !line.includes('let ') &&
        !line.includes('var ')) {
        hasModifiedFunctions = true;
      }
    }

    return { hasNewFunctions, hasModifiedFunctions };
  } catch (error) {
    // If there's an error analyzing the file, assume no function changes
    return { hasNewFunctions: false, hasModifiedFunctions: false };
  }
}

function getCurrentVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return packageJson.version;
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    return '1.0.0';
  }
}

function bumpVersion(currentVersion, bumpType) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);

  switch (bumpType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      return currentVersion;
  }
}

function updatePackageJson(newVersion) {
  try {
    const packageJsonPath = 'package.json';
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.version = newVersion;

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`✅ Updated package.json version to ${newVersion}`);
  } catch (error) {
    console.error('Error updating package.json:', error.message);
    process.exit(1);
  }
}

function determineBumpType(changes) {
  const { hasNewFiles, hasNewFunctions, hasNewRoutes, hasModifiedFunctions } = changes;

  // Check for new routes (minor version)
  if (hasNewRoutes) {
    return 'minor';
  }

  // Check for new files (minor version)
  if (hasNewFiles) {
    return 'minor';
  }

  // Check for new functions (minor version)
  if (hasNewFunctions) {
    return 'minor';
  }

  // Check for modified functions (patch version)
  if (hasModifiedFunctions) {
    return 'patch';
  }

  // Default to patch for any other changes
  return 'patch';
}

function checkIfVersionManuallyUpdated() {
  try {
    // Check if package.json is staged
    const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(line => line.length > 0);

    if (!stagedFiles.includes('package.json')) {
      return false;
    }

    // If package.json is staged, check if the version field was modified
    const packageJsonDiff = execSync('git diff --cached package.json', { encoding: 'utf8' });

    // Look for version changes in the diff
    const lines = packageJsonDiff.split('\n');
    for (const line of lines) {
      if (line.includes('"version"') && (line.startsWith('+') || line.startsWith('-'))) {
        // Check if this is a manual change by looking at the commit message
        // If we're in a pre-commit hook, we can't access the commit message yet
        // So we'll assume it's manual if the version was changed before the hook ran
        return true;
      }
    }

    return false;
  } catch (error) {
    // If there's an error, assume no manual update
    return false;
  }
}

function isVersionBumpFromThisScript() {
  try {
    // Check if package.json was just modified by this script
    // We can detect this by checking if the modification time is very recent
    const stats = fs.statSync('package.json');
    const now = new Date();
    const diffMs = now - stats.mtime;

    // If package.json was modified in the last 5 seconds, it was likely by this script
    return diffMs < 5000;
  } catch (error) {
    return false;
  }
}

function main() {
  const { stagedFiles, unstagedFiles } = getGitDiff();
  const allFiles = [...stagedFiles, ...unstagedFiles];

  if (allFiles.length === 0) {
    console.log('No changes detected, skipping version bump');
    return;
  }

  // Check if version was manually updated in package.json
  const versionManuallyUpdated = checkIfVersionManuallyUpdated();
  const isFromThisScript = isVersionBumpFromThisScript();

  if (versionManuallyUpdated && !isFromThisScript) {
    console.log('📝 Version manually updated in package.json, skipping automatic version bump');
    return;
  }

  const changes = analyzeChanges(allFiles);
  const bumpType = determineBumpType(changes);
  const currentVersion = getCurrentVersion();
  const newVersion = bumpVersion(currentVersion, bumpType);

  console.log(`📊 Change Analysis:`);
  console.log(`   - New files: ${changes.hasNewFiles}`);
  console.log(`   - New functions: ${changes.hasNewFunctions}`);
  console.log(`   - Modified functions: ${changes.hasModifiedFunctions}`);
  console.log(`   - New routes: ${changes.hasNewRoutes}`);
  console.log(`   - Bump type: ${bumpType}`);
  console.log(`   - Version: ${currentVersion} → ${newVersion}`);

  if (currentVersion !== newVersion) {
    updatePackageJson(newVersion);

    // Stage the updated package.json
    try {
      execSync('git add package.json', { stdio: 'inherit' });
      console.log('✅ Staged updated package.json');
    } catch (error) {
      console.error('Error staging package.json:', error.message);
    }
  } else {
    console.log('ℹ️  No version bump needed');
  }
}

// Run the script
main();
