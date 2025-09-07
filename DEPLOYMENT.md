# Backend GitHub Actions Deployment Guide

This project uses GitHub Actions for automated deployment to AWS Elastic Beanstalk with separate develop, staging, and production environments, replacing the previous CodePipeline setup.

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

### 2. S3 Bucket for Deployments
- `S3_BUCKET_NAME_BACKEND` - S3 bucket for storing deployment packages

### 3. Elastic Beanstalk Applications
- `EB_APPLICATION_NAME_DEVELOP` - Elastic Beanstalk application name for develop
- `EB_APPLICATION_NAME_STAGING` - Elastic Beanstalk application name for staging
- `EB_APPLICATION_NAME_PROD` - Elastic Beanstalk application name for production

### 4. Elastic Beanstalk Environments
- `EB_ENVIRONMENT_NAME_DEVELOP` - Elastic Beanstalk environment name for develop
- `EB_ENVIRONMENT_NAME_STAGING` - Elastic Beanstalk environment name for staging
- `EB_ENVIRONMENT_NAME_PROD` - Elastic Beanstalk environment name for production

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
3. **Build Application**: Creates deployment package with source code
4. **Create Deployment Package**: Zips the application for deployment
5. **Deploy to Elastic Beanstalk**: Uploads and deploys to the target environment

## Environment Variables

The application uses environment-specific configuration files:
- `.env.development` - Development environment variables
- `.env.staging` - Staging environment variables
- `.env.production` - Production environment variables

## Cost Benefits of GitHub Actions vs CodePipeline

### GitHub Actions Advantages:
- **Free tier**: 2,000 minutes/month for private repos
- **Pay-per-use**: Only pay for actual build time
- **No setup costs**: No pipeline creation fees
- **Better caching**: Faster builds with npm cache
- **Simpler configuration**: YAML-based, easier to maintain

### Expected Cost Savings:
- **CodePipeline**: ~$1-3 per deployment + build time costs
- **GitHub Actions**: Free for most small projects, ~$0.008/minute for overages
- **Estimated savings**: 60-80% reduction in deployment costs

## Migration from CodePipeline

To migrate from CodePipeline to GitHub Actions:

1. **Set up GitHub Secrets** as described above
2. **Test the deployment** on develop branch first
3. **Remove CodePipeline** from AWS Console once GitHub Actions is working
4. **Delete buildspec.yml** (no longer needed)

## Monitoring and Troubleshooting

### Check Deployment Status:
1. Go to GitHub repository → **Actions** tab
2. Click on the latest workflow run
3. Review logs for any errors

### Common Issues:
- **Missing secrets**: Ensure all required secrets are configured
- **AWS permissions**: Verify AWS credentials have necessary permissions
- **Elastic Beanstalk**: Check that application and environment names are correct

## Security Best Practices

- Use IAM roles with minimal required permissions
- Rotate AWS access keys regularly
- Monitor deployment logs for security issues
- Use environment-specific secrets

## Performance Optimizations

- **Caching**: GitHub Actions caches npm dependencies
- **Parallel jobs**: Can be configured for faster deployments
- **Build optimization**: Only deploys changed code
- **Database indexes**: Optimized for better performance (see recent updates)
