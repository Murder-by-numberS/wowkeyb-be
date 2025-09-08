#!/bin/bash

# Script to create IAM role for App Runner with Parameter Store permissions

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

ROLE_NAME="AppRunnerServiceRole-wowkeyb"
POLICY_NAME="AppRunnerParameterStorePolicy-wowkeyb"
ACCOUNT_ID="351483928422"

print_status "Creating IAM role for App Runner with Parameter Store permissions..."

# Create trust policy for App Runner
cat > /tmp/apprunner-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "build.apprunner.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create the IAM role
print_status "Creating IAM role: $ROLE_NAME"
aws iam create-role \
    --role-name "$ROLE_NAME" \
    --assume-role-policy-document file:///tmp/apprunner-trust-policy.json \
    --description "Service role for App Runner to access Parameter Store"

# Create policy for Parameter Store access
cat > /tmp/parameter-store-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ssm:GetParameter",
                "ssm:GetParameters",
                "ssm:GetParametersByPath"
            ],
            "Resource": [
                "arn:aws:ssm:us-east-1:${ACCOUNT_ID}:parameter/wowkeyb-be/*"
            ]
        }
    ]
}
EOF

# Create the policy
print_status "Creating IAM policy: $POLICY_NAME"
aws iam create-policy \
    --policy-name "$POLICY_NAME" \
    --policy-document file:///tmp/parameter-store-policy.json \
    --description "Policy for App Runner to access wowkeyb-be parameters"

# Attach the policy to the role
print_status "Attaching policy to role..."
aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "arn:aws:iam::${ACCOUNT_ID}:policy/${POLICY_NAME}"

# Also attach the basic App Runner service role policy
aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "arn:aws:iam::aws:policy/service-role/AppRunnerServicePolicyForECRAccess"

# Clean up
rm /tmp/apprunner-trust-policy.json /tmp/parameter-store-policy.json

print_success "IAM role created successfully!"
print_status "Role ARN: arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"
print_status "Policy ARN: arn:aws:iam::${ACCOUNT_ID}:policy/${POLICY_NAME}"
echo ""
print_status "You can now use this role when creating App Runner services:"
echo "  --instance-role-arn arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"
