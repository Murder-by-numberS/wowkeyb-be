/**
 * Midnight (12.0.0) Ability Changes Migration Script
 *
 * This script handles:
 * 1. Copying active abilities from 11.x to 12.0 (excluding removed abilities)
 * 2. Renaming abilities that changed names
 *
 * Removed abilities are simply not copied over - they won't exist in version 12.0
 *
 * Usage:
 *   Development: node --env-file .env.development src/scripts/seeds/abilities/seedMidnightAbilityChanges.js
 *   Staging:     node --env-file .env.staging src/scripts/seeds/abilities/seedMidnightAbilityChanges.js
 *   Production:  node --env-file .env.production src/scripts/seeds/abilities/seedMidnightAbilityChanges.js
 *
 * Or use the runner scripts:
 *   ./scripts/migrations/midnight-12.0.0-dev.sh
 *   ./scripts/migrations/midnight-12.0.0-staging.sh
 *   ./scripts/migrations/midnight-12.0.0-prod.sh
 *
 * See docs/MIDNIGHT_12.0_ABILITY_CHANGES.md for full details
 */

import mongoose from 'mongoose';
import Ability from '../../../models/ability.js';
import Version from '../../../models/version.js';
import config from '../../../config/config.js';

// Abilities REMOVED in Midnight (12.0.0) - these will NOT be copied to version 12.0
const REMOVED_ABILITIES = {
  // Death Knight
  deathknight: {
    blood: [
      'Blooddrinker', 'Blood Tap', 'Bonestorm', 'Heartrend', 'Mark of Blood',
      'Ossified Vitriol', 'Reinforced Bones', 'Rune Tap', 'Shattering Bone',
      'Tightening Grasp', 'Tombstone'
    ],
    unholy: [
      'Apocalypse', 'Bursting Sores', 'Death Rot', 'Decomposition', 'Defile',
      'Desecrate', 'Eternal Agony', 'Festermight', 'Improved Festering Strike',
      'Legion of Souls', 'Plaguebringer', 'Rotten Touch', 'Unholy Blight'
    ],
    class: ['Sacrificial Pact']
  },

  // Demon Hunter
  demonhunter: {
    havoc: [
      'Fel Barrage', 'Fel Eruption', 'Looks Can Kill', 'Improved Fel Rush',
      'Insatiable Hunger', 'Netherwalk', 'Restless Hunter'
    ],
    vengeance: [
      'Bulk Extraction', 'Extended Spike', 'Illuminated Sigils',
      'Meteoric Strikes', 'Shear Fury', 'Soul Furnace'
    ],
    class: [
      'Chaos Fragments', 'Flames of Fury', 'Precise Sigils', 'Rush of Chaos'
    ]
  },

  // Druid
  druid: {
    balance: [
      'Astral Smolder', 'Astronomical Impact', 'Stellar Flare',
      'Umbral Inspiration', 'Waning Twilight', 'Warrior of Elune'
    ],
    feral: [
      'Adaptive Swarm', 'Berserk: Frenzy', 'Bloodtalons', 'Brutal Slash',
      'Lion\'s Strength', 'Thrashing Claws', 'Unbridled Swarm'
    ],
    guardian: [
      'Berserk: Persistence', 'Berserk: Unchecked Aggression',
      'Circle of Life and Death', 'Earthwarden', 'Improved Survival Instincts',
      'Tooth and Claw', 'Thorns of Iron'
    ],
    restoration: [
      'Budding Leaves', 'Cenarion Ward', 'Dreamstate', 'Flash of Clarity',
      'Forest\'s Flow', 'Grove Tending', 'Invigorate', 'Overgrowth',
      'Spring Blossoms', 'Twinleaf', 'Undergrowth', 'Wildwood Roots'
    ],
    class: ['Cat Form Thrash', 'Nature\'s Vigil', 'Renewal']
  },

  // Evoker
  evoker: {
    augmentation: ['Imposing Presence', 'Rockfall'],
    devastation: [
      'Arcane Vigor', 'Dense Energy', 'Firestorm', 'Focusing Iris',
      'Imposing Presence', 'Snapfire'
    ],
    preservation: ['Cycle of Life', 'Emerald Communion', 'Spiritbloom'],
    class: ['Fire Within']
  },

  // Hunter
  hunter: {
    'beast-mastery': [
      'Barbed Wrath', 'Hunter\'s Prey', 'Multi-Shot', 'Poisoned Barbs',
      'Serpentine Rhythm', 'Wild Call'
    ],
    marksmanship: [
      'Improved Deathblow', 'Improved Streamline', 'Moving Target',
      'Oh\'naran Winds', 'Razor Fragments', 'Streamline', 'Tactical Reload'
    ],
    survival: [
      'Alpha Predator', 'Bombardier', 'Born to Kill', 'Butchery',
      'Contagious Reagents', 'Coordinated Assault', 'Cull the Herd',
      'Deadly Duo', 'Flanking Strike', 'Fury of the Eagle', 'Merciless Blow',
      'Mongoose Bite', 'Ranger', 'Relentless Primal Ferocity',
      'Ruthless Marauder', 'Spearhead', 'Sulfur-Lined Pockets',
      'Symbiotic Adrenaline', 'Tactical Advantage', 'Terms of Engagement',
      'Viper\'s Venom'
    ]
  },

  // Mage
  mage: {
    arcane: [
      'Aether Fragment', 'Arcane Bombardment', 'Arcane Debilitation',
      'Arcane Harmony', 'Big Brained', 'Improved Touch of the Magi',
      'Leydrinker', 'Leysight', 'Magi\'s Spark', 'Nether Munitions',
      'Nether Precision', 'Static Cloud', 'Time Loop'
    ],
    fire: [
      'Alexstrasza\'s Fury', 'Ashen Feather', 'Call of the Sun King',
      'Convection', 'Cratermaker', 'Explosive Ingenuity', 'Firefall',
      'Flame Patch', 'Hyperthermia', 'Improved Scorch', 'Lit Fuse',
      'Majesty of the Phoenix', 'Phoenix Flames', 'Phoenix Reborn',
      'Pyrotechnics', 'Quickflame', 'Sparking Cinders', 'Sun King\'s Blessing',
      'Surging Blaze', 'Unleashed Inferno'
    ],
    frost: [
      'Bone Chilling', 'Chain Reaction', 'Coldest Snap', 'Cold Front',
      'Cryopathy', 'Death\'s Chill', 'Ice Caller', 'Icy Veins',
      'Slick Ice', 'Splintering Cold', 'Subzero'
    ],
    class: [
      'Accumulative Shielding', 'Blast Wave', 'Displacement', 'Diverted Energy',
      'Frigid Winds', 'Incanter\'s Flow', 'Mass Barrier', 'Reabsorption',
      'Reduplication', 'Rigid Ice', 'Shifting Power', 'Slow', 'Supernova',
      'Tempest Barrier', 'Temporal Velocity', 'Volatile Destruction'
    ]
  },

  // Monk
  monk: {
    brewmaster: [
      'Call to Arms', 'Chi Surge', 'Dampen Harm', 'Heightened Guard',
      'Hit Scheme', 'Ox Adept', 'Strike at Dawn', 'Weapons of Order'
    ],
    mistweaver: [
      'Energy Transfer', 'Invoker\'s Delight', 'Jadefire Stomp',
      'Mending Proliferation', 'Mists of Life', 'Peer Into Peace',
      'Refreshing Jade Wind', 'Shaohao\'s Lessons', 'Tea of Plenty',
      'Tea of Serenity', 'Unison'
    ],
    windwalker: [
      'Acclamation', 'Courageous Impulse', 'Fury of Xuen', 'Gale Force',
      'Invoke Xuen, the White Tiger', 'Invoker\'s Delight', 'Jadefire Harmony',
      'Last Emperor\'s Capacitor', 'Martial Mixture', 'Ordered Elements',
      'Rushing Jade Wind', 'Storm, Earth, and Fire', 'Summon White Tiger Statue',
      'Transfer the Power', 'Xuen\'s Bond'
    ],
    class: ['Bounce Back', 'Clash']
  },

  // Paladin
  paladin: {
    holy: [
      'Barrier of Faith', 'Blessing of Seasons', 'Boundless Salvation',
      'Merciful Auras', 'Power of the Silver Hand', 'Rebuke', 'Relentless Inquisitor'
    ],
    protection: [
      'Barricade of Faith', 'Bastion of Light', 'Eye of Tyr', 'Faith in the Light',
      'Holy Shield', 'Improved Holy Shield', 'Inmost Light', 'Inner Light',
      'Inspiring Vanguard', 'Moment of Glory', 'Resolute Defender'
    ],
    retribution: [
      'Aegis of Protection', 'Divine Arbiter', 'Divine Auxiliary',
      'Executioner\'s Will', 'Final Reckoning', 'Inquisitor\'s Ire',
      'Justicar\'s Vengeance', 'Light\'s Celerity', 'Searing Light',
      'Vanguard\'s Momentum'
    ],
    class: [
      'Judgment of Light', 'Of Dusk and Dawn', 'Punishment', 'Seal of the Crusader'
    ]
  },

  // Priest
  priest: {
    discipline: [
      'Luminous Barrier', 'Malicious Intent', 'Overloaded with Light', 'Schism',
      'Shadow Covenant', 'Sins of the Many', 'Twilight Corruption',
      'Twilight Equilibrium', 'Void Summoner'
    ],
    holy: [
      'Answered Prayers', 'Divine Word', 'Heal', 'Holy Mending',
      'Lightwell', 'Prayer Circle', 'Symbol of Hope'
    ],
    shadow: ['Dark Ascension', 'Last Word', 'Psychic Horror'],
    class: [
      'Apathy', 'Cauterizing Shadows', 'Divine Star', 'Essence Devourer',
      'From Darkness Comes Light', 'Manipulation', 'Power Word: Life',
      'Renew', 'Rhapsody', 'San\'layn', 'Throes of Pain', 'Void Shield',
      'Void Shift', 'Word of the Pious'
    ]
  },

  // Rogue
  rogue: {
    assassination: [
      'Arterial Precision', 'Indiscriminate Carnage', 'Lightweight Shiv',
      'Master Assassin', 'Sanguine Blades', 'Serrated Bone Spikes',
      'Tiny Toxic Blade', 'Twist the Knife', 'Vicious Venoms'
    ],
    outlaw: [
      'Ambidexterity', 'Count the Odds', 'Crackshot', 'Dirty Tricks',
      'Float Like a Butterfly and Sting Like a Bee', 'Ghostly Strike',
      'Greenskin\'s Wickers', 'Improved Main Gauche', 'Precise Cuts',
      'Riposte', 'Triple Threat', 'Underhanded Upper Hand'
    ],
    subtlety: [
      'Flagellation', 'Improved Shadow Dance', 'Improved Shadow Techniques',
      'Inevitability', 'Rupture', 'Swift Death', 'Symbols of Death'
    ],
    class: ['Cold Blood', 'Rushed Setup', 'Shadowheart']
  },

  // Shaman
  shaman: {
    elemental: [
      'Deeply Rooted Elements', 'Echo of the Elementals', 'Elemental Equilibrium',
      'Erupting Lava', 'Fire Elemental', 'Flux Melting', 'Icefury',
      'Liquid Magma Totem', 'Magma Chamber', 'Primordial Wave',
      'Splintered Elements', 'Storm Elemental'
    ],
    enhancement: [
      'Alpha Wolf', 'Crashing Storms', 'Elemental Blast', 'Elemental Spirits',
      'Flowing Spirits', 'Hailstorm', 'Ice Strike', 'Improved Maelstrom',
      'Legacy of the Frostwitch', 'Molten Thunder', 'Primordial Wave',
      'Tempest Strikes', 'Unrelenting Storms', 'Witch Doctor\'s Ancestry'
    ],
    restoration: [
      'Ancestral Protection Totem', 'Cloudburst Totem', 'Earthen Wall Totem',
      'Healing Surge', 'High Tide', 'Mana Tide', 'Spiritwalker\'s Tidal Totem',
      'Tidal Waves', 'Tidebringer', 'Tide Turner', 'Undulation', 'Wellspring'
    ],
    class: [
      'Arctic Snowstorm', 'Call of the Elements', 'Creation Core',
      'Frost Shock', 'Guardian\'s Cudgel', 'Lightning Lasso',
      'Stone Bulwark Totem', 'Totemic Recall'
    ]
  },

  // Warlock
  warlock: {
    affliction: [
      'Dark Virtuosity', 'Focused Malignancy', 'Improved Malefic Rapture',
      'Kindled Malice', 'Malefic Rapture', 'Malefic Touch', 'Malevolent Visionary',
      'Malign Omen', 'Oblivion', 'Perpetual Unstability', 'Phantom Singularity',
      'Relinquished', 'Shadow Embrace', 'Soul Rot', 'Tormented Crescendo',
      'Vile Taint', 'Volatile Agony'
    ],
    demonology: [
      'Bilescourge Bombers', 'Blood Invocation', 'Demonic Strength',
      'Doom Eternal', 'Dread Calling', 'Fel Invocation', 'Fel Sunder',
      'Fiendish Oblation', 'Grimoire: Felguard', 'Immutable Hatred',
      'Impending Doom', 'Shadow Invocation', 'Shadowtouched', 'Soul Strike',
      'The Expendables', 'The Houndmaster\'s Gambit', 'Umbral Blaze', 'Wicked Maw'
    ],
    destruction: [
      'Blistering Atrophy', 'Burn to Ashes', 'Decimation', 'Demonfire Mastery',
      'Dimension Ripper', 'Indiscriminate Flames', 'Master Ritualist',
      'Power Overwhelming', 'Pyrogenics', 'Ritual of Ruin', 'Rolling Havoc'
    ],
    class: [
      'Accrued Vitality', 'Amplify Curse', 'Curses of Enfeeblement', 'Darkfury',
      'Demonic Inspiration', 'Demonic Tactics', 'Lifeblood', 'Pact of Exhaustion',
      'Pact of Tongues', 'Socrethar\'s Guile', 'Soul Conduit',
      'Sargerei Technique', 'Teachings of the Satyr', 'Wrathful Minion'
    ]
  },

  // Warrior
  warrior: {
    arms: [
      'Blunt Instruments', 'Exhilarating Blows', 'Finishing Blows',
      'In for the Kill', 'Juggernaut', 'Merciless Bonegrinder',
      'Spiteful Serenity', 'Skullsplitter', 'Storm of Swords', 'Storm Wall',
      'Test of Might', 'Warbreaker'
    ],
    fury: [
      'Ashen Juggernaut', 'Dancing Blade', 'Depths of Insanity', 'Onslaught',
      'Ravager', 'Single-Minded Fury', 'Slaughtering Strikes', 'Storm of Steel',
      'Tenderize', 'Titanic Rage', 'Unbridled Ferocity', 'Unhinged'
    ],
    protection: ['Bolster', 'Red Right Hand', 'Sweeping Revenge', 'Unnerving Focus'],
    class: [
      'Berserker\'s Torment', 'Blademaster\'s Torment', 'Cacophonous Roar',
      'Challenger\'s Might', 'Concussive Blows', 'Immovable Object', 'Menace',
      'Piercing Challenge', 'Seismic Reverberation', 'Thunderous Roar',
      'Thunderous Words', 'Titan\'s Torment', 'Unstoppable Force', 'Uproar',
      'Warlord\'s Torment'
    ]
  }
};

