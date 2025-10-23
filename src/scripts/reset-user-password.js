import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../models/index.js';
import Logger from '../utils/logger.js';

const resetUserPassword = async (email, newPassword) => {
    try {
        Logger.info(`Resetting password for user: ${email}`);

        // Hash the new password
        const saltRounds = 10;
        const passwordSalt = await bcrypt.genSalt(saltRounds);
        const encrypted_password = await bcrypt.hash(newPassword, passwordSalt);

        // Update the user with the new password
        const result = await User.updateOne(
            { email: email },
            {
                encrypted_password: encrypted_password,
                password_changed_at: new Date()
            }
        );

        if (result.matchedCount === 0) {
            Logger.error(`User not found: ${email}`);
            return false;
        }

        if (result.modifiedCount === 0) {
            Logger.error(`Failed to update password for user: ${email}`);
            return false;
        }

        Logger.info(`Password reset successfully for user: ${email}`);
        return true;
    } catch (error) {
        Logger.error('Error resetting password:', error);
        throw error;
    }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const email = process.argv[2] || 'lcborn4@gmail.com';
    const password = process.argv[3] || 'Test12345@';

    const databaseUri = process.env.DATABASE_URI;
    Logger.info(`Connecting to database...`);

    mongoose.connect(databaseUri)
        .then(() => {
            Logger.info('Connected to MongoDB');
            return resetUserPassword(email, password);
        })
        .then((success) => {
            if (success) {
                Logger.info(`Password reset completed for ${email}`);
                Logger.info(`New password: ${password}`);
            } else {
                Logger.error('Password reset failed');
            }
            process.exit(success ? 0 : 1);
        })
        .catch((error) => {
            Logger.error('Password reset failed:', error);
            process.exit(1);
        });
}

export default resetUserPassword;
