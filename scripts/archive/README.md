# Archived Scripts

This directory was intended to contain obsolete deployment scripts from the migration process.

However, these scripts contained sensitive data (AWS credentials, database URIs, etc.) and have been removed for security reasons.

## What Was Here

The following types of scripts were archived here during the migration:
- `create-*-service.sh` - Various App Runner service creation scripts
- `update-*-service.sh` - Service update scripts
- `setup-*-domain.sh` - Domain setup scripts
- `recreate-*-proper.sh` - Service recreation scripts

## Why They Were Removed

These scripts contained:
- Hardcoded AWS access keys and secrets
- Database connection strings with credentials
- Token secrets and other sensitive configuration

## Current Approach

All sensitive configuration is now handled through:
- AWS Systems Manager Parameter Store
- GitHub Secrets
- Environment variables (not committed to git)

## If You Need These Scripts

If you need to reference the migration process, check the git history before this commit, or recreate them using the current secure patterns found in `scripts/deployment/`.
