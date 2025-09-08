import mongoose from 'mongoose';
import Keybinding from '../models/keybinding.js';
import Config from '../config/config.js';

/**
 * Migration script to add deleted_at field to existing keybindings
 * This ensures all existing keybindings have deleted_at set to null
 */
async function migrateSoftDelete() {
    try {
        console.log('Starting soft delete migration...');

        // Connect to database
        await mongoose.connect(Config.databaseURI);
        console.log('Connected to database');

        // Find all keybindings that don't have deleted_at field
        const keybindingsWithoutDeletedAt = await Keybinding.find({
            deleted_at: { $exists: false }
        });

        console.log(`Found ${keybindingsWithoutDeletedAt.length} keybindings without deleted_at field`);

        if (keybindingsWithoutDeletedAt.length > 0) {
            // Update all keybindings to have deleted_at: null
            const result = await Keybinding.updateMany(
                { deleted_at: { $exists: false } },
                { $set: { deleted_at: null } }
            );

            console.log(`Updated ${result.modifiedCount} keybindings with deleted_at: null`);
        } else {
            console.log('All keybindings already have deleted_at field');
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
    migrateSoftDelete();
}

export default migrateSoftDelete;
