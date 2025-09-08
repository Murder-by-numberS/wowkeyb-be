import mongoose from 'mongoose';
import Version from '../../../models/version.js';
import Config from '../../../config/config.js';

/**
 * Seed script to add initial versions data
 */
async function seedVersions() {
  try {
    console.log('Starting versions seed...');

    // Connect to database
    await mongoose.connect(Config.databaseURI);
    console.log('Connected to database');

    // Initial versions to seed
    const initialVersions = [
      { game_version: '11.1.7' },
      { game_version: '11.1.0' },
      { game_version: '11.0.5' },
      { game_version: '11.0.2' },
      { game_version: '11.0.0' }
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const versionData of initialVersions) {
      try {
        // Check if version already exists
        const existingVersion = await Version.findOne({ game_version: versionData.game_version });

        if (existingVersion) {
          console.log(`Version ${versionData.game_version} already exists, skipping...`);
          skippedCount++;
        } else {
          await Version.create(versionData);
          console.log(`Created version: ${versionData.game_version}`);
          createdCount++;
        }
      } catch (error) {
        console.error(`Error creating version ${versionData.game_version}:`, error.message);
      }
    }

    console.log(`\nSeed completed:`);
    console.log(`- Created: ${createdCount} versions`);
    console.log(`- Skipped: ${skippedCount} versions (already existed)`);

  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

// Run seed if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedVersions();
}

export default seedVersions;
