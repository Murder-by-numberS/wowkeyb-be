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

// Function to fetch fdid from Wago Tools
async function fetchFdidFromWago(iconName) {
    try {
        const searchUrl = `https://wago.tools/files?search=${encodeURIComponent(iconName)}`;
        console.log(`Fetching fdid for: ${iconName} - ${searchUrl}`);

        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return null;
        }

        const htmlContent = await response.text();
        const fdid = extractFdidFromResponse(htmlContent);

        if (fdid) {
            console.log(`Found fdid ${fdid} for ${iconName}`);
        } else {
            console.log(`No fdid found for ${iconName}`);
        }

        return fdid;
    } catch (error) {
        console.error(`Error fetching fdid for ${iconName}:`, error);
        return null;
    }
}

// Function to remove file extension from filename
function removeExtension(filename) {
    if (!filename) return '';
    return filename.replace(/\.[^/.]+$/, '');
}

// Main function to update all icons with fdid
async function updateIconsWithFdid(startFromIndex = 0) {
    try {
        await connectDB();

        // Get all icons that don't have fdid yet
        const icons = await Icon.find({ fdid: { $exists: false } });
        console.log(`Found ${icons.length} icons without fdid`);

        if (startFromIndex > 0) {
            console.log(`Resuming from index ${startFromIndex}`);
        }

        let successCount = 0;
        let errorCount = 0;
        let skippedCount = 0;

        for (let i = startFromIndex; i < icons.length; i++) {
            try {
                const icon = icons[i];
                const iconName = removeExtension(icon.originalFileName);

                if (!iconName) {
                    console.log(`Skipping icon ${icon._id} - no originalFileName`);
                    skippedCount++;
                    continue;
                }

                console.log(`\nProcessing ${i + 1}/${icons.length}: ${icon.name} (${iconName})`);

                const fdid = await fetchFdidFromWago(iconName);

                if (fdid) {
                    icon.fdid = parseInt(fdid);
                    await icon.save();
                    successCount++;
                    console.log(`✓ Updated ${icon.name} with fdid: ${fdid}`);
                } else {
                    errorCount++;
                    console.log(`✗ No fdid found for ${icon.name}`);
                }

                // Log progress every 50 icons
                if ((i + 1) % 50 === 0) {
                    console.log(`\n--- Progress Update ---`);
                    console.log(`Processed: ${i + 1}/${icons.length}`);
                    console.log(`Success: ${successCount}, Errors: ${errorCount}, Skipped: ${skippedCount}`);
                    console.log(`Progress: ${((i + 1) / icons.length * 100).toFixed(1)}%`);
                }

                // Add a small delay to be respectful to the API
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.error(`Error processing icon at index ${i}:`, error);
                errorCount++;

                // Continue processing other icons even if one fails
                continue;
            }
        }

        console.log(`\n=== Final Summary ===`);
        console.log(`Total icons processed: ${icons.length}`);
        console.log(`Successfully updated: ${successCount}`);
        console.log(`Failed to find fdid: ${errorCount}`);
        console.log(`Skipped (no filename): ${skippedCount}`);

    } catch (error) {
        console.error('Error in updateIconsWithFdid:', error);
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

    console.log(`Starting fdid fetch script...`);
    if (startFromIndex > 0) {
        console.log(`Will resume from index: ${startFromIndex}`);
    }

    updateIconsWithFdid(startFromIndex)
        .then(() => {
            console.log('Script completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Script failed:', error);
            process.exit(1);
        });
}

export { updateIconsWithFdid, fetchFdidFromWago, removeExtension };
