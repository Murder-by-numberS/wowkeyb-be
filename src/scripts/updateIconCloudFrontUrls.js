import mongoose from 'mongoose';
import config from '../config/config.js';

// Icon schema
const iconSchema = new mongoose.Schema({
    name: String,
    keywords: [String],
    usageCount: { type: Number, default: 0 },
    s3Path: String,
    cloudfrontUrl: String,
    originalFileName: String
}, { timestamps: true });

const Icon = mongoose.model('Icon', iconSchema);

async function updateIconCloudFrontUrls() {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.databaseURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // The correct CloudFront domain from our distribution
        const correctCloudFrontDomain = 'd10lzq0xgj2wa0.cloudfront.net';

        // Find all icons that have the wrong CloudFront URL
        const iconsWithWrongUrl = await Icon.find({
            cloudfrontUrl: { $regex: /d1234567890\.cloudfront\.net/ }
        });

        console.log(`Found ${iconsWithWrongUrl.length} icons with incorrect CloudFront URLs`);

        if (iconsWithWrongUrl.length === 0) {
            console.log('No icons need updating. All CloudFront URLs are correct.');
            return;
        }

        // Update each icon with the correct CloudFront URL
        let updatedCount = 0;
        for (const icon of iconsWithWrongUrl) {
            if (icon.s3Path) {
                const correctCloudFrontUrl = `https://${correctCloudFrontDomain}/${icon.s3Path}`;
                await Icon.updateOne(
                    { _id: icon._id },
                    { $set: { cloudfrontUrl: correctCloudFrontUrl } }
                );
                updatedCount++;
                console.log(`Updated icon: ${icon.name} -> ${correctCloudFrontUrl}`);
            }
        }

        console.log(`\n✅ Successfully updated ${updatedCount} icons with correct CloudFront URLs`);

        // Also update icons that don't have cloudfrontUrl but have s3Path
        const iconsWithoutCloudFront = await Icon.find({
            s3Path: { $exists: true, $ne: null },
            cloudfrontUrl: { $exists: false }
        });

        console.log(`\nFound ${iconsWithoutCloudFront.length} icons without CloudFront URLs`);

        let addedCount = 0;
        for (const icon of iconsWithoutCloudFront) {
            const cloudfrontUrl = `https://${correctCloudFrontDomain}/${icon.s3Path}`;
            await Icon.updateOne(
                { _id: icon._id },
                { $set: { cloudfrontUrl: cloudfrontUrl } }
            );
            addedCount++;
            console.log(`Added CloudFront URL to icon: ${icon.name} -> ${cloudfrontUrl}`);
        }

        console.log(`\n✅ Successfully added CloudFront URLs to ${addedCount} icons`);

    } catch (error) {
        console.error('Error updating icon CloudFront URLs:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the update
updateIconCloudFrontUrls();
