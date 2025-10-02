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

// Generate icon name from filename
function generateIconName(filename) {
    // Remove .png extension and convert underscores to spaces
    let name = filename.replace('.png', '');

    // Convert common patterns to more readable names
    name = name.replace(/_/g, ' ');

    // Capitalize first letter of each word
    name = name.replace(/\b\w/g, l => l.toUpperCase());

    // Handle special cases
    name = name.replace(/Ability /g, '');
    name = name.replace(/Boss /g, '');
    name = name.replace(/Creature /g, '');
    name = name.replace(/Deathknight/g, 'Death Knight');
    name = name.replace(/Demonhunter/g, 'Demon Hunter');

    return name;
}

// Generate keywords from filename
function generateKeywords(filename) {
    const keywords = [];
    const name = filename.toLowerCase().replace('.png', '');

    // Extract meaningful parts
    const parts = name.split('_');

    parts.forEach(part => {
        if (part.length > 2) {
            keywords.push(part);
            // Also add capitalized version
            keywords.push(part.charAt(0).toUpperCase() + part.slice(1));
        }
    });

    // Add class-specific keywords
    if (name.includes('deathknight') || name.includes('dk_')) {
        keywords.push('deathknight', 'Death Knight', 'dk');
    }
    if (name.includes('demonhunter') || name.includes('dh_')) {
        keywords.push('demonhunter', 'Demon Hunter', 'dh');
    }
    if (name.includes('druid') || name.includes('druid_')) {
        keywords.push('druid');
    }
    if (name.includes('hunter') || name.includes('hunter_')) {
        keywords.push('hunter');
    }
    if (name.includes('mage') || name.includes('mage_')) {
        keywords.push('mage');
    }
    if (name.includes('monk') || name.includes('monk_')) {
        keywords.push('monk');
    }
    if (name.includes('paladin') || name.includes('paladin_')) {
        keywords.push('paladin');
    }
    if (name.includes('priest') || name.includes('priest_')) {
        keywords.push('priest');
    }
    if (name.includes('rogue') || name.includes('rogue_')) {
        keywords.push('rogue');
    }
    if (name.includes('shaman') || name.includes('shaman_')) {
        keywords.push('shaman');
    }
    if (name.includes('warlock') || name.includes('warlock_')) {
        keywords.push('warlock');
    }
    if (name.includes('warrior') || name.includes('warrior_')) {
        keywords.push('warrior');
    }

    // Remove duplicates
    return [...new Set(keywords)];
}

// Upload image to S3
async function uploadImageToS3(filePath, fileName) {
    try {
        const fileContent = fs.readFileSync(filePath);
        const s3Key = `icons/${fileName}`;

        const uploadParams = {
            Bucket: Config.bucket,
            Key: s3Key,
            Body: fileContent,
            ContentType: 'image/png',
            CacheControl: 'public, max-age=31536000', // Cache for 1 year
            Metadata: {
                'original-filename': fileName
            }
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

        // Generate CloudFront URL
        const cloudfrontDomain = Config.cloudfrontDomain || 'd1234567890.cloudfront.net';
        const cloudfrontUrl = `https://${cloudfrontDomain}/${s3Key}`;

        return {
            s3Path: s3Key,
            cloudfrontUrl: cloudfrontUrl
        };
    } catch (error) {
        console.error(`Error uploading ${fileName} to S3:`, error);
        throw error;
    }
}

// Process a single icon file
async function processIconFile(filePath, fileName) {
    try {
        // Check if icon already exists
        const existingIcon = await Icon.findByOriginalFileName(fileName);
        if (existingIcon) {
            console.log(`Icon ${fileName} already exists, skipping...`);
            return;
        }

        // Upload to S3
        const uploadResult = await uploadImageToS3(filePath, fileName);

        // Generate icon data
        const iconName = generateIconName(fileName);
        const keywords = generateKeywords(fileName);

        // Create icon document
        const iconData = {
            name: iconName,
            keywords: keywords,
            originalFileName: fileName,
            s3Path: uploadResult.s3Path,
            cloudfrontUrl: uploadResult.cloudfrontUrl,
            usageCount: 0
        };

        const icon = new Icon(iconData);
        await icon.save();

        console.log(`✓ Processed ${fileName} -> ${iconName}`);

    } catch (error) {
        console.error(`Error processing ${fileName}:`, error);
    }
}

// Main function to process all icons
async function processAllIcons() {
    const iconsDir = '/Users/loganborn/Downloads/blpconvert-1.0/wow_icons/interface/icons_png';

    try {
        // Read all PNG files from the directory
        const files = fs.readdirSync(iconsDir)
            .filter(file => file.toLowerCase().endsWith('.png'))
            .sort();

        console.log(`Found ${files.length} icon files to process`);

        // Process files in batches to avoid overwhelming the system
        const batchSize = 10;
        for (let i = 0; i < files.length; i += batchSize) {
            const batch = files.slice(i, i + batchSize);

            console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(files.length / batchSize)} (${batch.length} files)`);

            // Process batch concurrently
            await Promise.all(
                batch.map(async (file) => {
                    const filePath = path.join(iconsDir, file);
                    await processIconFile(filePath, file);
                })
            );

            // Small delay between batches
            if (i + batchSize < files.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('✓ All icons processed successfully!');

    } catch (error) {
        console.error('Error processing icons:', error);
    }
}

// Main execution
async function main() {
    try {
        await connectDB();
        await processAllIcons();
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
