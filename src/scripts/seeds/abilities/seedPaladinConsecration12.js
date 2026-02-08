/**
 * Paladin Consecration & Righteous Judgment - v12.0.0 seed
 *
 * Ensures:
 *   1. Consecration exists as a class ability (all specs) in v12.0.0
 *   2. Righteous Judgment talent exists as a class ability in v12.0.0
 *
 * Safe to run multiple times - checks for duplicates before inserting.
 *
 * Usage:
 *   node --env-file .env.development src/scripts/seeds/abilities/seedPaladinConsecration12.js
 *   node --env-file .env.staging    src/scripts/seeds/abilities/seedPaladinConsecration12.js
 *   node --env-file .env.production src/scripts/seeds/abilities/seedPaladinConsecration12.js
 */

import mongoose from 'mongoose';
import Ability from '../../../models/ability.js';
import Version from '../../../models/version.js';
import Config from '../../../config/config.js';

const ABILITIES = [
  {
    name: 'Consecration',
    spell_id: '26573',
    description: 'Consecrates the land beneath you, causing Holy damage over 12 sec to enemies who enter the area.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_innerfire.jpg',
    class: 'paladin',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 6,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  }
];

async function seed() {
  try {
    await mongoose.connect(Config.databaseURI);
    console.log('Connected to MongoDB');

    // Find version 12.0.0
    const version = await Version.findOne({ game_version: '12.0.0' });
    if (!version) {
      console.error('Version 12.0.0 not found. Run the Midnight migration first.');
      process.exit(1);
    }

    console.log(`Found version 12.0.0 (ID: ${version._id})\n`);

    let created = 0;
    let skipped = 0;

    for (const ability of ABILITIES) {
      // Check if ability already exists in this version
      const existing = await Ability.findOne({
        name: ability.name,
        class: ability.class,
        game_version: version._id,
        includeInactive: true
      });

      if (existing) {
        // Ensure it's a class ability (spec: null) and active
        if (existing.spec !== null || existing.ability_type !== 'class' || !existing.is_active) {
          existing.spec = null;
          existing.ability_type = 'class';
          existing.is_active = true;
          existing.description = ability.description;
          await existing.save();
          console.log(`✅ Updated "${ability.name}" → class ability, active`);
          created++;
        } else {
          console.log(`⏭️  "${ability.name}" already exists as class ability – skipped`);
          skipped++;
        }
      } else {
        await Ability.create({
          ...ability,
          game_version: version._id
        });
        console.log(`✅ Created "${ability.name}" as class ability`);
        created++;
      }
    }

    console.log(`\nDone. Created/updated: ${created}, Skipped: ${skipped}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seed();
