#!/bin/bash

# Script to organize and clean up deployment scripts
# This will move scripts into organized directories and remove obsolete ones

set -e

echo "[INFO] Organizing and cleaning up deployment scripts..."

# Create organized directories
mkdir -p scripts/deployment
mkdir -p scripts/cleanup
mkdir -p scripts/archive
mkdir -p config/backup

echo "[INFO] Created organized directories"

# Move current/active scripts to deployment folder
echo "[INFO] Moving active deployment scripts..."
mv create-service-with-api-config.sh scripts/deployment/
mv setup-parameter-store.sh scripts/deployment/
mv setup-all-custom-domains.sh scripts/deployment/
mv setup-route53-records.sh scripts/deployment/

# Move cleanup scripts
echo "[INFO] Moving cleanup scripts..."
mv delete-backend-codepipeline.sh scripts/cleanup/
mv delete-frontend-codepipeline.sh scripts/cleanup/
mv cleanup-codepipeline.sh scripts/cleanup/

# Move backup configs
echo "[INFO] Moving backup configs..."
mv *.yaml.backup config/backup/

# Archive obsolete scripts (these were used during migration but are no longer needed)
echo "[INFO] Archiving obsolete scripts..."
mv create-develop-service-final.sh scripts/archive/
mv create-develop-service.sh scripts/archive/
mv create-minimal-service.sh scripts/archive/
mv create-new-apprunner-service.sh scripts/archive/
mv create-production-service-master.sh scripts/archive/
mv create-staging-production-services.sh scripts/archive/
mv create-staging-service-develop.sh scripts/archive/
mv recreate-staging-production-proper.sh scripts/archive/
mv update-apprunner-configs.sh scripts/archive/
mv update-apprunner-service.sh scripts/archive/
mv update-route53-records.sh scripts/archive/
mv update-service-to-nodejs22.sh scripts/archive/
mv update-service-with-actual-values.sh scripts/archive/
mv setup-custom-domain.sh scripts/archive/
mv setup-staging-production-domains.sh scripts/archive/
mv deploy-optimizations.sh scripts/archive/

# Keep these in root (they're still useful)
echo "[INFO] Keeping these scripts in root (still useful):"
echo "  - create-apprunner-role.sh (for creating IAM roles)"
echo "  - buildspec.yml (for reference)"

# Keep current configs in root
echo "[INFO] Keeping current configs in root:"
echo "  - apprunner.yaml (current config)"
echo "  - apprunner.develop.yaml (current config)"
echo "  - apprunner.staging.yaml (current config)"

echo ""
echo "[SUCCESS] Script organization complete!"
echo ""
echo "📁 New structure:"
echo "  scripts/deployment/     - Active deployment scripts"
echo "  scripts/cleanup/        - Cleanup scripts"
echo "  scripts/archive/        - Obsolete scripts (for reference)"
echo "  config/backup/          - Backup YAML configs"
echo ""
echo "📁 Root directory now contains:"
echo "  - Active scripts (create-apprunner-role.sh)"
echo "  - Current configs (apprunner.yaml, etc.)"
echo "  - Documentation (*.md files)"
echo "  - Source code (src/)"
