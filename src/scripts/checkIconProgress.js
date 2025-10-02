import mongoose from 'mongoose';
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

// Check progress of icon processing
async function checkProgress() {
    try {
        const totalIcons = await Icon.countDocuments();
        const iconsWithImages = await Icon.countDocuments({
            s3Path: { $exists: true, $ne: null }
        });
        const iconsWithCloudFront = await Icon.countDocuments({
            cloudfrontUrl: { $exists: true, $ne: null }
        });

        console.log('\n📊 Icon Processing Progress:');
        console.log(`Total icons in database: ${totalIcons}`);
        console.log(`Icons with S3 path: ${iconsWithImages}`);
        console.log(`Icons with CloudFront URL: ${iconsWithCloudFront}`);

        if (iconsWithImages > 0) {
            const percentage = Math.round((iconsWithImages / totalIcons) * 100);
            console.log(`Progress: ${percentage}%`);
        }

        // Show recent icons
        const recentIcons = await Icon.find({ s3Path: { $exists: true } })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name originalFileName s3Path');

        if (recentIcons.length > 0) {
            console.log('\n🔄 Recently processed icons:');
            recentIcons.forEach(icon => {
                console.log(`  • ${icon.name} (${icon.originalFileName})`);
            });
        }

    } catch (error) {
        console.error('Error checking progress:', error);
    }
}

// Main execution
async function main() {
    try {
        await connectDB();
        await checkProgress();
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
