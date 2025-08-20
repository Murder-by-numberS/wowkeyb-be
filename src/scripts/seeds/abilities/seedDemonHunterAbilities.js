import mongoose from 'mongoose';
import Ability from '../../../models/ability.js';
import Version from '../../../models/version.js';
import Config from '../../../config/config.js';

// Core/class demon hunter abilities
const coreAbilities = [
  {
    name: 'Chaos Nova',
    spell_id: 179057,
    description: 'Releases an explosion of fel energy, stunning all nearby enemies for 2 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_chaosnova.jpg',
    class: 'demonhunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 60,
    range: 8,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Consume Magic',
    spell_id: 183752,
    description: 'Consume a beneficial magic effect on the target, gaining Fury and healing you.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_consumemagic.jpg',
    class: 'demonhunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 15,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Darkness',
    spell_id: 196718,
    description: 'Summon darkness around you in a 8 yard radius, granting friendly targets a 20% chance to avoid all damage from an attack.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_darkness.jpg',
    class: 'demonhunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 180,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Disrupt',
    spell_id: 183752,
    description: 'Interrupt the target\'s spellcasting and prevent any spell in that school from being cast for 3 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_disrupt.jpg',
    class: 'demonhunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 15,
    range: 10,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Felblade',
    spell_id: 232893,
    description: 'Rush to your target and deal damage, generating Fury.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_felblade.jpg',
    class: 'demonhunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 15,
    range: 15,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Glide',
    spell_id: 131347,
    description: 'Allows you to glide through the air, reducing falling speed.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_glide.jpg',
    class: 'demonhunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Immolation Aura',
    spell_id: 389747,
    description: 'Surround yourself with burning fel energy that damages nearby enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_immolation.jpg',
    class: 'demonhunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 0,
    range: 5,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Imprison',
    spell_id: 217832,
    description: 'Imprison a demon, beast, or humanoid, incapacitating them for up to 60 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_imprison.jpg',
    class: 'demonhunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 15,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Sigil of Misery',
    spell_id: 207684,
    description: 'Place a sigil on the ground that causes enemies to flee in fear when activated.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_sigilofmisery.jpg',
    class: 'demonhunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 90,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Sigil of Spite',
    spell_id: 207684,
    description: 'Place a sigil on the ground that explodes when enemies come near, dealing damage and applying a debuff.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_sigilofspite.jpg',
    class: 'demonhunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 90,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Spectral Sight',
    spell_id: 188501,
    description: 'Allows you to see enemies and treasures through walls and obstacles.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_spectralsight.jpg',
    class: 'demonhunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'The Hunt',
    spell_id: 370965,
    description: 'Mark a target for death, increasing your damage against them and allowing you to track them.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_ardenweald_demonhunter.jpg',
    class: 'demonhunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 90,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Throw Glaive',
    spell_id: 185123,
    description: 'Throw your glaive at the target, dealing damage and slowing them.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_throwglaive.jpg',
    class: 'demonhunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 3,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Torment',
    spell_id: 185245,
    description: 'Torment the target, causing them to attack you and generating threat.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_torment.jpg',
    class: 'demonhunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 8,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Vengeful Retreat',
    spell_id: 198793,
    description: 'Retreat backwards, dealing damage to enemies in your path and knocking them back.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_vengefulretreat.jpg',
    class: 'demonhunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 24,
    range: 0,
    cost: 'None',
    cost_amount: 0
  }
];

