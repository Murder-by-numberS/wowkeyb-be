import mongoose from 'mongoose';
import Ability from '../../../models/ability.js';
import Version from '../../../models/version.js';
import Config from '../../../config/config.js';

// Core/class warlock abilities
const coreAbilities = [
  {
    name: 'Command Demon',
    spell_id: '119898',
    description: 'Commands your demon to use its special ability.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warlock_demonicempowerment.jpg',
    class: 'warlock',
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
    name: 'Create Healthstone',
    spell_id: '6201',
    description: 'Creates a Healthstone that can be consumed to restore health.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_stone_04.jpg',
    class: 'warlock',
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
    name: 'Create Soulwell',
    spell_id: '29893',
    description: 'Creates a Soulwell that party and raid members can use to create a Healthstone.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadesofdarkness.jpg',
    class: 'warlock',
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
    name: 'Curse of Exhaustion',
    spell_id: '18223',
    description: 'Curses the target, reducing their movement speed by 30%.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_grimward.jpg',
    class: 'warlock',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Curse of Tongues',
    spell_id: '1714',
    description: 'Curses the target, increasing their casting time.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_curseoftounges.jpg',
    class: 'warlock',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Curse of Weakness',
    spell_id: '702',
    description: 'Curses the target, reducing their attack power.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_curseofmannoroth.jpg',
    class: 'warlock',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Dark Pact',
    spell_id: '108416',
    description: 'Sacrifices 20% of your demon\'s maximum health to restore 400% of that amount in mana.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_deathpact.jpg',
    class: 'warlock',
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
    name: 'Demonic Circle',
    spell_id: '48018',
    description: 'Creates a demonic circle at your location. You can return to this location by using Demonic Circle: Teleport.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_demoniccirclesummon.jpg',
    class: 'warlock',
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
    name: 'Demonic Circle: Teleport',
    spell_id: '48020',
    description: 'Teleports you to your Demonic Circle and removes all movement impairing effects.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_demoniccircleteleport.jpg',
    class: 'warlock',
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
    name: 'Drain Life',
    spell_id: '689',
    description: 'Drains life from the target, causing Shadow damage and healing you.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_lifedrain02.jpg',
    class: 'warlock',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 8,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Eye of Kilrogg',
    spell_id: '126',
    description: 'Creates an eye of Kilrogg that allows you to see through its eyes.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_evileye.jpg',
    class: 'warlock',
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
    name: 'Fear',
    spell_id: '5782',
    description: 'Fears the target, causing it to flee in terror for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_possession.jpg',
    class: 'warlock',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 8,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Health Funnel',
    spell_id: '755',
    description: 'Transfers your health to your demon pet.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_lifedrain.jpg',
    class: 'warlock',
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
    name: 'Incinerate',
    spell_id: '29722',
    description: 'Deals Fire damage to the target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_incinerate.jpg',
    class: 'warlock',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Mortal Coil',
    spell_id: '6789',
    description: 'Wraps the target in coils of shadow energy, causing Shadow damage and healing you.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warlock_mortalcoil.jpg',
    class: 'warlock',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 45,
    range: 20,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Ritual of Doom',
    spell_id: '18540',
    description: 'Begins a ritual that summons a Doomguard.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/warlock_sacrificial_pact.jpg',
    class: 'warlock',
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
    name: 'Ritual of Summoning',
    spell_id: '698',
    description: 'Begins a ritual to summon a party or raid member.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_twilight.jpg',
    class: 'warlock',
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
    name: 'Shadowfury',
    spell_id: '30283',
    description: 'Stuns all enemies within 8 yards for 3 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warlock_shadowfurytga.jpg',
    class: 'warlock',
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
    name: 'Soulstone',
    spell_id: '20707',
    description: 'Stores the soul of the target party member, allowing them to resurrect upon death.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_soulgem.jpg',
    class: 'warlock',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Subjugate Demon',
    spell_id: '1098',
    description: 'Enslaves a demon, making it fight for you for 5 min.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_enslavedemon.jpg',
    class: 'warlock',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Summon Demon',
    spell_id: '30146',
    description: 'Summons a demon to fight for you.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_summonimp.jpg',
    class: 'warlock',
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
    name: 'Unending Breath',
    spell_id: '5697',
    description: 'Allows the target to breathe underwater for 10 min.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_demonbreath.jpg',
    class: 'warlock',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Unending Resolve',
    spell_id: '104773',
    description: 'Reduces all damage taken by 40% for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_demonictactics.jpg',
    class: 'warlock',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 180,
    range: 0,
    cost: 'None',
    cost_amount: 0
  }
];

