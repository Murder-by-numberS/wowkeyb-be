# AWS Systems Manager Parameter Store Setup Guide

This guide will help you set up AWS Systems Manager Parameter Store for your wowkeyb-be application to securely manage environment variables across all environments.

## Overview

Instead of hardcoding environment variables in App Runner console, we'll use AWS Systems Manager Parameter Store to:
- Securely store sensitive values (encrypted)
- Manage environment-specific configurations
- Keep secrets out of your code and configuration files
- Use the free tier (10,000 parameters free)

## Prerequisites

1. AWS CLI installed and configured
2. Appropriate AWS permissions for Systems Manager and App Runner
3. Your AWS Account ID

## Setup Steps

### Step 1: Update App Runner Configuration Files

First, update your App Runner configuration files with your AWS Account ID:

```bash
./update-apprunner-configs.sh
```

This script will:
- Get your AWS Account ID
- Replace `ACCOUNT_ID` placeholders in all `apprunner.*.yaml` files
- Create backups of original files

### Step 2: Create Parameters in Parameter Store

Run the interactive setup script:

```bash
./setup-parameter-store.sh
```

This script will prompt you to enter values for each environment. You can choose to set up:
- All environments (develop, staging, production)
- Individual environments
- Custom selection

### Step 3: Update App Runner Services

You'll need to update your App Runner services to use the new configuration files:

#### For Develop Environment:
- Use `apprunner.develop.yaml` as your configuration source
- Or manually update environment variables in App Runner console to reference Parameter Store ARNs

#### For Staging Environment:
- Use `apprunner.staging.yaml` as your configuration source

#### For Production Environment:
- Use `apprunner.yaml` as your configuration source

### Step 4: Grant App Runner Access to Parameter Store

Your App Runner service needs permission to read from Parameter Store. The service role should have these permissions:

```json
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
                "arn:aws:ssm:us-east-1:YOUR_ACCOUNT_ID:parameter/wowkeyb-be/*"
            ]
        }
    ]
}
```

## Parameter Structure

Parameters are organized by environment:

```
/wowkeyb-be/develop/DATABASE_URI
/wowkeyb-be/develop/TOKEN_SECRET
/wowkeyb-be/develop/TOKEN_EXPIRATION
/wowkeyb-be/develop/AWS_KEY
/wowkeyb-be/develop/AWS_SECRET_KEY
/wowkeyb-be/develop/AWS_REGION
/wowkeyb-be/develop/AWS_S3_BUCKET_NAME
/wowkeyb-be/develop/AWS_S3_PATH
/wowkeyb-be/develop/FE_URL
/wowkeyb-be/develop/APP_URL
/wowkeyb-be/develop/LOG_LEVEL
```

Same structure for `staging` and `production` environments.

## Environment Variables Required

Based on your application code, these environment variables are needed:

| Variable | Description | Secure |
|----------|-------------|---------|
| `DATABASE_URI` | MongoDB connection string | Yes |
| `TOKEN_SECRET` | JWT token secret | Yes |
| `TOKEN_EXPIRATION` | JWT token expiration (e.g., "24h") | No |
| `AWS_KEY` | AWS access key | Yes |
| `AWS_SECRET_KEY` | AWS secret key | Yes |
| `AWS_REGION` | AWS region (default: us-east-1) | No |
| `AWS_S3_BUCKET_NAME` | S3 bucket name | No |
| `AWS_S3_PATH` | S3 path prefix (optional) | No |
| `FE_URL` | Frontend URL | No |
| `APP_URL` | Backend app URL | No |
| `LOG_LEVEL` | Log level (default: info) | No |

## Testing the Setup

1. Deploy your application to App Runner
2. Check the application logs to ensure it starts successfully
3. Test API endpoints to verify environment variables are loaded correctly
4. Monitor CloudWatch logs for any Parameter Store access errors

## Troubleshooting

### Common Issues

1. **Access Denied Errors**
   - Ensure App Runner service role has SSM permissions
   - Check parameter ARNs are correct

2. **Parameter Not Found**
   - Verify parameter names match exactly
   - Check AWS region is correct

3. **Application Won't Start**
   - Check CloudWatch logs for specific error messages
   - Verify all required parameters are created

### Useful Commands

```bash
# List all parameters
aws ssm get-parameters-by-path --path "/wowkeyb-be" --recursive

# Get a specific parameter
aws ssm get-parameter --name "/wowkeyb-be/develop/DATABASE_URI" --with-decryption

# Update a parameter
aws ssm put-parameter --name "/wowkeyb-be/develop/DATABASE_URI" --value "new-value" --overwrite
```

## Cost

AWS Systems Manager Parameter Store is **FREE** for your use case:
- 10,000 parameters free (you'll use ~33)
- 10,000 API calls free per month
- No additional charges expected

## Security Benefits

- Sensitive values are encrypted at rest
- No secrets in code or configuration files
- Centralized secret management
- Audit trail of parameter access
- Easy rotation of secrets

## Next Steps

After completing this setup:
1. Update your deployment documentation
2. Consider setting up parameter rotation for sensitive values
3. Monitor parameter access in CloudTrail
4. Set up alerts for parameter access failures
