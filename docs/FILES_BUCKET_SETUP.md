# Files S3 Bucket Setup

## Overview

User files (macro files, keybinding exports, etc.) are stored in a separate S3 bucket from icons to keep things organized and allow for different policies/permissions.

## Environment Variables

Add these to your environment files (`.env.development`, `.env.staging`, `.env.production`):

```bash
# Main bucket (for icons)
AWS_S3_BUCKET_NAME=wowkeyb-dev-images

# Files bucket (separate from icons)
AWS_S3_FILES_BUCKET_NAME=wowkeyb-dev-files

# CloudFront domains (optional, but recommended)
CLOUDFRONT_DOMAIN=d1234567890.cloudfront.net  # For icons
FILES_CLOUDFRONT_DOMAIN=d0987654321.cloudfront.net  # For files
```

## Fallback Behavior

If `AWS_S3_FILES_BUCKET_NAME` is not set, the system will fall back to using `AWS_S3_BUCKET_NAME` (your icon bucket).

Similarly, if `FILES_CLOUDFRONT_DOMAIN` is not set, it will use `CLOUDFRONT_DOMAIN`.

## S3 Bucket Structure

```
wowkeyb-dev-files/
└── macro-files/
    └── {userId}/
        ├── uploads/          # User uploaded files
        │   └── {timestamp}-{filename}.txt
        └── {timestamp}-{filename}.txt  # Generated files
```

## Setting Up the Files Bucket

### Option 1: Create via AWS Console

1. Go to S3 Console
2. Create new bucket: `wowkeyb-dev-files`
3. Configure region (same as your icon bucket)
4. Set up bucket policy for your IAM role
5. Configure CORS if needed
6. Create CloudFront distribution (optional but recommended)

### Option 2: Use AWS CLI

```bash
# Create the bucket
aws s3 mb s3://wowkeyb-dev-files --region us-east-1

# Set bucket policy (allows your IAM role to read/write)
aws s3api put-bucket-policy --bucket wowkeyb-dev-files --policy file://bucket-policy.json

# Enable public read (for CloudFront)
aws s3api put-public-access-block --bucket wowkeyb-dev-files \
  --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Set CORS configuration
aws s3api put-bucket-cors --bucket wowkeyb-dev-files --cors-configuration file://cors-config.json
```

### Bucket Policy Example

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowFileAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:role/YourIamRole"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::wowkeyb-dev-files/macro-files/*"
    },
    {
      "Sid": "PublicReadForCloudFront",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::wowkeyb-dev-files/macro-files/*"
    }
  ]
}
```

### CORS Configuration Example

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

## CloudFront Setup (Recommended)

1. **Create CloudFront Distribution:**
   - Origin: `wowkeyb-dev-files.s3.amazonaws.com`
   - Cache behaviors: Cache by query string (none)
   - Default root object: (leave blank)
   - Price class: Choose based on your needs

2. **Update Environment Variable:**
   ```bash
   FILES_CLOUDFRONT_DOMAIN=d0987654321.cloudfront.net
   ```

3. **Benefits:**
   - Faster downloads (CDN)
   - No expiration (unlike S3 presigned URLs)
   - Lower S3 request costs

## Parameter Store (Production/Staging)

If using AWS Parameter Store:

```bash
# For develop
aws ssm put-parameter \
  --name "/wowkeyb-be/develop/AWS_S3_FILES_BUCKET_NAME" \
  --value "wowkeyb-dev-files" \
  --type "String"

# For staging
aws ssm put-parameter \
  --name "/wowkeyb-be/staging/AWS_S3_FILES_BUCKET_NAME" \
  --value "wowkeyb-staging-files" \
  --type "String"

# For production
aws ssm put-parameter \
  --name "/wowkeyb-be/production/AWS_S3_FILES_BUCKET_NAME" \
  --value "wowkeyb-prod-files" \
  --type "String"
```

And update your AppRunner configs:

```yaml
- name: AWS_S3_FILES_BUCKET_NAME
  value: "arn:aws:ssm:us-east-1:ACCOUNT_ID:parameter/wowkeyb-be/develop/AWS_S3_FILES_BUCKET_NAME"
```

## Testing

After setup, test with:

```bash
# Upload a test file
curl -X POST "http://localhost:1337/api/files/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test-macro.txt" \
  -F "file_type=character" \
  -F "character_class=paladin"

# Verify in S3
aws s3 ls s3://wowkeyb-dev-files/macro-files/
```

## Verification Checklist

- [ ] S3 bucket created: `wowkeyb-dev-files`
- [ ] Environment variable set: `AWS_S3_FILES_BUCKET_NAME`
- [ ] Bucket policy configured
- [ ] CORS configured (if needed)
- [ ] CloudFront distribution created (optional)
- [ ] `FILES_CLOUDFRONT_DOMAIN` set (if using CloudFront)
- [ ] IAM role has permissions to the bucket
- [ ] Test upload works

## Troubleshooting

### "Access Denied" errors
- Check IAM role permissions for S3
- Verify bucket policy allows your role
- Check bucket name matches exactly

### Files not accessible
- Verify CloudFront is configured correctly
- Check bucket policy allows public read (if using CloudFront)
- Ensure CORS is configured if accessing from browser

### Wrong bucket being used
- Check `AWS_S3_FILES_BUCKET_NAME` is set correctly
- Restart the server after changing env variables
- Check logs for which bucket is being used

