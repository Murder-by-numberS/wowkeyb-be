import { CloudFrontClient, CreateDistributionCommand, GetDistributionCommand } from '@aws-sdk/client-cloudfront';
import s3Client from '../config/s3.js';
import Config from '../config/config.js';

// Create CloudFront client
const cloudfrontClient = new CloudFrontClient({
  credentials: {
    accessKeyId: Config.accessKey,
    secretAccessKey: Config.secretAccessKey,
  },
  region: Config.region,
});

// Create CloudFront distribution for icon delivery
async function createCloudFrontDistribution() {
  try {
    const bucketName = Config.bucket.toLowerCase().replace(/_/g, '-');
    const s3DomainName = `${bucketName}.s3.amazonaws.com`;

    console.log(`Setting up CloudFront distribution for bucket: ${bucketName}`);
    console.log(`S3 Domain: ${s3DomainName}`);

    const distributionConfig = {
      DistributionConfig: {
        CallerReference: `wowkeyb-icons-${Date.now()}`,
        Comment: 'CloudFront distribution for WoW Keyb icons',
        DefaultCacheBehavior: {
          TargetOriginId: 'S3-wowkeyb-icons',
          ViewerProtocolPolicy: 'redirect-to-https',
          AllowedMethods: {
            Quantity: 2,
            Items: ['GET', 'HEAD'],
            CachedMethods: {
              Quantity: 2,
              Items: ['GET', 'HEAD']
            }
          },
          ForwardedValues: {
            QueryString: false,
            Cookies: {
              Forward: 'none'
            }
          },
          MinTTL: 0,
          DefaultTTL: 86400, // 1 day
          MaxTTL: 31536000,  // 1 year
          Compress: true
        },
        Origins: {
          Quantity: 1,
          Items: [
            {
              Id: 'S3-wowkeyb-icons',
              DomainName: s3DomainName,
              S3OriginConfig: {
                OriginAccessIdentity: ''
              }
            }
          ]
        },
        Enabled: true,
        PriceClass: 'PriceClass_100', // Use only North America and Europe for cost savings
        HttpVersion: 'http2',
        IsIPV6Enabled: true
      }
    };

    console.log('Creating CloudFront distribution...');
    const command = new CreateDistributionCommand(distributionConfig);
    const response = await cloudfrontClient.send(command);

    const distributionId = response.Distribution.Id;
    const domainName = response.Distribution.DomainName;

    console.log('\n🎉 CloudFront distribution created successfully!');
    console.log(`Distribution ID: ${distributionId}`);
    console.log(`CloudFront Domain: ${domainName}`);
    console.log(`CloudFront URL: https://${domainName}`);

    console.log('\n⚠️  Important: Update your .env.development file:');
    console.log(`CLOUDFRONT_DOMAIN=${domainName}`);

    console.log('\n📋 Next Steps:');
    console.log('1. Wait 10-15 minutes for the distribution to deploy');
    console.log('2. Update your .env.development file with the CloudFront domain');
    console.log('3. Test icon access via CloudFront URL');
    console.log('4. Run: npm run test-icon-processing:dev');

    console.log('\n🔍 Check deployment status:');
    console.log(`aws cloudfront get-distribution --id ${distributionId}`);

    return {
      distributionId,
      domainName,
      cloudfrontUrl: `https://${domainName}`
    };

  } catch (error) {
    console.error('❌ Error creating CloudFront distribution:', error.message);

    if (error.message.includes('already exists')) {
      console.log('\n💡 A distribution with this caller reference may already exist.');
      console.log('Try running the script again in a few minutes.');
    }

    throw error;
  }
}

// Check distribution status
async function checkDistributionStatus(distributionId) {
  try {
    const command = new GetDistributionCommand({ Id: distributionId });
    const response = await cloudfrontClient.send(command);

    const status = response.Distribution.Status;
    const domainName = response.Distribution.DomainName;

    console.log(`\n📊 Distribution Status: ${status}`);
    console.log(`Domain: ${domainName}`);

    if (status === 'Deployed') {
      console.log('✅ Distribution is fully deployed and ready to use!');
    } else {
      console.log('⏳ Distribution is still deploying...');
    }

    return { status, domainName };

  } catch (error) {
    console.error('Error checking distribution status:', error.message);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    const result = await createCloudFrontDistribution();

    console.log('\n⏳ Waiting 30 seconds before checking status...');
    await new Promise(resolve => setTimeout(resolve, 30000));

    await checkDistributionStatus(result.distributionId);

  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

// Run the script
main();
