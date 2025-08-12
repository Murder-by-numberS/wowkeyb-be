// src/scripts/seeds/abilities/seedDemonHunterAbilities.js
import mongoose from 'mongoose';
import Ability from '../../../../models/ability.js';
import Version from '../../../../models/version.js';
import Config from '../../../../config/config.js';

const coreAbilities = [
  {
    name: 'Glaive Throw',
    spell_id: 148567,
    description: 'Throw your glaive at the target, dealing damage and slowing them.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_throwglaive.jpg',
    class: 'demon-hunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 15,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Fel Rush',
    spell_id: 139258,
    description: 'Rush forward with fel energy, dealing damage to enemies in your path.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_felrush.jpg',
    class: 'demon-hunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 20,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Demon Bite',
    spell_id: 216985,
    description: 'A quick bite that deals damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_demonbite.jpg',
    class: 'demon-hunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 1,
    cooldown: 0,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Dreadplate Armor',
    spell_id: 235317,
    description: 'Engulf yourself in shadowy armor, reducing damage taken.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_dreadplatearmor.jpg',
    class: 'demon-hunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 25,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Immolation Aura',
    spell_id: 389747,
    description: 'Surround yourself with burning fel energy that damages nearby enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_immolationaura.jpg',
    class: 'demon-hunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 20,
    cooldown: 0,
    range: 5,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Vengeance Rush',
    spell_id: 319648,
    description: 'Rush forward with the power of vengeance, dealing damage and knocking back enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_vengeancerush.jpg',
    class: 'demon-hunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 20,
    cooldown: 15,
    range: 30,
    cost: 'None',
    cost_amount: 0
  }
];

const specAndHeroActives = [
  // Havoc abilities
  {
    name: 'Swirling Death',
    spell_id: 216984,
    description: 'Channel the power of the void to deal damage over time.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_swirlingdeath.jpg',
    class: 'demon-hunter',
    spec: 'havoc',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 25,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Metamorphosis',
    spell_id: 398676,
    description: 'Transform into a demon form for a limited time, gaining increased power and new abilities.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_metamorphosis.jpg',
    class: 'demon-hunter',
    spec: 'havoc',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  // Vengeance abilities
  {
    name: 'Vampiric Embrace',
    spell_id: 398675,
    description: 'Drain life from enemies to heal yourself.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_vampiricembrace.jpg',
    class: 'demon-hunter',
    spec: 'vengeance',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 25,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Soul Cleaver',
    spell_id: 139837,
    description: 'Strike with your glaive, dealing damage and generating Soul Shards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_soulcleaver.jpg',
    class: 'demon-hunter',
    spec: 'vengeance',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 0,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  // Hero talents
  {
    name: 'Dance of Blades',
    spell_id: 389761,
    description: 'After using certain abilities, create spectral blades that strike nearby enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_danceofblades.jpg',
    class: 'demon-hunter',
    spec: null,
    hero_talent: 'havoc',
    ability_type: 'hero_talent',
    level_required: 0,
    cooldown: 0,
    range: 20,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Apex Predator',
    spell_id: 389762,
    description: 'Certain attacks now have a chance to generate an additional charge of Soul Shards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_apexpredator.jpg',
    class: 'demon-hunter',
    spec: null,
    hero_talent: 'vengeance',
    ability_type: 'hero_talent',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  }
];

async function seedDemonHunterAbilities() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(Config.databaseURI);
    console.log('Connected.');

    const versions = await Version.find();
    if (!versions.length) {
      console.error('No versions found!');
      return;
    }

    // Delete all demon hunter abilities for all versions
    const del = await Ability.deleteMany({ class: 'demon-hunter' });
    console.log(`Deleted ${del.deletedCount} demon hunter abilities.`);

    let created = 0;
    for (const version of versions) {
      // For each spec (including null for class abilities)
      const specs = [null, 'havoc', 'vengeance'];
      for (const spec of specs) {
        // --- Seed core/class abilities ---
        for (const ability of coreAbilities) {
          await Ability.create({ ...ability, spec, game_version: version._id });
          created++;
        }

        // --- Seed spec/hero actives ---
        for (const ability of specAndHeroActives) {
          if (ability.spec === spec || ability.spec === null) {
            await Ability.create({ ...ability, game_version: version._id });
            created++;
          }
        }
      }
    }
    console.log(`Seeded ${created} demon hunter abilities for ${versions.length} versions.`);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedDemonHunterAbilities();
}

export default seedDemonHunterAbilities;