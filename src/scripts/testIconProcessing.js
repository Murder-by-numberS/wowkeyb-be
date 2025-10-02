import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../config/s3.js';
import Config from '../config/config.js';
import Icon from '../models/icon.js';

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(Config.databaseURI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Test processing a single icon
async function testSingleIcon() {
    const iconsDir = '/Users/loganborn/Downloads/blpconvert-1.0/wow_icons/interface/icons_png';

    try {
        // Get the first PNG file
        const files = fs.readdirSync(iconsDir)
            .filter(file => file.toLowerCase().endsWith('.png'))
            .slice(0, 1); // Just get the first file

        if (files.length === 0) {
            console.log('No PNG files found in directory');
            return;
        }

        const fileName = files[0];
        const filePath = path.join(iconsDir, fileName);

        console.log(`Testing with file: ${fileName}`);

        // Read file
        const fileContent = fs.readFileSync(filePath);
        console.log(`File size: ${fileContent.length} bytes`);

        // Test S3 upload
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

        console.log('Uploading to S3...');
        await s3Client.send(new PutObjectCommand(uploadParams));
        console.log('✓ Upload successful');

        // Generate CloudFront URL
        const cloudfrontDomain = Config.cloudfrontDomain || 'd1234567890.cloudfront.net';
        const cloudfrontUrl = `https://${cloudfrontDomain}/${s3Key}`;

        console.log(`S3 Key: ${s3Key}`);
        console.log(`CloudFront URL: ${cloudfrontUrl}`);

        // Test database save
        const iconData = {
            name: `Test ${fileName.replace('.png', '')}`,
            keywords: ['test', 'icon'],
            originalFileName: fileName,
            s3Path: s3Key,
            cloudfrontUrl: cloudfrontUrl,
            usageCount: 0
        };

        const icon = new Icon(iconData);
        await icon.save();
        console.log('✓ Database save successful');
        console.log('Icon ID:', icon._id);

    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Main execution
async function main() {
    try {
        await connectDB();
        await testSingleIcon();
    } catch (error) {
        console.error('Script failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
}

// Run the script
main();
