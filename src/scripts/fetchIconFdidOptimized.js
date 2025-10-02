import mongoose from 'mongoose';
import fetch from 'node-fetch';
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

// Function to extract fdid from Wago Tools search result
function extractFdidFromResponse(htmlContent) {
    try {
        // Look for the data-page attribute in the HTML
        const dataPageMatch = htmlContent.match(/data-page="([^"]+)"/);
        if (!dataPageMatch) {
            return null;
        }

        // Decode the JSON data
        const jsonData = dataPageMatch[1]
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');

        const pageData = JSON.parse(jsonData);

        // Extract fdid from the files data
        if (pageData.props && pageData.props.files && pageData.props.files.data && pageData.props.files.data.length > 0) {
            const firstFile = pageData.props.files.data[0];
            return firstFile.fdid || null;
        }

        return null;
    } catch (error) {
        console.error('Error parsing Wago Tools response:', error);
        return null;
    }
}

// Function to fetch fdid from Wago Tools with retry logic
async function fetchFdidFromWago(iconName, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const searchUrl = `https://wago.tools/files?search=${encodeURIComponent(iconName)}`;

            const response = await fetch(searchUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                timeout: 10000 // 10 second timeout
            });

            if (!response.ok) {
                if (response.status === 429) { // Rate limited
                    console.log(`Rate limited for ${iconName}, waiting ${attempt * 2} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, attempt * 2000));
                    continue;
                }
                console.error(`HTTP error! status: ${response.status} for ${iconName}`);
                if (attempt === retries) return null;
                continue;
            }

            const htmlContent = await response.text();
            const fdid = extractFdidFromResponse(htmlContent);

            if (fdid) {
                console.log(`Found fdid ${fdid} for ${iconName}`);
                return fdid;
            } else {
                console.log(`No fdid found for ${iconName}`);
                return null;
            }

        } catch (error) {
            console.error(`Error fetching fdid for ${iconName} (attempt ${attempt}):`, error.message);
            if (attempt === retries) return null;

            // Exponential backoff on error
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
    }
    return null;
}

// Function to remove file extension from filename
function removeExtension(filename) {
    if (!filename) return '';
    return filename.replace(/\.[^/.]+$/, '');
}

// Function to process icons in batches with concurrency control
async function processBatch(icons, batchSize = 5) {
    const results = [];

    for (let i = 0; i < icons.length; i += batchSize) {
        const batch = icons.slice(i, i + batchSize);
        console.log(`\nProcessing batch ${Math.floor(i / batchSize) + 1} (${batch.length} icons)`);

        // Process batch concurrently
        const batchPromises = batch.map(async (icon) => {
            const iconName = removeExtension(icon.originalFileName);

            if (!iconName) {
                console.log(`Skipping icon ${icon._id} - no originalFileName`);
                return { icon, success: false, skipped: true };
            }

            console.log(`Fetching fdid for: ${icon.name} (${iconName})`);
            const fdid = await fetchFdidFromWago(iconName);

            if (fdid) {
                try {
                    icon.fdid = parseInt(fdid);
                    await icon.save();
                    console.log(`✓ Updated ${icon.name} with fdid: ${fdid}`);
                    return { icon, success: true, fdid };
                } catch (error) {
                    console.error(`Error saving ${icon.name}:`, error);
                    return { icon, success: false, error };
                }
            } else {
                console.log(`✗ No fdid found for ${icon.name}`);
                return { icon, success: false, notFound: true };
            }
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);

        // Small delay between batches to be respectful
        if (i + batchSize < icons.length) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    return results;
}

// Main function to update all icons with fdid
async function updateIconsWithFdidOptimized(startFromIndex = 0, batchSize = 5) {
    try {
        await connectDB();

        // Get all icons that don't have fdid yet
        const icons = await Icon.find({ fdid: { $exists: false } });
        console.log(`Found ${icons.length} icons without fdid`);

        if (startFromIndex > 0) {
            console.log(`Resuming from index ${startFromIndex}`);
        }

        const iconsToProcess = icons.slice(startFromIndex);
        console.log(`Processing ${iconsToProcess.length} icons with batch size ${batchSize}`);

        let successCount = 0;
        let errorCount = 0;
        let skippedCount = 0;

        // Process in batches
        const results = await processBatch(iconsToProcess, batchSize);

        // Count results
        results.forEach(result => {
            if (result.success) {
                successCount++;
            } else if (result.skipped) {
                skippedCount++;
            } else {
                errorCount++;
            }
        });

        console.log(`\n=== Final Summary ===`);
        console.log(`Total icons processed: ${results.length}`);
        console.log(`Successfully updated: ${successCount}`);
        console.log(`Failed to find fdid: ${errorCount}`);
        console.log(`Skipped (no filename): ${skippedCount}`);

    } catch (error) {
        console.error('Error in updateIconsWithFdidOptimized:', error);
        throw error;
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
    // Check for command line arguments
    const startFromIndex = process.argv[2] ? parseInt(process.argv[2]) : 0;
    const batchSize = process.argv[3] ? parseInt(process.argv[3]) : 5;

    console.log(`Starting optimized fdid fetch script...`);
    console.log(`Start index: ${startFromIndex}, Batch size: ${batchSize}`);

    updateIconsWithFdidOptimized(startFromIndex, batchSize)
        .then(() => {
            console.log('Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Script failed:', error);
            process.exit(1);
        });
}

export { updateIconsWithFdidOptimized, fetchFdidFromWago, removeExtension };
