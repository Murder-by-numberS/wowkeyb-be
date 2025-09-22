import mongoose from 'mongoose';
import Ability from '../models/ability.js';
import Config from '../config/config.js';

async function updateDemonHunterAbilityIcons() {
  try {
    // Connect to MongoDB
    await mongoose.connect(Config.databaseURI);
    console.log('Connected to MongoDB');

    // Define the abilities and their new icon URLs
    const abilityUpdates = [
      {
        name: 'Disrupt',
        newIcon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_consumemagic.jpg'
      },
      {
        name: 'Consume Magic',
        newIcon: 'https://wow.zamimg.com/images/wow/icons/large/spell_misc_zandalari_council_soulswap.jpg'
      },
      {
        name: 'Sigil of Spite',
        newIcon: 'https://wow.zamimg.com/images/wow/icons/large/inv_ability_demonhunter_elysiandecree.jpg'
      }
    ];

    for (const update of abilityUpdates) {
      console.log(`\n=== Updating ${update.name} ===`);

      // Find all versions of this ability for Demon Hunter class
      const abilities = await Ability.find({
        name: update.name,
        class: 'demonhunter',
        ability_type: 'class'
      });

      if (abilities.length === 0) {
        console.log(`${update.name} ability not found`);
        continue;
      }

      console.log(`Found ${abilities.length} version(s) of ${update.name}:`);

      for (const ability of abilities) {
        console.log(`  - Version: ${ability.game_version}, Current Icon: ${ability.icon}`);
      }

      // Update all versions
      const updateResult = await Ability.updateMany(
        {
          name: update.name,
          class: 'demonhunter',
          ability_type: 'class'
        },
        { icon: update.newIcon }
      );

      console.log(`Updated ${updateResult.modifiedCount} version(s) of ${update.name}`);
      console.log(`New icon: ${update.newIcon}`);
    }

    console.log('\n=== Summary ===');
    console.log('All Demon Hunter ability icon updates completed!');

    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error updating Demon Hunter ability icons:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the script
updateDemonHunterAbilityIcons();
