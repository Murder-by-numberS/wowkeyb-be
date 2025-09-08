# Backend AWS App Runner Deployment Guide

This project uses AWS App Runner for cost-effective, serverless deployment with GitHub Actions automation. App Runner provides significant cost savings compared to Elastic Beanstalk while maintaining full AWS integration.

## Environment Setup

### Develop Environment
- **Branch**: `develop`
- **Purpose**: Development and testing of new features

### Staging Environment
- **Branch**: `staging`
- **Purpose**: Pre-production testing and validation

### Production Environment
- **Branch**: `master`
- **Purpose**: Live production deployment

## Required GitHub Secrets

To enable automated deployment, you need to configure the following secrets in your GitHub repository:

### 1. AWS Credentials (Shared)
- `AWS_ACCESS_KEY_ID` - Your AWS access key ID
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret access key

### 2. App Runner Service ARNs
- `APP_RUNNER_SERVICE_DEVELOP` - App Runner service ARN for develop environment
- `APP_RUNNER_SERVICE_STAGING` - App Runner service ARN for staging environment
- `APP_RUNNER_SERVICE_PROD` - App Runner service ARN for production environment

## How to Set Up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the exact names listed above

## Deployment Triggers

The workflow will automatically run when:
- Code is pushed to the `master` branch → **Production deployment**
- Code is pushed to the `develop` branch → **Develop deployment**
- Code is pushed to the `staging` branch → **Staging deployment**
- Manually triggered via the GitHub Actions tab with environment selection

## Build Process

1. **Install Dependencies**: `npm ci` for faster, reliable installs
2. **Run Tests**: Executes any configured tests
3. **Trigger App Runner Deployment**: App Runner automatically pulls from GitHub and builds
4. **Auto-scaling**: App Runner scales based on traffic and charges only for usage

## Environment Variables

The application uses environment-specific configuration files:
- `.env.development` - Development environment variables
- `.env.staging` - Staging environment variables
- `.env.production` - Production environment variables

## Cost Benefits of App Runner vs Elastic Beanstalk

### App Runner Advantages:
- **Pay-per-use**: Only pay when serving requests (scales to zero when idle)
- **Auto-scaling**: Automatically scales based on traffic
- **No server management**: Fully managed service
- **Built-in load balancing**: No additional setup required
- **GitHub integration**: Direct deployment from repository

### Expected Cost Savings:
- **Elastic Beanstalk**: ~$25-40/month minimum (always-on server)
- **App Runner**: ~$5-15/month for typical usage (pay-per-request)
- **Estimated savings**: 60-80% reduction in hosting costs

## Migration from Elastic Beanstalk

To migrate from Elastic Beanstalk to App Runner:

1. **Create App Runner services** in AWS Console for each environment
2. **Connect GitHub repositories** to App Runner services
3. **Set up GitHub Secrets** as described above
4. **Test the deployment** on develop branch first
5. **Remove Elastic Beanstalk** from AWS Console once App Runner is working
6. **Delete buildspec.yml** (no longer needed)

## Monitoring and Troubleshooting

### Check Deployment Status:
1. Go to GitHub repository → **Actions** tab
2. Click on the latest workflow run
3. Review logs for any errors

### Common Issues:
- **Missing secrets**: Ensure all required secrets are configured
- **AWS permissions**: Verify AWS credentials have necessary permissions
- **App Runner services**: Check that service ARNs are correct
- **GitHub connection**: Ensure App Runner services are connected to the correct repository

## Security Best Practices

- Use IAM roles with minimal required permissions
- Rotate AWS access keys regularly
- Monitor deployment logs for security issues
- Use environment-specific secrets

## Performance Optimizations

- **Auto-scaling**: App Runner automatically scales based on traffic
- **Pay-per-use**: Only charges for actual compute time
- **Built-in caching**: App Runner handles caching automatically
- **Database indexes**: Optimized for better performance (see recent updates)
- **Response caching**: Implemented compression and HTTP caching middleware

## GitHub Actions vs App Runner Auto-Deployment

**Note:** This project no longer uses GitHub Actions for backend deployment.

### Why GitHub Actions Was Removed

The backend now uses **App Runner's built-in auto-deployment** feature:

- **AutoDeploymentsEnabled**: `true` on all App Runner services
- **GitHub Integration**: Direct connection to the repository
- **Automatic Triggers**: Deploys automatically on every push to connected branches
- **No Manual Intervention**: No need for GitHub Actions workflows

### Current Deployment Flow

1. **Push to GitHub** → App Runner automatically detects changes
2. **App Runner** → Pulls latest code from the repository
3. **App Runner** → Builds and deploys the application
4. **App Runner** → Updates the running service

### Benefits of App Runner Auto-Deployment

- ✅ **Simpler**: No GitHub Actions configuration needed
- ✅ **Faster**: Direct deployment without workflow overhead
- ✅ **More Reliable**: Built-in AWS integration
- ✅ **Cost Effective**: No GitHub Actions minutes consumed
- ✅ **Automatic Scaling**: Handles traffic spikes automatically

### Manual Deployment (if needed)

If you need to manually trigger a deployment:

```bash
aws apprunner start-deployment --service-arn "SERVICE_ARN"
```

### Service ARNs

- **Develop**: `arn:aws:apprunner:us-east-1:351483928422:service/wowkeyb-backend-develop/5b892b14a36e4c11b7adf5d0a9c85d4b`
- **Staging**: `arn:aws:apprunner:us-east-1:351483928422:service/wowkeyb-backend-staging/75f4959df32f4a8a84afeadc234a341d`
- **Production**: `arn:aws:apprunner:us-east-1:351483928422:service/wowkeyb-backend-production/c2126fa0af30432aa603198757e5ed26`
