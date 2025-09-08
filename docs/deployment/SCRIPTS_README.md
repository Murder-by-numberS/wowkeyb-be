# Scripts Organization

This document explains the organization of deployment and utility scripts in the wowkeyb-be project.

## 📁 Directory Structure

### `/scripts/deployment/` - Active Deployment Scripts
These scripts are currently used for deployment and infrastructure management:

- **`create-service-with-api-config.sh`** - Creates App Runner services using API configuration (bypasses apprunner.yaml)
- **`setup-parameter-store.sh`** - Sets up AWS Systems Manager Parameter Store with environment variables
- **`setup-all-custom-domains.sh`** - Associates custom domains with all App Runner services
- **`setup-route53-records.sh`** - Adds DNS records to Route 53 for custom domains

### `/scripts/cleanup/` - Cleanup Scripts
Scripts for cleaning up AWS resources:

- **`cleanup-codepipeline.sh`** - Lists and helps delete CodePipeline resources
- **`delete-backend-codepipeline.sh`** - Deletes backend CodePipeline and CodeBuild resources
- **`delete-frontend-codepipeline.sh`** - Deletes frontend CodePipeline and CodeBuild resources

### `/scripts/archive/` - Obsolete Scripts
Scripts that were used during the migration process but are no longer needed:

- Various `create-*` scripts that were used during the migration to App Runner
- Various `update-*` scripts that were used to fix configuration issues
- Various `setup-*` scripts that were superseded by newer versions

### `/config/backup/` - Backup Configuration Files
Backup copies of configuration files:

- **`apprunner.yaml.backup`** - Backup of the original apprunner.yaml
- **`apprunner.develop.yaml.backup`** - Backup of develop environment config
- **`apprunner.staging.yaml.backup`** - Backup of staging environment config

## 🚀 Current Deployment Process

### For New Environments:
1. Use `scripts/deployment/create-service-with-api-config.sh` to create App Runner services
2. Use `scripts/deployment/setup-parameter-store.sh` to configure environment variables
3. Use `scripts/deployment/setup-all-custom-domains.sh` to set up custom domains
4. Use `scripts/deployment/setup-route53-records.sh` to configure DNS

### For Cleanup:
1. Use `scripts/cleanup/delete-*-codepipeline.sh` to remove old CI/CD resources
2. Use `scripts/cleanup/cleanup-codepipeline.sh` to list and manage CodePipeline resources

## 📋 Root Directory Scripts

### Active Scripts:
- **`create-apprunner-role.sh`** - Creates IAM roles for App Runner services
- **`cleanup-scripts.sh`** - Organizes and cleans up the script directory structure

### Configuration Files:
- **`apprunner.yaml`** - Current App Runner configuration (minimal, used for reference)
- **`apprunner.develop.yaml`** - Develop environment configuration
- **`apprunner.staging.yaml`** - Staging environment configuration
- **`buildspec.yml`** - AWS CodeBuild specification (kept for reference)

## 🔧 Maintenance

### Adding New Scripts:
- **Deployment scripts** → `/scripts/deployment/`
- **Cleanup scripts** → `/scripts/cleanup/`
- **Utility scripts** → `/scripts/` (create new subdirectory as needed)

### Archiving Old Scripts:
- Move obsolete scripts to `/scripts/archive/`
- Update this README to reflect changes
- Consider deleting very old scripts after confirming they're no longer needed

## 📚 Documentation

- **`DEPLOYMENT.md`** - Main deployment documentation
- **`COMPLETE_DNS_SETUP_GUIDE.md`** - DNS setup guide
- **`PARAMETER_STORE_SETUP.md`** - Parameter Store setup guide
- **`README.md`** - Main project documentation

## 🎯 Current Infrastructure

The project now uses:
- **Backend**: AWS App Runner (3 services: develop, staging, production)
- **Frontend**: GitHub Actions → S3 + CloudFront
- **Environment Variables**: AWS Systems Manager Parameter Store
- **Custom Domains**: Route 53 + App Runner custom domains
- **CI/CD**: GitHub Actions (frontend) + App Runner auto-deploy (backend)

All legacy CodePipeline, CodeBuild, and Elastic Beanstalk resources have been cleaned up.
