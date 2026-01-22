/**
 * Script to set a user as an admin
 * Usage: node src/scripts/setAdminUser.js <email>
 */

import mongoose from 'mongoose';
import User from '../models/user.js';
import config from '../config/config.js';

const ADMIN_ACCESS_LEVEL = 9;

async function setAdminUser(email) {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error(`User with email "${email}" not found`);
      process.exit(1);
    }

    // Check if already admin
    if (user.access_level >= ADMIN_ACCESS_LEVEL) {
      console.log(`User "${user.username}" (${email}) is already an admin (access_level: ${user.access_level})`);
      process.exit(0);
    }

    // Update to admin
    const previousLevel = user.access_level;
    user.access_level = ADMIN_ACCESS_LEVEL;
    await user.save();

    console.log(`✅ Successfully set user "${user.username}" (${email}) as admin`);
    console.log(`   Previous access_level: ${previousLevel}`);
    console.log(`   New access_level: ${ADMIN_ACCESS_LEVEL}`);

    process.exit(0);
  } catch (error) {
    console.error('Error setting admin user:', error);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Usage: node src/scripts/setAdminUser.js <email>');
  console.error('Example: node src/scripts/setAdminUser.js admin@example.com');
  process.exit(1);
}

setAdminUser(email);
