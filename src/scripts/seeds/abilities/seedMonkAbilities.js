import mongoose from 'mongoose';
import Ability from '../../../models/ability.js';
import Version from '../../../models/version.js';
import Config from '../../../config/config.js';

// Core/class monk abilities
const coreAbilities = [
  {
    name: 'Blackout Kick',
    spell_id: '100784',
    description: 'A powerful kick that deals Physical damage and has a chance to reset the cooldown of your next Rising Sun Kick.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_roundhousekick.jpg',
    class: 'monk',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 3,
    cooldown: 0,
    range: 5,
    cost: 'Chi',
    cost_amount: 2
  },
  {
    name: 'Detox',
    spell_id: '115450',
    description: 'Removes all harmful magic effects from a friendly target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_detox.jpg',
    class: 'monk',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 6,
    cooldown: 0,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Leg Sweep',
    spell_id: '119381',
    description: 'Knocks down all enemies within 5 yards, stunning them for 3 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_legsweep.jpg',
    class: 'monk',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 60,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Paralysis',
    spell_id: '115078',
    description: 'Incapacitates the target for 1 min. Any damage will cancel the effect.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_paralysis.jpg',
    class: 'monk',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 8,
    cooldown: 0,
    range: 20,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Provoke',
    spell_id: '115546',
    description: 'Taunts the target to attack you.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_provoke.jpg',
    class: 'monk',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 15,
    cooldown: 8,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Rising Sun Kick',
    spell_id: '107428',
    description: 'A powerful kick that deals Physical damage and applies Mark of the Crane.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_risingsunkick.jpg',
    class: 'monk',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 12,
    cooldown: 12,
    range: 5,
    cost: 'Chi',
    cost_amount: 2
  },
  {
    name: 'Roll',
    spell_id: '109132',
    description: 'Roll a short distance.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_roll.jpg',
    class: 'monk',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 4,
    cooldown: 20,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Spear Hand Strike',
    spell_id: '116705',
    description: 'Strike with the spear hand, interrupting spellcasting and preventing any spell in that school from being cast for 4 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_spearhand.jpg',
    class: 'monk',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 15,
    range: 5,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Tiger Palm',
    spell_id: '100780',
    description: 'Strike with the palm of your hand, dealing Physical damage and generating 1 Chi.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_tigerpalm.jpg',
    class: 'monk',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 1,
    cooldown: 0,
    range: 5,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Transcendence',
    spell_id: '101643',
    description: 'Split your body and soul, creating a Transcendence copy at your location.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/monk_ability_transcendence.jpg',
    class: 'monk',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Transcendence: Transfer',
    spell_id: '119996',
    description: 'Transfer your spirit to your Transcendence copy, removing all movement impairing effects.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/monk_ability_transcendence.jpg',
    class: 'monk',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  }
];

