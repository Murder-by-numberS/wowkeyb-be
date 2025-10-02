import fs from 'fs';
import path from 'path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../config/s3.js';
import Config from '../config/config.js';

// Test basic file operations without database
async function testBasicOperations() {
    const iconsDir = '/Users/loganborn/Downloads/blpconvert-1.0/wow_icons/interface/icons_png';

    try {
        console.log('Testing basic operations...');

        // Check if directory exists
        if (!fs.existsSync(iconsDir)) {
            console.error(`Directory not found: ${iconsDir}`);
            return;
        }

        console.log('✓ Directory exists');

        // Get the first PNG file
        const files = fs.readdirSync(iconsDir)
            .filter(file => file.toLowerCase().endsWith('.png'))
            .slice(0, 1);

        if (files.length === 0) {
            console.log('No PNG files found in directory');
            return;
        }

        const fileName = files[0];
        const filePath = path.join(iconsDir, fileName);

        console.log(`✓ Found test file: ${fileName}`);

        // Read file
        const fileContent = fs.readFileSync(filePath);
        console.log(`✓ File read successful, size: ${fileContent.length} bytes`);

        // Check AWS config
        console.log('AWS Config:');
        console.log(`- Region: ${Config.region}`);
        console.log(`- Bucket: ${Config.bucket}`);
        console.log(`- CloudFront Domain: ${Config.cloudfrontDomain || 'Not set'}`);

        if (!Config.bucket) {
            console.error('❌ AWS_S3_BUCKET_NAME environment variable not set');
            return;
        }

        if (!Config.accessKey || !Config.secretAccessKey) {
            console.error('❌ AWS credentials not set');
            return;
        }

        console.log('✓ AWS configuration looks good');

        // Test S3 upload (dry run - just prepare the command)
        const s3Key = `icons/test/${fileName}`;
        const uploadParams = {
            Bucket: Config.bucket,
            Key: s3Key,
            Body: fileContent,
            ContentType: 'image/png',
            CacheControl: 'public, max-age=31536000',
            Metadata: {
                'original-filename': fileName
            }
        };

        console.log(`✓ S3 upload parameters prepared for key: ${s3Key}`);

        // Generate CloudFront URL
        const cloudfrontDomain = Config.cloudfrontDomain || 'd1234567890.cloudfront.net';
        const cloudfrontUrl = `https://${cloudfrontDomain}/${s3Key}`;

        console.log(`✓ CloudFront URL would be: ${cloudfrontUrl}`);

        console.log('\n🎉 All basic operations successful!');
        console.log('\nTo test actual S3 upload, run:');
        console.log('node src/scripts/testIconProcessing.js');
        console.log('\n(Note: Make sure DATABASE_URI environment variable is set)');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the test
testBasicOperations();