// Spec/hero talent actives and replacements
const specAndHeroActives = [
  // Affliction spec actives
  {
    name: 'Corruption',
    spell_id: '172',
    description: 'Corrupts the target, causing Shadow damage over 14 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_abominationexplosion.jpg',
    class: 'warlock',
    spec: 'affliction',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 4,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Agony',
    spell_id: '980',
    description: 'Curses the target, causing Shadow damage over 18 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_curseofsargeras.jpg',
    class: 'warlock',
    spec: 'affliction',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Unstable Affliction',
    spell_id: '30108',
    description: 'Afflicts the target with unstable energy, causing Shadow damage over 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_unstableaffliction_3.jpg',
    class: 'warlock',
    spec: 'affliction',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Malefic Rapture',
    spell_id: '324536',
    description: 'Unleashes a burst of malefic energy, dealing Shadow damage to all enemies affected by your damage over time effects.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warlock_everlastingaffliction.jpg',
    class: 'warlock',
    spec: 'affliction',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Seed of Corruption',
    spell_id: '27243',
    description: 'Plants a demon seed in the target that explodes when the target takes damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_seedofdestruction.jpg',
    class: 'warlock',
    spec: 'affliction',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Shadow Bolt',
    spell_id: '686',
    description: 'Sends a shadowy bolt at the enemy, causing Shadow damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowbolt.jpg',
    class: 'warlock',
    spec: 'affliction',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 1,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Soul Rot',
    spell_id: '386997',
    description: 'Corrupts the target\'s soul, causing Shadow damage over 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_ardenweald_warlock.jpg',
    class: 'warlock',
    spec: 'affliction',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Phantom Singularity',
    spell_id: '205179',
    description: 'Creates a phantom singularity that pulls enemies toward it and deals Shadow damage over 16 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_enchant_voidsphere.jpg',
    class: 'warlock',
    spec: 'affliction',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 45,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Soulburn',
    spell_id: '74434',
    description: 'Consumes a Soul Shard to empower your next spell.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_warlock_soulburn.jpg',
    class: 'warlock',
    spec: 'affliction',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Dark Soul: Misery',
    spell_id: '113860',
    description: 'Increases your haste by 30% for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_warlock_soulburn.jpg',
    class: 'warlock',
    spec: 'affliction',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  // Demonology spec actives
  {
    name: 'Shadow Bolt',
    spell_id: '686',
    description: 'Sends a shadowy bolt at the enemy, causing Shadow damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowbolt.jpg',
    class: 'warlock',
    spec: 'demonology',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 1,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Call Dreadstalkers',
    spell_id: '104316',
    description: 'Summons two ferocious Dreadstalkers to attack the target for 12 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_warlock_calldreadstalkers.jpg',
    class: 'warlock',
    spec: 'demonology',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 20,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Demonic Strength',
    spell_id: '267171',
    description: 'Increases the damage of your next Hand of Gul\'dan by 50%.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warlock_demonicempowerment.jpg',
    class: 'warlock',
    spec: 'demonology',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Implosion',
    spell_id: '196277',
    description: 'Causes all your Wild Imps to explode, dealing Fire damage to all nearby enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_implosion.jpg',
    class: 'warlock',
    spec: 'demonology',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Corruption',
    spell_id: '172',
    description: 'Corrupts the target, causing Shadow damage over 14 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_abominationexplosion.jpg',
    class: 'warlock',
    spec: 'demonology',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 4,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Grimoire: Felguard',
    spell_id: '111898',
    description: 'Summons a Felguard to fight for you.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_demonicpact.jpg',
    class: 'warlock',
    spec: 'demonology',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Power Siphon',
    spell_id: '264130',
    description: 'Siphons power from your Wild Imps, increasing the damage of your next Demonbolt by 25% per Imp consumed.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warlock_backdraft.jpg',
    class: 'warlock',
    spec: 'demonology',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 45,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Demonbolt',
    spell_id: '264178',
    description: 'Sends a bolt of demonic energy at the target, dealing Shadow damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_warlock_demonbolt.jpg',
    class: 'warlock',
    spec: 'demonology',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Hand of Gul\'dan',
    spell_id: '105174',
    description: 'Calls down a demonic meteor filled with Wild Imps that burst forth to attack the target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warlock_handofguldan.jpg',
    class: 'warlock',
    spec: 'demonology',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Summon Vilefiend',
    spell_id: '264119',
    description: 'Summons a Vilefiend to fight for you for 15 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_argusfelstalkermount.jpg',
    class: 'warlock',
    spec: 'demonology',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 45,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Summon Demonic Tyrant',
    spell_id: '265187',
    description: 'Summons a Demonic Tyrant that increases the duration of all your demons by 15 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_summondemonictyrant.jpg',
    class: 'warlock',
    spec: 'demonology',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 90,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  // Destruction spec actives
  {
    name: 'Chaos Bolt',
    spell_id: '116858',
    description: 'Sends a bolt of chaotic fire at the target, dealing Fire damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warlock_chaosbolt.jpg',
    class: 'warlock',
    spec: 'destruction',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Conflagrate',
    spell_id: '17962',
    description: 'Consumes the Immolate effect on the target to deal Fire damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fireball.jpg',
    class: 'warlock',
    spec: 'destruction',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Immolate',
    spell_id: '348',
    description: 'Burns the target, causing Fire damage over 15 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_immolation.jpg',
    class: 'warlock',
    spec: 'destruction',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Summon Infernal',
    spell_id: '1122',
    description: 'Summons an Infernal that crashes down from the sky, dealing Fire damage to all enemies in the area.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_summoninfernal.jpg',
    class: 'warlock',
    spec: 'destruction',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 600,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Rain of Fire',
    spell_id: '5740',
    description: 'Calls down a rain of fire that deals Fire damage to all enemies in the area.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_rainoffire.jpg',
    class: 'warlock',
    spec: 'destruction',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Shadowburn',
    spell_id: '17877',
    description: 'Deals Shadow damage to the target and generates a Soul Shard if the target dies within 5 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_scourgebuild.jpg',
    class: 'warlock',
    spec: 'destruction',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 20,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Soul Fire',
    spell_id: '6353',
    description: 'Deals Fire damage to the target and generates a Soul Shard.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fireball02.jpg',
    class: 'warlock',
    spec: 'destruction',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  // Hero talent actives
  {
    name: 'Soul Harvest',
    spell_id: '196098',
    description: 'Harvests the souls of nearby enemies, increasing your damage for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warlock_soulharvest.jpg',
    class: 'warlock',
    spec: null,
    hero_talent: 'soul_harvester',
    ability_type: 'hero_talent',
    level_required: 0,
    cooldown: 90,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Wither',
    spell_id: '440507',
    description: 'Withers the target, causing Shadow damage over time and reducing their damage output.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_ability_hellcallerwarlock_wither.jpg',
    class: 'warlock',
    spec: null,
    hero_talent: 'hellcaller',
    ability_type: 'hero_talent',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Malevolence',
    spell_id: '440508',
    description: 'Unleashes malevolent energy, dealing Shadow damage to all enemies in a cone.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_ability_hellcallerwarlock_malevolence.jpg',
    class: 'warlock',
    spec: null,
    hero_talent: 'hellcaller',
    ability_type: 'hero_talent',
    level_required: 0,
    cooldown: 60,
    range: 0,
    cost: 'None',
    cost_amount: 0
  }
];

async function seedWarlockAbilities() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(Config.databaseURI);
    console.log('Connected.');

    const versions = await Version.find();
    if (!versions.length) {
      console.error('No versions found!');
      return;
    }

    // Delete all warlock abilities for all versions
    const del = await Ability.deleteMany({ class: 'warlock' });
    console.log(`Deleted ${del.deletedCount} warlock abilities.`);

    let created = 0;
    for (const version of versions) {
      // For each spec (including null for class abilities)
      const specs = [null, 'affliction', 'demonology', 'destruction'];
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
        // For hero talents, create them as-is (spec: null, hero_talent: 'soul_harvester')
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
    console.log(`Seeded ${created} warlock abilities for ${versions.length} versions.`);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedWarlockAbilities();
}

export default seedWarlockAbilities;