// Abilities RENAMED in Midnight (name changes)
// Note: spec should match how the ability is stored in the database
// - Use null for class-wide abilities (stored with spec: null)
// - Use the specific spec name for spec-specific abilities
const RENAMED_ABILITIES = [
  { oldName: 'Devouring Plague', newName: 'Shadow Word: Madness', class: 'priest', spec: 'shadow' },
  { oldName: 'Shadow Crash', newName: 'Tentacle Slam', class: 'priest', spec: 'shadow' },
  { oldName: 'Flame Shock', newName: 'Voltaic Blaze', class: 'shaman', spec: null }, // Class-wide ability
  // Add more renames as needed
];

async function createVersion12() {
  const existingVersion = await Version.findOne({ game_version: '12.0.0' });
  if (existingVersion) {
    console.log('Version 12.0.0 already exists');
    return existingVersion;
  }

  const version = await Version.create({
    game_version: '12.0.0',
    expansion: 'Midnight',
    release_date: new Date('2026-03-02'),
    is_current: false
  });
  console.log('Created version 12.0.0');
  return version;
}

async function handleRenamedAbilities(version12Id, version11Id) {
  for (const rename of RENAMED_ABILITIES) {
    const oldAbility = await Ability.findOne({
      name: rename.oldName,
      class: rename.class,
      spec: rename.spec,
      game_version: version11Id
    });

    if (oldAbility) {
      // Check if new ability already exists
      const existing = await Ability.findOne({
        name: rename.newName,
        class: rename.class,
        spec: rename.spec,
        game_version: version12Id
      });

      if (!existing) {
        // Create ability with new name in 12.0 (old name won't be copied)
        const newAbilityData = oldAbility.toObject();
        delete newAbilityData._id;
        newAbilityData.name = rename.newName;
        newAbilityData.game_version = version12Id;
        await Ability.create(newAbilityData);
        console.log(`Renamed: ${rename.oldName} -> ${rename.newName} (${rename.class} ${rename.spec})`);
      }
    }
  }
}

