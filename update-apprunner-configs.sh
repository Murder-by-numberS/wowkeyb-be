#!/bin/bash

# Script to update App Runner configuration files with your AWS Account ID
# This script replaces ACCOUNT_ID placeholder with your actual AWS Account ID

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

# Get AWS Account ID
print_status "Getting AWS Account ID..."
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

if [ -z "$ACCOUNT_ID" ]; then
    print_error "Failed to get AWS Account ID"
    exit 1
fi

print_success "AWS Account ID: $ACCOUNT_ID"

# Update configuration files
config_files=("apprunner.yaml" "apprunner.develop.yaml" "apprunner.staging.yaml")

for config_file in "${config_files[@]}"; do
    if [ -f "$config_file" ]; then
        print_status "Updating $config_file..."

        # Create backup
        cp "$config_file" "${config_file}.backup"

        # Replace ACCOUNT_ID placeholder
        sed -i.tmp "s/ACCOUNT_ID/$ACCOUNT_ID/g" "$config_file"
        rm "${config_file}.tmp"

        print_success "Updated $config_file"
    else
        print_error "Configuration file $config_file not found"
    fi
done

print_success "All App Runner configuration files updated with Account ID: $ACCOUNT_ID"
echo ""
print_status "Next steps:"
echo "1. Run ./setup-parameter-store.sh to create parameters in Parameter Store"
echo "2. Update your App Runner services to use the new configuration files"
echo "3. Deploy your application"
echo ""
print_status "Configuration files updated:"
for config_file in "${config_files[@]}"; do
    if [ -f "$config_file" ]; then
        echo "  ✓ $config_file"
    fi
done
