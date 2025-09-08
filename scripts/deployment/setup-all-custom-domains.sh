#!/bin/bash

# Script to set up custom domains for all environments

set -e

echo "[INFO] Setting up custom domains for all environments..."

# Service ARNs
DEVELOP_SERVICE_ARN="arn:aws:apprunner:us-east-1:351483928422:service/wowkeyb-backend-develop/5b892b14a36e4c11b7adf5d0a9c85d4b"
STAGING_SERVICE_ARN="arn:aws:apprunner:us-east-1:351483928422:service/wowkeyb-backend-staging/c974a6983ab9435189dd03b5c280ca20"
PRODUCTION_SERVICE_ARN="arn:aws:apprunner:us-east-1:351483928422:service/wowkeyb-backend-production/3511c5a7830248629bf6f13c77d53b0f"

# Function to associate custom domain
associate_domain() {
    local service_arn="$1"
    local domain_name="$2"
    local service_name="$3"

    echo "[INFO] Setting up custom domain for $service_name: $domain_name"

    aws apprunner associate-custom-domain \
      --service-arn "$service_arn" \
      --domain-name "$domain_name" \
      --enable-www-subdomain

    echo "✅ Custom domain associated: $domain_name"
}

# Set up custom domains
echo "[INFO] Develop domain already set up: develop-api.wowkeyb.gg"

echo ""
echo "[INFO] Setting up staging domain..."
associate_domain "$STAGING_SERVICE_ARN" "staging-api.wowkeyb.gg" "staging"

echo ""
echo "[INFO] Setting up production domain..."
associate_domain "$PRODUCTION_SERVICE_ARN" "api.wowkeyb.gg" "production"

echo ""
echo "[SUCCESS] All custom domains have been set up!"
echo ""
echo "[INFO] Custom domains configured:"
echo "- develop-api.wowkeyb.gg → develop service"
echo "- staging-api.wowkeyb.gg → staging service"
echo "- api.wowkeyb.gg → production service"
echo ""
echo "[INFO] Next steps:"
echo "1. Wait for domains to be in 'pending_certificate_dns_validation' status"
echo "2. Add DNS records for each domain (see DNS_SETUP_GUIDE.md)"
echo "3. Wait for SSL certificate validation"
echo ""
echo "[INFO] To check domain status, run:"
echo "aws apprunner describe-custom-domains --service-arn <SERVICE_ARN>"
