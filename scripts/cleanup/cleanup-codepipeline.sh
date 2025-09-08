#!/bin/bash

# Script to clean up CodePipeline and related resources

set -e

echo "[INFO] Cleaning up CodePipeline and related resources..."

# List current pipelines
echo "[INFO] Current CodePipelines:"
aws codepipeline list-pipelines --query 'pipelines[].{Name:name,Version:version}' --output table

echo ""
echo "[INFO] Current CodeBuild projects:"
aws codebuild list-projects --query 'projects[]' --output table

echo ""
echo "[INFO] Current CodeDeploy applications:"
aws deploy list-applications --query 'applications[]' --output table

echo ""
echo "[WARNING] This script will help you identify resources to delete."
echo "[WARNING] Please review the resources above before proceeding."
echo ""
echo "[INFO] To delete resources, you can use these commands:"
echo ""
echo "# Delete CodePipeline (replace PIPELINE_NAME with actual name):"
echo "aws codepipeline delete-pipeline --name PIPELINE_NAME"
echo ""
echo "# Delete CodeBuild project (replace PROJECT_NAME with actual name):"
echo "aws codebuild delete-project --name PROJECT_NAME"
echo ""
echo "# Delete CodeDeploy application (replace APP_NAME with actual name):"
echo "aws deploy delete-application --application-name APP_NAME"
echo ""
echo "[INFO] You may also want to delete:"
echo "- IAM roles created for CodePipeline/CodeBuild/CodeDeploy"
echo "- S3 buckets used for artifacts"
echo "- CloudFormation stacks if any were created"
echo ""
echo "[SUCCESS] App Runner is now handling your deployments directly from GitHub!"
echo "[INFO] Your service will auto-deploy when you push to the develop branch."
