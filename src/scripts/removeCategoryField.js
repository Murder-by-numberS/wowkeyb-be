import mongoose from 'mongoose';
import Config from '../config/config.js';
import Icon from '../models/icon.js';

/**
 * Migration script to remove category field from all icon documents
 */
async function removeCategoryField() {
    try {
        console.log('Starting migration to remove category field from icons...');
        console.log('Connecting to database...');
        await mongoose.connect(Config.databaseURI);
        console.log('Connected.');

        // Count documents with category field
        const countWithCategory = await Icon.countDocuments({ category: { $exists: true } });
        console.log(`Found ${countWithCategory} icons with category field`);

        if (countWithCategory === 0) {
            console.log('No icons have category field, migration not needed');
            return;
        }

        // Remove category field from all documents
        const result = await Icon.updateMany(
            { category: { $exists: true } },
            { $unset: { category: "" } }
        );

        console.log(`Successfully removed category field from ${result.modifiedCount} icons`);

        // Verify the field has been removed
        const remainingCount = await Icon.countDocuments({ category: { $exists: true } });
        console.log(`Remaining icons with category field: ${remainingCount}`);

        if (remainingCount === 0) {
            console.log('✅ Migration completed successfully - all category fields removed');
        } else {
            console.log('❌ Migration incomplete - some category fields remain');
        }

    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

// Run the migration
removeCategoryField();