async function copyActiveAbilitiesToVersion12(version12Id, version11Id) {
  // Get all active abilities from version 11 that aren't in the removed list
  const version11Abilities = await Ability.find({
    game_version: version11Id,
    is_active: true
  });

  // Build a set of renamed ability old names to exclude
  const renamedOldNames = new Set(RENAMED_ABILITIES.map(r => `${r.class}|${r.spec}|${r.oldName}`));

  let copied = 0;
  let skipped = 0;
  for (const ability of version11Abilities) {
    const className = ability.class;
    const spec = ability.spec || 'class';

    // Check if this ability is in the removed list
    const isRemoved = REMOVED_ABILITIES[className]?.[spec]?.includes(ability.name) ||
      REMOVED_ABILITIES[className]?.class?.includes(ability.name);

    // Check if this ability is being renamed (will be handled separately)
    const isRenamed = renamedOldNames.has(`${className}|${spec}|${ability.name}`);

    if (isRemoved || isRenamed) {
      skipped++;
      continue;
    }

    // Check if already exists in 12.0
    const existing = await Ability.findOne({
      name: ability.name,
      class: ability.class,
      spec: ability.spec,
      game_version: version12Id
    });

    if (!existing) {
      const abilityData = ability.toObject();
      delete abilityData._id;
      abilityData.game_version = version12Id;
      await Ability.create(abilityData);
      copied++;
    }
  }

  console.log(`Copied ${copied} abilities to version 12.0.0`);
  console.log(`Skipped ${skipped} abilities (removed or renamed)`);
}

async function run() {
  try {
    await mongoose.connect(config.databaseURI);
    console.log('Connected to MongoDB');

    // Get or create version 12.0.0
    const version12 = await createVersion12();

    // Get version 11.x (latest War Within version)
    const version11 = await Version.findOne({ game_version: { $regex: /^11\./ } })
      .sort({ game_version: -1 });

    if (!version11) {
      console.error('No version 11.x found. Please ensure The War Within abilities exist first.');
      process.exit(1);
    }

    console.log(`\nMigrating from version ${version11.game_version} to 12.0.0...\n`);

    // Step 1: Copy all active abilities from 11.x to 12.0 (excluding removed abilities)
    await copyActiveAbilitiesToVersion12(version12._id, version11._id);

    // Step 2: Handle renamed abilities (creates new name, old name won't be copied)
    await handleRenamedAbilities(version12._id, version11._id);

    console.log('\n✅ Migration complete!');
    console.log('\nNote: New abilities added in Midnight need to be seeded separately.');
    console.log('See docs/MIDNIGHT_12.0_ABILITY_CHANGES.md for the full list of new abilities to add.');

  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

run();
