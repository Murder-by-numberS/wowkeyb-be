#!/bin/bash

# Script to delete backend-specific CodePipeline resources

set -e

echo "[INFO] Deleting backend CodePipeline resources..."

# Delete backend pipelines
echo "[INFO] Deleting CodePipelines..."
aws codepipeline delete-pipeline --name "wowkeyb-be" --no-cli-pager
echo "✅ Deleted wowkeyb-be pipeline"

aws codepipeline delete-pipeline --name "wowkeyb-be-develop" --no-cli-pager
echo "✅ Deleted wowkeyb-be-develop pipeline"

aws codepipeline delete-pipeline --name "wowkeyb-be-staging" --no-cli-pager
echo "✅ Deleted wowkeyb-be-staging pipeline"

# Delete backend CodeBuild project
echo "[INFO] Deleting CodeBuild project..."
aws codebuild delete-project --name "wowkeyb-be" --no-cli-pager
echo "✅ Deleted wowkeyb-be CodeBuild project"

echo ""
echo "[SUCCESS] Backend CodePipeline resources deleted!"
echo "[INFO] Your App Runner service is now handling all backend deployments."
echo ""
echo "[INFO] Remaining resources (frontend-related):"
echo "- wowkeyb-fe pipeline"
echo "- wowkeyb-fe-develop pipeline"
echo "- wowkeyb-fe-staging pipeline"
echo "- wowkeyb-fe CodeBuild project"
echo ""
echo "[INFO] You can delete these when you're ready to migrate the frontend as well."