// Spec/hero talent actives and replacements
const specAndHeroActives = [
  // Brewmaster spec actives
  {
    name: 'Black Ox Brew',
    spell_id: '115399',
    description: 'Instantly refills your Energy and grants you 3 Ironskin Brew charges.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_blackoxbrew.jpg',
    class: 'monk',
    spec: 'brewmaster',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Breath of Fire',
    spell_id: '115181',
    description: 'Breathe fire on targets in front of you, dealing Fire damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_breathoffire.jpg',
    class: 'monk',
    spec: 'brewmaster',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'Chi',
    cost_amount: 2
  },
  {
    name: 'Celestial Brew',
    spell_id: '322507',
    description: 'A magical brew that absorbs damage for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_celestialbrew.jpg',
    class: 'monk',
    spec: 'brewmaster',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Ironskin Brew',
    spell_id: '115308',
    description: 'Increases your stagger by 50% for 7 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_ironskinbrew.jpg',
    class: 'monk',
    spec: 'brewmaster',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Keg Smash',
    spell_id: '121253',
    description: 'Smash a keg of brew on the target, dealing Physical damage and applying Brewmaster\'s Balance.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_kegsmash.jpg',
    class: 'monk',
    spec: 'brewmaster',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 15,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Purifying Brew',
    spell_id: '119582',
    description: 'Purify your stagger, removing 50% of your staggered damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_purifyingbrew.jpg',
    class: 'monk',
    spec: 'brewmaster',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  // Windwalker spec actives
  {
    name: 'Fists of Fury',
    spell_id: '113656',
    description: 'Pummel all targets in front of you, dealing Physical damage over 4 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/monk_ability_fistoffury.jpg',
    class: 'monk',
    spec: 'windwalker',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 24,
    range: 0,
    cost: 'Chi',
    cost_amount: 3
  },
  {
    name: 'Invoke Xuen, the White Tiger',
    spell_id: '123904',
    description: 'Summons an image of Xuen, the White Tiger for 24 sec. Xuen attacks your target and provides 5% increased critical strike chance to all party and raid members.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_summontigerstatue.jpg',
    class: 'monk',
    spec: 'windwalker',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Storm, Earth, and Fire',
    spell_id: '137639',
    description: 'Split into three elemental spirits for 15 sec, each dealing 45% of normal damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_stormreach.jpg',
    class: 'monk',
    spec: 'windwalker',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 90,
    range: 0,
    cost: 'Chi',
    cost_amount: 2
  },
  {
    name: 'Touch of Death',
    spell_id: '115080',
    description: 'Touch of Death can now be used on targets with less than 15% health remaining, instantly killing them.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_touchofdeath.jpg',
    class: 'monk',
    spec: 'windwalker',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 5,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Whirling Dragon Punch',
    spell_id: '152175',
    description: 'Performs a devastating whirling upward strike, dealing Physical damage to all nearby enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_hurricanestrike.jpg',
    class: 'monk',
    spec: 'windwalker',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 24,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  // Mistweaver spec actives
  {
    name: 'Enveloping Mist',
    spell_id: '124682',
    description: 'Wraps the target in healing mists, healing them for a large amount over 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_monk_envelopingmist.jpg',
    class: 'monk',
    spec: 'mistweaver',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Chi',
    cost_amount: 2
  },
  {
    name: 'Invoke Yu\'lon, the Jade Serpent',
    spell_id: '322118',
    description: 'Summons an image of Yu\'lon, the Jade Serpent for 25 sec. Yu\'lon heals nearby allies and provides 10% increased healing to all party and raid members.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_summonserpentstatue.jpg',
    class: 'monk',
    spec: 'mistweaver',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 180,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Life Cocoon',
    spell_id: '116849',
    description: 'Encases the target in a cocoon of Chi energy for 12 sec, absorbing damage and healing them.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_chicocoon.jpg',
    class: 'monk',
    spec: 'mistweaver',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Renewing Mist',
    spell_id: '115151',
    description: 'Surrounds the target with healing mists, healing them for a moderate amount over 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_renewingmists.jpg',
    class: 'monk',
    spec: 'mistweaver',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Soothing Mist',
    spell_id: '115175',
    description: 'Heals the target for a moderate amount over 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_soothingmists.jpg',
    class: 'monk',
    spec: 'mistweaver',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Vivify',
    spell_id: '116670',
    description: 'Heals the target and up to 2 nearby injured allies for a moderate amount.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_vivify.jpg',
    class: 'monk',
    spec: 'mistweaver',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Chi',
    cost_amount: 2
  },
  // Hero talent actives
  {
    name: 'Chi Burst',
    spell_id: '123986',
    description: 'Hurls a torrent of Chi energy up to 40 yards forward, dealing Nature damage to enemies and healing allies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_chiburst.jpg',
    class: 'monk',
    spec: null,
    hero_talent: 'chi_mastery',
    ability_type: 'hero_talent',
    level_required: 0,
    cooldown: 30,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Touch of Karma',
    spell_id: '122470',
    description: 'Transfers 50% of damage taken to the target for 10 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_touchofkarma.jpg',
    class: 'monk',
    spec: null,
    hero_talent: 'karma',
    ability_type: 'hero_talent',
    level_required: 0,
    cooldown: 90,
    range: 20,
    cost: 'None',
    cost_amount: 0
  }
];

async function seedMonkAbilities() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(Config.databaseURI);
    console.log('Connected.');

    const versions = await Version.find();
    if (!versions.length) {
      console.error('No versions found!');
      return;
    }

    // Delete all monk abilities for all versions
    const del = await Ability.deleteMany({ class: 'monk' });
    console.log(`Deleted ${del.deletedCount} monk abilities.`);

    let created = 0;
    for (const version of versions) {
      // For each spec (including null for class abilities)
      const specs = [null, 'brewmaster', 'windwalker', 'mistweaver'];
      for (const spec of specs) {
        // --- Seed core/class abilities, skipping those replaced by hero/spec talents for this spec ---
        for (const ability of coreAbilities) {
          // Check for spec-level replacements
          const specReplaced = spec && specAndHeroActives.find(a =>
            a.replaces === ability.name &&
            a.spec === spec &&
            a.hero_talent === null
          );

          // Check for hero talent replacements (for all hero talents of this spec)
          const heroTalentReplaced = spec && specAndHeroActives.find(a =>
            a.replaces === ability.name &&
            a.spec === spec &&
            a.hero_talent !== null
          );

          if (specReplaced || heroTalentReplaced) continue;
          await Ability.create({ ...ability, spec, game_version: version._id });
          created++;
        }
      }

      // --- Seed spec/hero actives, handling replacements ---
      for (const ability of specAndHeroActives) {
        // For hero talents, create them as-is (spec: null, hero_talent: 'karma')
        if (ability.hero_talent) {
          await Ability.create({ ...ability, game_version: version._id });
          created++;
        } else {
          // Regular spec abilities
          await Ability.create({ ...ability, game_version: version._id });
          created++;
        }
      }
    }
    console.log(`Seeded ${created} monk abilities for ${versions.length} versions.`);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedMonkAbilities();
}

export default seedMonkAbilities;
