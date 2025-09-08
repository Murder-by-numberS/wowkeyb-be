#!/bin/bash

# Script to delete frontend CodePipeline and CodeBuild resources
# (Frontend now uses GitHub Actions + S3 + CloudFront)

set -e

echo "[INFO] Deleting frontend CodePipeline and CodeBuild resources..."
echo "[INFO] Frontend now uses GitHub Actions + S3 + CloudFront"

# Delete CodePipelines
echo "[INFO] Deleting frontend CodePipelines..."
PIPELINES=("wowkeyb-fe" "wowkeyb-fe-develop" "wowkeyb-fe-staging")
for pipeline in "${PIPELINES[@]}"; do
    if aws codepipeline get-pipeline --name "$pipeline" &> /dev/null; then
        aws codepipeline delete-pipeline --name "$pipeline"
        echo "✅ Deleted $pipeline pipeline"
    else
        echo "☑️ Pipeline $pipeline does not exist, skipping."
    fi
done

# Delete CodeBuild project
echo "[INFO] Deleting frontend CodeBuild project..."
CODEBUILD_PROJECT="wowkeyb-fe"
if aws codebuild batch-get-projects --names "$CODEBUILD_PROJECT" &> /dev/null; then
    aws codebuild delete-project --name "$CODEBUILD_PROJECT"
    echo "✅ Deleted $CODEBUILD_PROJECT CodeBuild project"
else
    echo "☑️ CodeBuild project $CODEBUILD_PROJECT does not exist, skipping."
fi

echo ""
echo "[SUCCESS] Frontend CodePipeline and CodeBuild resources deleted!"
echo "[INFO] Your frontend now uses GitHub Actions for deployment to S3 + CloudFront"
echo ""
echo "[INFO] Remaining resources:"
echo "- Frontend Elastic Beanstalk: Wowkeyb-fe-develop (still serving traffic)"
echo "- Backend App Runner: 3 services (develop, staging, production)"
echo ""
echo "[INFO] You can keep the frontend Elastic Beanstalk or migrate it to App Runner later."
