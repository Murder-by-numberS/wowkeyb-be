# Scripts Directory

This directory contains all deployment, utility, and maintenance scripts for the wowkeyb-be project.

## 📁 Directory Structure

### `/scripts/deployment/` - Active Deployment Scripts
Scripts currently used for deployment and infrastructure management:

- **`create-service-with-api-config.sh`** - Creates App Runner services using API configuration
- **`setup-parameter-store.sh`** - Sets up AWS Systems Manager Parameter Store
- **`setup-all-custom-domains.sh`** - Associates custom domains with App Runner services
- **`setup-route53-records.sh`** - Adds DNS records to Route 53

### `/scripts/cleanup/` - Cleanup Scripts
Scripts for cleaning up AWS resources:

- **`cleanup-codepipeline.sh`** - Lists and helps delete CodePipeline resources
- **`delete-backend-codepipeline.sh`** - Deletes backend CodePipeline and CodeBuild resources
- **`delete-frontend-codepipeline.sh`** - Deletes frontend CodePipeline and CodeBuild resources

### `/scripts/utilities/` - Utility Scripts
General utility scripts for maintenance and setup:

- **`create-apprunner-role.sh`** - Creates IAM roles for App Runner services
- **`cleanup-scripts.sh`** - Organizes and cleans up the script directory structure

### `/scripts/archive/` - Obsolete Scripts
Scripts that were used during migration but are no longer needed (kept for reference).

## 🚀 Usage

### For New Deployments:
```bash
# 1. Create IAM role
./scripts/utilities/create-apprunner-role.sh

# 2. Set up Parameter Store
./scripts/deployment/setup-parameter-store.sh

# 3. Create App Runner services
./scripts/deployment/create-service-with-api-config.sh

# 4. Set up custom domains
./scripts/deployment/setup-all-custom-domains.sh

# 5. Configure DNS
./scripts/deployment/setup-route53-records.sh
```

### For Cleanup:
```bash
# Delete old CI/CD resources
./scripts/cleanup/delete-backend-codepipeline.sh
./scripts/cleanup/delete-frontend-codepipeline.sh
```

## 📚 Documentation

For detailed information, see:
- **`../docs/deployment/SCRIPTS_README.md`** - Detailed scripts documentation
- **`../docs/setup/`** - Setup guides
- **`../docs/deployment/DEPLOYMENT.md`** - Deployment process
