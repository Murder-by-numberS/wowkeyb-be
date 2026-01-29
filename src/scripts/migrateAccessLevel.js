/**
 * Migration script to rename accessLevel to access_level
 * This fixes the field name to match the schema (snake_case)
 * 
 * Usage: node --env-file .env.development src/scripts/migrateAccessLevel.js
 */

import mongoose from 'mongoose';
import config from '../config/config.js';

async function migrateAccessLevel() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.databaseURI);
    console.log('Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Find all users with accessLevel field (camelCase)
    const usersWithOldField = await usersCollection.find({ 
      accessLevel: { $exists: true } 
    }).toArray();

    console.log(`Found ${usersWithOldField.length} user(s) with accessLevel (camelCase) field\n`);

    if (usersWithOldField.length === 0) {
      console.log('No migration needed - all users already use access_level (snake_case)');
      process.exit(0);
    }

    // Migrate each user
    for (const user of usersWithOldField) {
      const result = await usersCollection.updateOne(
        { _id: user._id },
        { 
          $set: { access_level: user.accessLevel },
          $unset: { accessLevel: '' }
        }
      );
      
      console.log(`Migrated user ${user.email}: accessLevel ${user.accessLevel} -> access_level ${user.accessLevel}`);
    }

    console.log(`\n✓ Migration complete! ${usersWithOldField.length} user(s) updated.`);
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

migrateAccessLevel();
