/**
 * Script to list all admin users
 * Usage: node src/scripts/listAdminUsers.js
 */

import mongoose from 'mongoose';
import User from '../models/user.js';
import config from '../config/config.js';

const ADMIN_ACCESS_LEVEL = 9;

async function listAdminUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.databaseURI);
    console.log('Connected to MongoDB\n');

    // Find all admin users
    const adminUsers = await User.find({ access_level: { $gte: ADMIN_ACCESS_LEVEL } })
      .select('username email access_level createdAt')
      .sort({ access_level: -1, createdAt: 1 });

    if (adminUsers.length === 0) {
      console.log('No admin users found.');
      console.log('\nTo make a user an admin, run:');
      console.log('  node src/scripts/setAdminUser.js <email>');
    } else {
      console.log(`Found ${adminUsers.length} admin user(s):\n`);
      console.log('─'.repeat(80));
      console.log(`${'Username'.padEnd(20)} ${'Email'.padEnd(35)} ${'Level'.padEnd(8)} Created`);
      console.log('─'.repeat(80));

      adminUsers.forEach(user => {
        const createdAt = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
        console.log(
          `${(user.username || 'N/A').padEnd(20)} ` +
          `${user.email.padEnd(35)} ` +
          `${String(user.access_level).padEnd(8)} ` +
          `${createdAt}`
        );
      });

      console.log('─'.repeat(80));
    }

    process.exit(0);
  } catch (error) {
    console.error('Error listing admin users:', error);
    process.exit(1);
  }
}

listAdminUsers();
