import mongoose from 'mongoose';
import Keybinding from '../models/keybinding.js';
import Version from '../models/version.js';
import Config from '../config/config.js';

/**
 * Migration script to add version field to existing keybindings
 * This assigns the latest version to all existing keybindings
 */
async function migrateKeybindingsToVersions() {
    try {
        console.log('Starting keybindings to versions migration...');

        // Connect to database
        await mongoose.connect(Config.databaseURI);
        console.log('Connected to database');

        // Get the latest version
        const latestVersion = await Version.findOne().sort({ createdAt: -1 });
        if (!latestVersion) {
            console.error('No versions found. Please create a version first.');
            return;
        }

        console.log(`Using latest version: ${latestVersion.game_version} (${latestVersion._id})`);

        // Find all keybindings that don't have version field
        const keybindingsWithoutVersion = await Keybinding.find({
            version: { $exists: false }
        });

        console.log(`Found ${keybindingsWithoutVersion.length} keybindings without version field`);

        if (keybindingsWithoutVersion.length > 0) {
            // Update all keybindings to have the latest version
            const result = await Keybinding.updateMany(
                { version: { $exists: false } },
                { $set: { version: latestVersion._id } }
            );

            console.log(`Updated ${result.modifiedCount} keybindings with version: ${latestVersion.game_version}`);
        } else {
            console.log('All keybindings already have version field');
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from database');
    }
}

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    migrateKeybindingsToVersions();
}

export default migrateKeybindingsToVersions;
