# DNS Setup Guide for develop-api.wowkeyb.gg

## Overview
Your App Runner service is now configured to use the custom domain `develop-api.wowkeyb.gg`. You need to add DNS records to your domain provider to complete the setup.

## DNS Records to Add

### 1. Main Domain CNAME Record
**Record Type:** CNAME
**Name:** `develop-api`
**Value:** `sftc2ci8bm.us-east-1.awsapprunner.com`
**TTL:** 300 (or default)

### 2. SSL Certificate Validation Records
Add these CNAME records for SSL certificate validation:

#### Record 1:
**Record Type:** CNAME
**Name:** `_334987fd33c03b6ae6b30d463c2bac29.develop-api`
**Value:** `_053d1176125bbe1baab732754c2dd7f9.xlfgrmvvlj.acm-validations.aws.`
**TTL:** 300 (or default)

#### Record 2:
**Record Type:** CNAME
**Name:** `_c5ac0e9358a556a4bde6d37609c9def8.www.develop-api`
**Value:** `_516b955bcae44ac1a67d7e1f49d16435.xlfgrmvvlj.acm-validations.aws.`
**TTL:** 300 (or default)

#### Record 3:
**Record Type:** CNAME
**Name:** `_9ee4cbb116653b26d303cfb026170bee.2a57j77nf17d51at4ovlohuf3wirpo7.develop-api`
**Value:** `_25d4e67e0ca15fb25e35a8119a950b89.xlfgrmvvlj.acm-validations.aws.`
**TTL:** 300 (or default)

## Steps to Complete Setup

1. **Log into your DNS provider** (where wowkeyb.gg is managed)
2. **Add the main CNAME record** for `develop-api` pointing to `sftc2ci8bm.us-east-1.awsapprunner.com`
3. **Add the three SSL validation CNAME records** as listed above
4. **Wait for DNS propagation** (usually 5-15 minutes)
5. **AWS will automatically validate** the SSL certificate once DNS records are propagated

## Verification

After adding the DNS records, you can verify the setup:

```bash
# Check domain status
aws apprunner describe-custom-domains --service-arn "arn:aws:apprunner:us-east-1:351483928422:service/wowkeyb-backend-develop/5b892b14a36e4c11b7adf5d0a9c85d4b"

# Test the domain (once DNS propagates)
curl https://develop-api.wowkeyb.gg/health
```

## Expected Timeline

- **DNS Propagation:** 5-15 minutes
- **SSL Certificate Validation:** 5-10 minutes after DNS propagation
- **Total Setup Time:** 10-25 minutes

## Current Status

- **Domain:** develop-api.wowkeyb.gg
- **Status:** pending_certificate_dns_validation
- **App Runner Service:** sftc2ci8bm.us-east-1.awsapprunner.com
- **Service ARN:** arn:aws:apprunner:us-east-1:351483928422:service/wowkeyb-backend-develop/5b892b14a36e4c11b7adf5d0a9c85d4b

Once the DNS records are added and propagated, your API will be accessible at:
**https://develop-api.wowkeyb.gg**
