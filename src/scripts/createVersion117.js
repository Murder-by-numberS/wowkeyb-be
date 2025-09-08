import mongoose from 'mongoose';
import Version from '../models/version.js';
import Config from '../config/config.js';

/**
 * Script to create version 11.1.7
 */
async function createVersion117() {
  try {
    console.log('Creating version 11.1.7...');

    // Connect to database
    await mongoose.connect(Config.databaseURI);
    console.log('Connected to database');

    // Check if version already exists
    const existingVersion = await Version.findOne({ game_version: '11.1.7' });

    if (existingVersion) {
      console.log('Version 11.1.7 already exists');
    } else {
      const newVersion = await Version.create({ game_version: '11.1.7' });
      console.log(`Created version: ${newVersion.game_version} (${newVersion._id})`);
    }

    console.log('Script completed successfully');
  } catch (error) {
    console.error('Script failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

// Run script if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createVersion117();
}

export default createVersion117;
