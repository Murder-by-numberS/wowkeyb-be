#!/bin/bash

# Script to create App Runner service with API configuration (bypassing apprunner.yaml)

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

SERVICE_NAME="wowkeyb-backend-develop"
ROLE_ARN="arn:aws:iam::351483928422:role/AppRunnerServiceRole-wowkeyb"
CONNECTION_ARN="arn:aws:apprunner:us-east-1:351483928422:connection/wowkeyb-github-connection/e6bc601530a84967a31a97a26dc97ebb"
ACCOUNT_ID="351483928422"

print_status "Creating App Runner service with API configuration (bypassing apprunner.yaml)..."

# Create the service configuration
cat > /tmp/service-config.json << EOF
{
    "ServiceName": "$SERVICE_NAME",
    "SourceConfiguration": {
        "CodeRepository": {
            "RepositoryUrl": "https://github.com/Murder-by-numberS/wowkeyb-be",
            "SourceCodeVersion": {
                "Type": "BRANCH",
                "Value": "develop"
            },
            "CodeConfiguration": {
                "ConfigurationSource": "API",
                "CodeConfigurationValues": {
                    "Runtime": "NODEJS_22",
                    "BuildCommand": "npm ci",
                    "StartCommand": "npm start",
                    "Port": "1337",
                    "RuntimeEnvironmentVariables": {
                        "NODE_ENV": "development",
                        "PORT": "1337",
                        "DATABASE_URI": "arn:aws:ssm:us-east-1:${ACCOUNT_ID}:parameter/wowkeyb-be/develop/DATABASE_URI",
                        "TOKEN_SECRET": "arn:aws:ssm:us-east-1:${ACCOUNT_ID}:parameter/wowkeyb-be/develop/TOKEN_SECRET",
                        "TOKEN_EXPIRATION": "arn:aws:ssm:us-east-1:${ACCOUNT_ID}:parameter/wowkeyb-be/develop/TOKEN_EXPIRATION",
                        "AWS_KEY": "arn:aws:ssm:us-east-1:${ACCOUNT_ID}:parameter/wowkeyb-be/develop/AWS_KEY",
                        "AWS_SECRET_KEY": "arn:aws:ssm:us-east-1:${ACCOUNT_ID}:parameter/wowkeyb-be/develop/AWS_SECRET_KEY",
                        "AWS_REGION": "arn:aws:ssm:us-east-1:${ACCOUNT_ID}:parameter/wowkeyb-be/develop/AWS_REGION",
                        "AWS_S3_BUCKET_NAME": "arn:aws:ssm:us-east-1:${ACCOUNT_ID}:parameter/wowkeyb-be/develop/AWS_S3_BUCKET_NAME",
                        "AWS_S3_PATH": "arn:aws:ssm:us-east-1:${ACCOUNT_ID}:parameter/wowkeyb-be/develop/AWS_S3_PATH",
                        "FE_URL": "arn:aws:ssm:us-east-1:${ACCOUNT_ID}:parameter/wowkeyb-be/develop/FE_URL",
                        "APP_URL": "arn:aws:ssm:us-east-1:${ACCOUNT_ID}:parameter/wowkeyb-be/develop/APP_URL",
                        "LOG_LEVEL": "arn:aws:ssm:us-east-1:${ACCOUNT_ID}:parameter/wowkeyb-be/develop/LOG_LEVEL"
                    }
                }
            },
            "SourceDirectory": "/"
        },
        "AutoDeploymentsEnabled": true,
        "AuthenticationConfiguration": {
            "ConnectionArn": "$CONNECTION_ARN"
        }
    },
    "InstanceConfiguration": {
        "Cpu": "256",
        "Memory": "512",
        "InstanceRoleArn": "$ROLE_ARN"
    },
    "HealthCheckConfiguration": {
        "Protocol": "HTTP",
        "Path": "/health",
        "Interval": 10,
        "Timeout": 5,
        "HealthyThreshold": 1,
        "UnhealthyThreshold": 5
    }
}
EOF

print_status "Creating App Runner service with API configuration..."
aws apprunner create-service \
    --cli-input-json file:///tmp/service-config.json

# Clean up
rm /tmp/service-config.json

print_success "App Runner service creation initiated!"
print_status "The service will:"
echo "  • Use API configuration instead of apprunner.yaml"
echo "  • Use Node.js 18 runtime (NODEJS_18)"
echo "  • Have access to Parameter Store via the IAM role"
echo "  • Automatically deploy from the develop branch"
echo ""
print_status "You can monitor the creation progress with:"
echo "  aws apprunner list-services"
