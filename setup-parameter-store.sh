#!/bin/bash

# AWS Systems Manager Parameter Store Setup Script for wowkeyb-be
# This script creates parameters for all environments (develop, staging, production)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

print_status "Setting up AWS Systems Manager Parameter Store for wowkeyb-be..."

# Function to create a parameter
create_parameter() {
    local env=$1
    local name=$2
    local value=$3
    local description=$4
    local secure=${5:-false}

    local param_name="/wowkeyb-be/${env}/${name}"

    if [ "$secure" = "true" ]; then
        print_status "Creating secure parameter: ${param_name}"
        aws ssm put-parameter \
            --name "$param_name" \
            --value "$value" \
            --type "SecureString" \
            --description "$description" \
            --overwrite
    else
        print_status "Creating parameter: ${param_name}"
        aws ssm put-parameter \
            --name "$param_name" \
            --value "$value" \
            --type "String" \
            --description "$description" \
            --overwrite
    fi
}

# Function to prompt for environment-specific values
prompt_for_values() {
    local env=$1

    print_status "Setting up parameters for environment: ${env}"
    echo ""

    # Database URI
    read -p "Enter DATABASE_URI for ${env}: " DATABASE_URI
    create_parameter "$env" "DATABASE_URI" "$DATABASE_URI" "MongoDB connection string for ${env}" true

    # Token Secret
    read -p "Enter TOKEN_SECRET for ${env}: " TOKEN_SECRET
    create_parameter "$env" "TOKEN_SECRET" "$TOKEN_SECRET" "JWT token secret for ${env}" true

    # Token Expiration
    read -p "Enter TOKEN_EXPIRATION for ${env} (e.g., '24h'): " TOKEN_EXPIRATION
    create_parameter "$env" "TOKEN_EXPIRATION" "$TOKEN_EXPIRATION" "JWT token expiration time for ${env}"

    # AWS Key
    read -p "Enter AWS_KEY for ${env}: " AWS_KEY
    create_parameter "$env" "AWS_KEY" "$AWS_KEY" "AWS access key for ${env}" true

    # AWS Secret Key
    read -p "Enter AWS_SECRET_KEY for ${env}: " AWS_SECRET_KEY
    create_parameter "$env" "AWS_SECRET_KEY" "$AWS_SECRET_KEY" "AWS secret key for ${env}" true

    # AWS Region
    read -p "Enter AWS_REGION for ${env} (default: us-east-1): " AWS_REGION
    AWS_REGION=${AWS_REGION:-us-east-1}
    create_parameter "$env" "AWS_REGION" "$AWS_REGION" "AWS region for ${env}"

    # S3 Bucket
    read -p "Enter AWS_S3_BUCKET_NAME for ${env}: " AWS_S3_BUCKET_NAME
    create_parameter "$env" "AWS_S3_BUCKET_NAME" "$AWS_S3_BUCKET_NAME" "S3 bucket name for ${env}"

    # S3 Path
    read -p "Enter AWS_S3_PATH for ${env} (optional): " AWS_S3_PATH
    if [ -n "$AWS_S3_PATH" ]; then
        create_parameter "$env" "AWS_S3_PATH" "$AWS_S3_PATH" "S3 path prefix for ${env}"
    fi

    # Frontend URL
    read -p "Enter FE_URL for ${env}: " FE_URL
    create_parameter "$env" "FE_URL" "$FE_URL" "Frontend URL for ${env}"

    # App URL
    read -p "Enter APP_URL for ${env}: " APP_URL
    create_parameter "$env" "APP_URL" "$APP_URL" "Backend app URL for ${env}"

    # Log Level
    read -p "Enter LOG_LEVEL for ${env} (default: info): " LOG_LEVEL
    LOG_LEVEL=${LOG_LEVEL:-info}
    create_parameter "$env" "LOG_LEVEL" "$LOG_LEVEL" "Log level for ${env}"

    print_success "Completed setup for ${env} environment"
    echo ""
}

# Main execution
echo "This script will help you set up AWS Systems Manager Parameter Store for wowkeyb-be."
echo "You'll be prompted to enter values for each environment."
echo ""

# Ask which environments to set up
echo "Which environments would you like to set up?"
echo "1) All environments (develop, staging, production)"
echo "2) Develop only"
echo "3) Staging only"
echo "4) Production only"
echo "5) Custom selection"
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        environments=("develop" "staging" "production")
        ;;
    2)
        environments=("develop")
        ;;
    3)
        environments=("staging")
        ;;
    4)
        environments=("production")
        ;;
    5)
        echo "Enter environments separated by spaces (e.g., develop staging):"
        read -p "Environments: " env_input
        environments=($env_input)
        ;;
    *)
        print_error "Invalid choice. Exiting."
        exit 1
        ;;
esac

# Set up parameters for each environment
for env in "${environments[@]}"; do
    prompt_for_values "$env"
done

print_success "Parameter Store setup completed!"
echo ""
print_status "Next steps:"
echo "1. Update your apprunner.yaml to reference these parameters"
echo "2. Deploy your application to App Runner"
echo "3. Test that your application can access the parameters"
echo ""
print_status "Parameter names created:"
for env in "${environments[@]}"; do
    echo "  /wowkeyb-be/${env}/DATABASE_URI"
    echo "  /wowkeyb-be/${env}/TOKEN_SECRET"
    echo "  /wowkeyb-be/${env}/TOKEN_EXPIRATION"
    echo "  /wowkeyb-be/${env}/AWS_KEY"
    echo "  /wowkeyb-be/${env}/AWS_SECRET_KEY"
    echo "  /wowkeyb-be/${env}/AWS_REGION"
    echo "  /wowkeyb-be/${env}/AWS_S3_BUCKET_NAME"
    echo "  /wowkeyb-be/${env}/AWS_S3_PATH"
    echo "  /wowkeyb-be/${env}/FE_URL"
    echo "  /wowkeyb-be/${env}/APP_URL"
    echo "  /wowkeyb-be/${env}/LOG_LEVEL"
    echo ""
done
