import { S3Client, CreateBucketCommand, PutBucketCorsCommand, PutBucketPolicyCommand, PutPublicAccessBlockCommand } from '@aws-sdk/client-s3';
import s3Client from '../config/s3.js';
import Config from '../config/config.js';

// Create S3 bucket for icon storage
async function createIconBucket() {
  try {
    const bucketName = Config.bucket.toLowerCase().replace(/_/g, '-'); // S3 bucket names must be lowercase and use hyphens

    console.log(`Creating S3 bucket: ${bucketName}`);
    console.log(`Original bucket name from config: ${Config.bucket}`);

    if (bucketName !== Config.bucket) {
      console.log(`⚠️  Warning: Bucket name converted to lowercase and underscores replaced with hyphens for S3 compatibility`);
    }

    // Create the bucket
    const createBucketParams = {
      Bucket: bucketName
    };

    // Only add LocationConstraint if not us-east-1
    if (Config.region !== 'us-east-1') {
      createBucketParams.CreateBucketConfiguration = {
        LocationConstraint: Config.region
      };
    }

    await s3Client.send(new CreateBucketCommand(createBucketParams));
    console.log('✓ Bucket created successfully');

    // Disable block public access to allow public read policy
    const publicAccessBlockParams = {
      Bucket: bucketName,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        BlockPublicPolicy: false,
        IgnorePublicAcls: false,
        RestrictPublicBuckets: false
      }
    };

    await s3Client.send(new PutPublicAccessBlockCommand(publicAccessBlockParams));
    console.log('✓ Public access block settings disabled');

    // Set up CORS configuration for web access
    const corsParams = {
      Bucket: bucketName,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'HEAD'],
            AllowedOrigins: ['*'],
            ExposeHeaders: ['ETag'],
            MaxAgeSeconds: 3000
          }
        ]
      }
    };

    await s3Client.send(new PutBucketCorsCommand(corsParams));
    console.log('✓ CORS configuration set');

    // Set up bucket policy for public read access
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${bucketName}/icons/*`
        }
      ]
    };

    const policyParams = {
      Bucket: bucketName,
      Policy: JSON.stringify(bucketPolicy)
    };

    await s3Client.send(new PutBucketPolicyCommand(policyParams));
    console.log('✓ Public read policy set for icons/ folder');

    console.log('\n🎉 S3 bucket setup complete!');
    console.log(`Bucket: ${bucketName}`);
    console.log(`Region: ${Config.region}`);
    console.log('\n⚠️  Important: Update your .env.development file:');
    console.log(`AWS_S3_BUCKET_NAME=${bucketName}`);
    console.log('\nNext steps:');
    console.log('1. Create a CloudFront distribution pointing to this bucket');
    console.log('2. Add the CloudFront domain to your .env.development file as CLOUDFRONT_DOMAIN');
    console.log('3. Run: npm run test-icon-processing:dev');

  } catch (error) {
    if (error.name === 'BucketAlreadyOwnedByYou') {
      console.log('✓ Bucket already exists and is owned by you');
    } else if (error.name === 'BucketAlreadyExists') {
      console.log('❌ Bucket already exists but is owned by someone else');
      console.log('Please choose a different bucket name');
    } else {
      console.error('❌ Error creating bucket:', error.message);

      // Provide helpful suggestions for common bucket name issues
      if (error.message.includes('not valid')) {
        console.log('\n💡 S3 bucket name requirements:');
        console.log('- 3-63 characters long');
        console.log('- Lowercase letters, numbers, dots, and hyphens only');
        console.log('- Cannot start or end with a dot or hyphen');
        console.log('- Cannot contain consecutive dots');
        console.log('- Suggested names:');
        console.log('  • wowkeyb-dev-images');
        console.log('  • wowkeyb-dev-icons');
        console.log('  • wowkeyb-images-dev');
      }
    }
  }
}

// Run the script
createIconBucket();
