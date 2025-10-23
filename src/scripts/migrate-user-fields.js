import mongoose from 'mongoose';
import { User } from '../models/index.js';
import Logger from '../utils/logger.js';

/**
 * Migration script to handle the transition from camelCase to snake_case field names
 * This script will:
 * 1. Copy data from old field names to new field names
 * 2. Remove old field names after successful migration
 */

const migrateUserFields = async () => {
    try {
        Logger.info('Starting user field migration...');

        // Find users that might have old field names
        const usersWithOldFields = await User.find({
            $or: [
                { encryptedPassword: { $exists: true } },
                { passwordChangedAt: { $exists: true } },
                { accessLevel: { $exists: true } },
                { confirmCode: { $exists: true } },
                { resetCode: { $exists: true } },
                { resetPassword: { $exists: true } },
                { resetTime: { $exists: true } }
            ]
        });

        Logger.info(`Found ${usersWithOldFields.length} users with old field names`);

        for (const user of usersWithOldFields) {
            const updateFields = {};

            // Migrate encryptedPassword -> encrypted_password
            if (user.encryptedPassword && !user.encrypted_password) {
                updateFields.encrypted_password = user.encryptedPassword;
            }

            // Migrate passwordChangedAt -> password_changed_at
            if (user.passwordChangedAt && !user.password_changed_at) {
                updateFields.password_changed_at = user.passwordChangedAt;
            }

            // Migrate accessLevel -> access_level
            if (user.accessLevel && !user.access_level) {
                updateFields.access_level = user.accessLevel;
            }

            // Migrate confirmCode -> confirm_code
            if (user.confirmCode && !user.confirm_code) {
                updateFields.confirm_code = user.confirmCode;
            }

            // Migrate resetCode -> reset_code
            if (user.resetCode && !user.reset_code) {
                updateFields.reset_code = user.resetCode;
            }

            // Migrate resetPassword -> reset_password
            if (user.resetPassword !== undefined && user.reset_password === undefined) {
                updateFields.reset_password = user.resetPassword;
            }

            // Migrate resetTime -> reset_time
            if (user.resetTime && !user.reset_time) {
                updateFields.reset_time = user.resetTime;
            }

            if (Object.keys(updateFields).length > 0) {
                await User.updateOne({ _id: user._id }, updateFields);
                Logger.info(`Migrated fields for user ${user._id}: ${Object.keys(updateFields).join(', ')}`);
            }
        }

        Logger.info('User field migration completed successfully');
    } catch (error) {
        Logger.error('Error during user field migration:', error);
        throw error;
    }
};

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/wowkeyb';
    Logger.info(`Connecting to database: ${databaseUri.replace(/\/\/.*@/, '//***@')}`); // Hide credentials in log

    mongoose.connect(databaseUri)
        .then(() => {
            Logger.info('Connected to MongoDB');
            return migrateUserFields();
        })
        .then(() => {
            Logger.info('Migration completed');
            process.exit(0);
        })
        .catch((error) => {
            Logger.error('Migration failed:', error);
            process.exit(1);
        });
}

export default migrateUserFields;
