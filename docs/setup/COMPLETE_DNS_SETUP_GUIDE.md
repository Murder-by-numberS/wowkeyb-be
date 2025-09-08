# Complete DNS Setup Guide for All Environments

## Overview
All three App Runner services are now configured with custom domains. You need to add DNS records to your domain provider to complete the setup.

## Environment Summary

| Environment | Domain | Service URL | Status |
|-------------|--------|-------------|---------|
| **Develop** | `develop-api.wowkeyb.gg` | `sftc2ci8bm.us-east-1.awsapprunner.com` | ✅ Ready |
| **Staging** | `staging-api.wowkeyb.gg` | `aievbtat4m.us-east-1.awsapprunner.com` | ✅ Ready |
| **Production** | `api.wowkeyb.gg` | `hxtqcyvww2.us-east-1.awsapprunner.com` | ✅ Ready |

## DNS Records to Add

### 1. DEVELOP ENVIRONMENT (develop-api.wowkeyb.gg)

#### Main Domain CNAME Record:
**Record Type:** CNAME
**Name:** `develop-api`
**Value:** `sftc2ci8bm.us-east-1.awsapprunner.com`
**TTL:** 300 (or default)

#### SSL Certificate Validation Records:
1. **Record Type:** CNAME
   **Name:** `_334987fd33c03b6ae6b30d463c2bac29.develop-api`
   **Value:** `_053d1176125bbe1baab732754c2dd7f9.xlfgrmvvlj.acm-validations.aws.`

2. **Record Type:** CNAME
   **Name:** `_c5ac0e9358a556a4bde6d37609c9def8.www.develop-api`
   **Value:** `_516b955bcae44ac1a67d7e1f49d16435.xlfgrmvvlj.acm-validations.aws.`

3. **Record Type:** CNAME
   **Name:** `_9ee4cbb116653b26d303cfb026170bee.2a57j77nf17d51at4ovlohuf3wirpo7.develop-api`
   **Value:** `_25d4e67e0ca15fb25e35a8119a950b89.xlfgrmvvlj.acm-validations.aws.`

### 2. STAGING ENVIRONMENT (staging-api.wowkeyb.gg)

#### Main Domain CNAME Record:
**Record Type:** CNAME
**Name:** `staging-api`
**Value:** `aievbtat4m.us-east-1.awsapprunner.com`
**TTL:** 300 (or default)

#### SSL Certificate Validation Records:
1. **Record Type:** CNAME
   **Name:** `_cd332f1ee8b4762d3d53251ff88b20e3.staging-api`
   **Value:** `_5830ff571ccea09249718ccb3f0dc6ae.xlfgrmvvlj.acm-validations.aws.`

2. **Record Type:** CNAME
   **Name:** `_81be427a5428d8bb0213d246617b917f.2a57j77nf17d51at4ovlohuf3wirpo7.staging-api`
   **Value:** `_b2dab5dd65cc284a2c34175b8a98e9dd.xlfgrmvvlj.acm-validations.aws.`

3. **Record Type:** CNAME
   **Name:** `_9b9b28b5210598bec2db8fe8e10b1147.www.staging-api`
   **Value:** `_6b92bf89f2d73c97f556f3a810535b76.xlfgrmvvlj.acm-validations.aws.`

### 3. PRODUCTION ENVIRONMENT (api.wowkeyb.gg)

#### Main Domain CNAME Record:
**Record Type:** CNAME
**Name:** `api`
**Value:** `hxtqcyvww2.us-east-1.awsapprunner.com`
**TTL:** 300 (or default)

#### SSL Certificate Validation Records:
1. **Record Type:** CNAME
   **Name:** `_1e8be59f74c97f7639bcd50f54aef979.api`
   **Value:** `_addd639fe69475ec0d7224391ef5e18d.xlfgrmvvlj.acm-validations.aws.`

2. **Record Type:** CNAME
   **Name:** `_e54855005496f22891557ffeb1cec9ac.2a57j77nf17d51at4ovlohuf3wirpo7.api`
   **Value:** `_daf7338237d85e8276689ae7d8597cc3.xlfgrmvvlj.acm-validations.aws.`

3. **Record Type:** CNAME
   **Name:** `_547071fa22f227477fe3ed6d46056b59.www.api`
   **Value:** `_5015199031727983a977533972b32dfe.xlfgrmvvlj.acm-validations.aws.`

## Steps to Complete Setup

1. **Log into your DNS provider** (where wowkeyb.gg is managed)
2. **Add all CNAME records** listed above for each environment
3. **Wait for DNS propagation** (usually 5-15 minutes)
4. **AWS will automatically validate** SSL certificates once DNS records are propagated

## Verification Commands

After adding the DNS records, you can verify the setup:

```bash
# Check develop domain status
aws apprunner describe-custom-domains --service-arn "arn:aws:apprunner:us-east-1:351483928422:service/wowkeyb-backend-develop/5b892b14a36e4c11b7adf5d0a9c85d4b"

# Check staging domain status
aws apprunner describe-custom-domains --service-arn "arn:aws:apprunner:us-east-1:351483928422:service/wowkeyb-backend-staging/75f4959df32f4a8a84afeadc234a341d"

# Check production domain status
aws apprunner describe-custom-domains --service-arn "arn:aws:apprunner:us-east-1:351483928422:service/wowkeyb-backend-production/c2126fa0af30432aa603198757e5ed26"

# Test the domains (once DNS propagates)
curl https://develop-api.wowkeyb.gg/health
curl https://staging-api.wowkeyb.gg/health
curl https://api.wowkeyb.gg/health
```

## Expected Timeline

- **DNS Propagation:** 5-15 minutes
- **SSL Certificate Validation:** 5-10 minutes after DNS propagation
- **Total Setup Time:** 10-25 minutes

## Final API Endpoints

Once DNS is configured, your APIs will be available at:

- **Develop:** `https://develop-api.wowkeyb.gg`
- **Staging:** `https://staging-api.wowkeyb.gg`
- **Production:** `https://api.wowkeyb.gg`

## Branch Configuration

- **Develop:** Uses `develop` branch with auto-deployments
- **Staging:** Uses `staging` branch with auto-deployments
- **Production:** Uses `master` branch with auto-deployments

All branches are now up-to-date with the latest changes including Node.js 22 support and all dependencies.