const specAndHeroActives = [
  // Havoc abilities
  {
    name: 'Blade Dance',
    spell_id: 188499,
    description: 'Perform a deadly dance with your glaives, dealing damage to all nearby enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_bladedance.jpg',
    class: 'demonhunter',
    spec: 'havoc',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 12,
    range: 8,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Blur',
    spell_id: 198589,
    description: 'Increase your dodge chance and reduce damage taken for a short duration.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_blur.jpg',
    class: 'demonhunter',
    spec: 'havoc',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 60,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Chaos Strike',
    spell_id: 162794,
    description: 'Strike with chaotic fel energy, dealing damage and potentially refunding Fury.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_chaosstrike.jpg',
    class: 'demonhunter',
    spec: 'havoc',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 0,
    range: 5,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Essence Break',
    spell_id: 258860,
    description: 'Break the essence of your target, dealing damage and increasing your damage against them.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
    class: 'demonhunter',
    spec: 'havoc',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 45,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Eye Beam',
    spell_id: 198013,
    description: 'Channel a beam of fel energy, dealing damage to enemies in a line.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_eyebeam.jpg',
    class: 'demonhunter',
    spec: 'havoc',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 40,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Fel Barrage',
    spell_id: 211053,
    description: 'Launch a barrage of fel projectiles at your target, dealing damage over time.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_felbarrage.jpg',
    class: 'demonhunter',
    spec: 'havoc',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 60,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Fel Eruption',
    spell_id: 211881,
    description: 'Cause fel energy to erupt from the ground, dealing damage and stunning enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_bossfellord_felspike.jpg',
    class: 'demonhunter',
    spec: 'havoc',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 30,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Fel Rush',
    spell_id: 195072,
    description: 'Rush forward with fel energy, dealing damage to enemies in your path.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_felrush.jpg',
    class: 'demonhunter',
    spec: 'havoc',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 10,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Glaive Tempest',
    spell_id: 342817,
    description: 'Create a storm of spinning glaives that deal damage to nearby enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_glaive_1h_artifactazgalor_d_06dual.jpg',
    class: 'demonhunter',
    spec: 'havoc',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 25,
    range: 8,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Metamorphosis',
    spell_id: 191427,
    description: 'Transform into a demon form, gaining increased damage and new abilities.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_metamorphasisdps.jpg',
    class: 'demonhunter',
    spec: 'havoc',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Netherwalk',
    spell_id: 196555,
    description: 'Step into the nether, becoming immune to damage and able to pass through enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_warlock_demonsoul.jpg',
    class: 'demonhunter',
    spec: 'havoc',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Sigil of Flame',
    spell_id: 204596,
    description: 'Place a sigil that erupts in flame, dealing damage over time to enemies within its area.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_sigilofinquisition.jpg',
    class: 'demonhunter',
    spec: 'havoc',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 30,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  // Vengeance abilities
  {
    name: 'Bulk Extraction',
    spell_id: 320341,
    description: 'Extract soul fragments from nearby enemies, healing you and generating Soul Shards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadesofdarkness.jpg',
    class: 'demonhunter',
    spec: 'vengeance',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 90,
    range: 8,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Demon Spikes',
    spell_id: 203720,
    description: 'Activate your demonic defenses, increasing your armor and chance to block attacks.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_demonspikes.jpg',
    class: 'demonhunter',
    spec: 'vengeance',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 20,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Fel Devastation',
    spell_id: 212084,
    description: 'Channel fel energy, dealing damage to enemies in front of you and healing yourself.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_feldevastation.jpg',
    class: 'demonhunter',
    spec: 'vengeance',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 60,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Fiery Brand',
    spell_id: 204021,
    description: 'Brand an enemy with fire, causing them to take increased damage from your attacks.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_fierybrand.jpg',
    class: 'demonhunter',
    spec: 'vengeance',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 60,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Fracture',
    spell_id: 263642,
    description: 'Shatter your soul, dealing damage to nearby enemies and generating Soul Shards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_creature_felsunder.jpg',
    class: 'demonhunter',
    spec: 'vengeance',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 12,
    range: 8,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Infernal Strike',
    spell_id: 189110,
    description: 'Leap into the air and crash down at the target location, dealing damage and stunning enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_infernalstrike1.jpg',
    class: 'demonhunter',
    spec: 'vengeance',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 20,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Metamorphosis',
    spell_id: 187827,
    description: 'Transform into a demon form, gaining increased armor and defensive abilities.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_metamorphasisdps.jpg',
    class: 'demonhunter',
    spec: 'vengeance',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Shear',
    spell_id: 203782,
    description: 'Shear your target, dealing damage and generating Soul Shards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_hatefulstrike.jpg',
    class: 'demonhunter',
    spec: 'vengeance',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 0,
    range: 5,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Sigil of Chains',
    spell_id: 202138,
    description: 'Place a sigil that chains enemies together, reducing their movement speed and dealing damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_sigilofchains.jpg',
    class: 'demonhunter',
    spec: 'vengeance',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 90,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Sigil of Flame',
    spell_id: 204596,
    description: 'Place a sigil that erupts in flame, dealing damage over time to enemies within its area.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_sigilofinquisition.jpg',
    class: 'demonhunter',
    spec: 'vengeance',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 30,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Sigil of Silence',
    spell_id: 202137,
    description: 'Place a sigil that silences enemies within its area of effect.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_sigilofsilence.jpg',
    class: 'demonhunter',
    spec: 'vengeance',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 60,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Soul Barrier',
    spell_id: 263648,
    description: 'Create a barrier of soul energy that absorbs damage and heals you.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_soulbarrier.jpg',
    class: 'demonhunter',
    spec: 'vengeance',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 60,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Soul Carver',
    spell_id: 207407,
    description: 'Carve into your target\'s soul, dealing damage and generating Soul Shards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_glaive_1h_artifactaldrochi_d_01.jpg',
    class: 'demonhunter',
    spec: 'vengeance',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 40,
    range: 5,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Soul Cleave',
    spell_id: 228477,
    description: 'Cleave enemies in front of you, dealing damage and consuming Soul Shards for additional effects.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_demonhunter_soulcleave.jpg',
    class: 'demonhunter',
    spec: 'vengeance',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 0,
    range: 8,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Spirit Bomb',
    spell_id: 247454,
    description: 'Consume Soul Shards to create an explosion that deals damage and heals you.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_icon_shadowcouncilorb_purple.jpg',
    class: 'demonhunter',
    spec: 'vengeance',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 0,
    range: 8,
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
    const del = await Ability.deleteMany({ class: 'demonhunter' });
    console.log(`Deleted ${del.deletedCount} demon hunter abilities.`);

    let created = 0;
    for (const version of versions) {
      // --- Seed core/class abilities once per version (available to all specs) ---
      for (const ability of coreAbilities) {
        await Ability.create({ ...ability, spec: null, game_version: version._id });
        created++;
      }

      // --- Seed spec/hero actives, handling replacements ---
      for (const ability of specAndHeroActives) {
        await Ability.create({ ...ability, game_version: version._id });
        created++;
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
