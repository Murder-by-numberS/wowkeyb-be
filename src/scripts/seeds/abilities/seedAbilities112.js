import mongoose from 'mongoose';
import Ability from '../../../models/ability.js';
import Version from '../../../models/version.js';
import Config from '../../../config/config.js';

/**
 * Seed script for version 11.2 abilities
 * This script handles the specific changes from 11.1.7 to 11.2
 */

async function seedAbilities112() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(Config.databaseURI);
    console.log('Connected.');

    // Find version 11.2.0
    const version112 = await Version.findOne({ game_version: '11.2.0' });
    if (!version112) {
      console.error('Version 11.2.0 not found! Please create it first.');
      return;
    }

    // Find version 11.1.7 to copy abilities from
    const version117 = await Version.findOne({ game_version: '11.1.7' });
    if (!version117) {
      console.error('Version 11.1.7 not found! Please seed it first.');
      return;
    }

    console.log('Copying abilities from 11.1.7 to 11.2.0...');

    // Copy all abilities from 11.1.7 to 11.2.0
    const abilities117 = await Ability.find({ game_version: version117._id });
    console.log(`Found ${abilities117.length} abilities in version 11.1.7`);

    // Delete any existing abilities for 11.2.0
    await Ability.deleteMany({ game_version: version112._id });
    console.log('Deleted existing 11.2.0 abilities');

    // Copy abilities to 11.2 with modifications
    let created = 0;
    let modified = 0;
    let removed = 0;

    for (const ability of abilities117) {
      // Skip abilities removed in 11.2
      if ((ability.class === 'deathknight' && ability.name === 'Abomination Limb') ||
        (ability.class === 'warrior' && ability.name === 'Spell Block')) {
        console.log(`Removed: ${ability.name} (${ability.class})`);
        removed++;
        continue;
      }

      // Create ability for 11.2.0
      const abilityData = {
        ...ability.toObject(),
        _id: undefined, // Let MongoDB generate new ID
        game_version: version112._id,
        createdAt: undefined,
        updatedAt: undefined
      };

      // Apply specific changes for 11.2.0
      if (ability.class === 'deathknight' && ability.name === 'Anti-Magic Zone') {
        abilityData.description = 'Places an Anti-Magic Zone for 6 seconds, reducing the magic damage taken by party or raid members by 15%. 4 minute cooldown.';
        abilityData.cooldown = 240; // 4 minutes
        console.log(`Modified: ${ability.name} - Updated description and cooldown`);
        modified++;
      } else if (ability.class === 'deathknight' && ability.name === 'Death Grip') {
        abilityData.cooldown = 15; // Reduced from 25 seconds
        console.log(`Modified: ${ability.name} - Reduced cooldown to 15 seconds`);
        modified++;
      }

      await Ability.create(abilityData);
      created++;
    }

    console.log(`\nSeeding completed for version 11.2.0:`);
    console.log(`- Created: ${created} abilities`);
    console.log(`- Modified: ${modified} abilities`);
    console.log(`- Removed: ${removed} abilities`);

  } catch (e) {
    console.error('Error:', e);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedAbilities112();
}

export default seedAbilities112;
