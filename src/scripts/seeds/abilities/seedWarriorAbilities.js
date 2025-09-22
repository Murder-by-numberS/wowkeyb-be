import mongoose from 'mongoose';
import Ability from '../../../models/ability.js';
import Version from '../../../models/version.js';
import Config from '../../../config/config.js';

// Core/class warrior abilities (with .jpg icons)
const coreAbilities = [
  {
    name: 'Battle Shout',
    spell_id: '6673',
    description: 'Increases the attack power of party and raid members within 30 yards by 5 for 2 min.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_battleshout.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 1,
    cooldown: 0,
    range: 30,
    cost: 'Rage',
    cost_amount: 10
  },
  {
    name: 'Charge',
    spell_id: '100',
    description: 'Charges an enemy, causing 1 Physical damage and stunning it for 1 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 3,
    cooldown: 20,
    range: 25,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Rend',
    spell_id: '772',
    description: 'Wounds the target, causing 2 Physical damage instantly and an additional 1 Physical damage over 15 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_gouge.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 4,
    cooldown: 0,
    range: 5,
    cost: 'Rage',
    cost_amount: 20
  },
  {
    name: 'Thunder Clap',
    spell_id: '6343',
    description: 'Blasts enemies within 8 yards for 1 Physical damage and reduces their movement speed by 50% for 10 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_thunderclap.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 6,
    cooldown: 6,
    range: 8,
    cost: 'Rage',
    cost_amount: 30
  },
  {
    name: 'Hamstring',
    spell_id: '1715',
    description: 'Maims the target for 1 Physical damage and reduces movement speed by 50% for 15 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_shockwave.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 0,
    range: 5,
    cost: 'Rage',
    cost_amount: 20
  },
  {
    name: 'Execute',
    spell_id: '163201',
    description: 'Attempts to finish off a foe, causing 1 Physical damage. Only usable on enemies that have less than 20% health.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 12,
    cooldown: 0,
    range: 5,
    cost: 'Rage',
    cost_amount: 20
  },
  {
    name: 'Taunt',
    spell_id: '355',
    description: 'Taunts the target to attack you.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_reincarnation.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 16,
    cooldown: 8,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Intimidating Shout',
    spell_id: '5246',
    description: 'Causes the target to flee in fear for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_golemthunderclap.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 24,
    cooldown: 90,
    range: 8,
    cost: 'Rage',
    cost_amount: 25
  },
  {
    name: 'Berserker Rage',
    spell_id: '18499',
    description: 'Increases your attack power by 10 for 10 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_ancestralguardian.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 34,
    cooldown: 60,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Pummel',
    spell_id: '6552',
    description: 'Pummels the target, interrupting spellcasting and preventing any spell in that school from being cast for 4 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_gauntlets_04.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 10,
    range: 5,
    cost: 'Rage',
    cost_amount: 10
  },
  {
    name: 'Piercing Howl',
    spell_id: '12323',
    description: 'Causes all enemies within 10 yards to be dazed, reducing movement speed by 50% for 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_deathscream.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 10,
    cost: 'Rage',
    cost_amount: 10
  },
  {
    name: 'Challenging Shout',
    spell_id: '1161',
    description: 'Challenges all enemies within 10 yards to attack you for 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_bullrush.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 300,
    range: 10,
    cost: 'Rage',
    cost_amount: 25
  },
  {
    name: 'Shield Block',
    spell_id: '2565',
    description: 'Increases your block chance by 100% for 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_defend.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'Rage',
    cost_amount: 30
  },
  {
    name: 'Bitter Immunity',
    spell_id: '383762',
    description: 'Removes all harmful magical effects and makes you immune to them for 5 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_shamanrage.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 90,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Heroic Leap',
    spell_id: '6544',
    description: 'Leap through the air toward a target location, slamming down with destructive force to deal weapon damage to all enemies within 8 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_heroicleap.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 45,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Heroic Throw',
    spell_id: '57755',
    description: 'Throws your weapon at the enemy, causing weapon damage and interrupting spellcasting for 3 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_axe_66.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 6,
    range: 30,
    cost: 'Rage',
    cost_amount: 10
  },
  {
    name: 'Defensive Stance',
    spell_id: '71',
    description: 'A defensive combat stance that reduces damage taken by 10% and increases threat generation.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
    class: 'warrior',
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
    name: 'Thunderous Roar',
    spell_id: '384318',
    description: 'Release a thunderous roar, dealing weapon damage to all enemies within 10 yards and reducing their movement speed by 50% for 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_dragonroar.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 90,
    range: 10,
    cost: 'Rage',
    cost_amount: 30
  },
  {
    name: 'Avatar',
    spell_id: '107574',
    description: 'Transform into a colossus for 20 sec, breaking you free from all movement impairing effects and increasing your damage dealt by 20%.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/warrior_talent_icon_avatar.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 90,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Champion\'s Spear',
    spell_id: '376079',
    description: 'Throw a spear at the target, dealing weapon damage and rooting them in place for 3 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_ability_warrior_championsspear.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 30,
    range: 30,
    cost: 'Rage',
    cost_amount: 20
  },
  {
    name: 'Storm Bolt',
    spell_id: '107570',
    description: 'Hurls your weapon at an enemy, causing weapon damage and stunning for 4 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/warrior_talent_icon_stormbolt.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 30,
    range: 20,
    cost: 'Rage',
    cost_amount: 20
  },
  {
    name: 'Wrecking Throw',
    spell_id: '384110',
    description: 'Throw your weapon at the enemy, causing weapon damage and removing all magical effects.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/warrior_talent_icon_mastercleaver.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 45,
    range: 30,
    cost: 'Rage',
    cost_amount: 30
  },
  {
    name: 'Shattering Throw',
    spell_id: '64382',
    description: 'Throws your weapon at the enemy, causing weapon damage and removing all magical effects.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_shatteringthrow.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 45,
    range: 30,
    cost: 'Rage',
    cost_amount: 30
  },
  {
    name: 'Shockwave',
    spell_id: '46968',
    description: 'Sends a wave of force in front of you, causing weapon damage to all enemies within 10 yards and stunning them for 2 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_shockwave.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 40,
    range: 10,
    cost: 'Rage',
    cost_amount: 20
  },
  {
    name: 'Victory Rush',
    spell_id: '34428',
    description: 'Instantly attack the target, causing weapon damage and healing you for 20% of your maximum health.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_devastate.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Impending Victory',
    spell_id: '202168',
    description: 'Instantly attack the target, causing weapon damage and healing you for 20% of your maximum health.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_impending_victory.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Whirlwind',
    spell_id: '1680',
    description: 'Instantly whirl around, attacking all enemies within 8 yards for weapon damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_whirlwind.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 8,
    cost: 'Rage',
    cost_amount: 25
  },
  {
    name: 'Slam',
    spell_id: '1464',
    description: 'Slam the target with your weapon, causing weapon damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_decisivestrike.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Rage',
    cost_amount: 20
  },
  {
    name: 'Rallying Cry',
    spell_id: '97462',
    description: 'Temporarily increases the maximum health of all party and raid members within 30 yards by 15% for 10 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_rallyingcry.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 180,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Intervene',
    spell_id: '3411',
    description: 'Run at high speed toward a party or raid member, intercepting the next melee or ranged attack made against them.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_victoryrush.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 30,
    range: 25,
    cost: 'Rage',
    cost_amount: 15
  },
  {
    name: 'Spell Reflection',
    spell_id: '23920',
    description: 'Reflects the next spell cast on you back to the caster.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_shieldreflection.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 25,
    range: 0,
    cost: 'Rage',
    cost_amount: 20
  },
  {
    name: 'Ravager',
    spell_id: '152277',
    description: 'Throw a whirling axe at the target location that rapidly spins for 12 sec, dealing weapon damage to all enemies within 8 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/warrior_talent_icon_ravager.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 60,
    range: 30,
    cost: 'Rage',
    cost_amount: 30
  },
  {
    name: 'Shield Slam',
    spell_id: '23922',
    description: 'Slam the target with your shield, causing weapon damage and generating 20 Rage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_shield_05.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 6,
    range: 5,
    cost: 'None',
    cost_amount: 0
  }
];

// Spec/hero talent actives and replacements
const specAndHeroActives = [
  // Arms spec actives
  {
    name: 'Mortal Strike',
    spell_id: '12294',
    description: 'A vicious strike that deals weapon damage and reduces the effectiveness of healing on the target by 50% for 10 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_savageblow.jpg',
    class: 'warrior',
    spec: 'arms',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 6,
    range: 5,
    cost: 'Rage',
    cost_amount: 30
  },
  {
    name: 'Overpower',
    spell_id: '7384',
    description: 'Overpower the enemy, causing weapon damage. Cannot be blocked, dodged, or parried.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_meleedamage.jpg',
    class: 'warrior',
    spec: 'arms',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Rage',
    cost_amount: 20
  },
  {
    name: 'Bladestorm',
    spell_id: '46924',
    description: 'Instantly whirl around, attacking all enemies within 8 yards for weapon damage every 1 sec for 4 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_bladestorm.jpg',
    class: 'warrior',
    spec: 'arms',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 90,
    range: 8,
    cost: 'Rage',
    cost_amount: 25
  },
  {
    name: 'Colossus Smash',
    spell_id: '167105',
    description: 'Smash the target\'s armor, dealing weapon damage and increasing damage dealt to the target by 30% for 10 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_colossussmash.jpg',
    class: 'warrior',
    spec: 'arms',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 45,
    range: 5,
    cost: 'Rage',
    cost_amount: 20
  },
  {
    name: 'Warbreaker',
    spell_id: '262161',
    description: 'Shatters the armor of all enemies within 8 yards, dealing weapon damage and increasing damage dealt to them by 30% for 10 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_warbreaker.jpg',
    class: 'warrior',
    spec: 'arms',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 8,
    cost: 'Rage',
    cost_amount: 30
  },
  {
    name: 'Battle Stance',
    spell_id: '2457',
    description: 'A balanced combat stance.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_offensivestance.jpg',
    class: 'warrior',
    spec: 'arms',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Cleave',
    spell_id: '845',
    description: 'A sweeping strike that hits the target and up to 2 additional enemies for weapon damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_cleave.jpg',
    class: 'warrior',
    spec: 'arms',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Rage',
    cost_amount: 20
  },
  {
    name: 'Die by the Sword',
    spell_id: '118038',
    description: 'Increases your parry chance by 100% and reduces all damage you take by 20% for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_challange.jpg',
    class: 'warrior',
    spec: 'arms',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Skullsplitter',
    spell_id: '260643',
    description: 'Splits the target\'s skull, dealing weapon damage and causing them to bleed for additional damage over 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_skullsplitter.jpg',
    class: 'warrior',
    spec: 'arms',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 21,
    range: 5,
    cost: 'Rage',
    cost_amount: 30
  },
  {
    name: 'Ignore Pain',
    spell_id: '190456',
    description: 'Ignore the next 30% of damage you take for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_renewedvigor.jpg',
    class: 'warrior',
    spec: 'arms',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'Rage',
    cost_amount: 40
  },
  // Fury spec actives
  {
    name: 'Bloodthirst',
    spell_id: '23881',
    description: 'Instantly attack the target, causing weapon damage and healing you for 5% of your maximum health.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_bloodlust.jpg',
    class: 'warrior',
    spec: 'fury',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 4.5,
    range: 5,
    cost: 'Rage',
    cost_amount: 20
  },
  {
    name: 'Raging Blow',
    spell_id: '85288',
    description: 'A mighty blow that deals weapon damage. Generates 10 Rage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/warrior_wild_strike.jpg',
    class: 'warrior',
    spec: 'fury',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Rampage',
    spell_id: '184367',
    description: 'Unleash a series of 4 powerful attacks for weapon damage each.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_rampage.jpg',
    class: 'warrior',
    spec: 'fury',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Rage',
    cost_amount: 80
  },
  {
    name: 'Recklessness',
    spell_id: '1719',
    description: 'Increases your attack power by 20 and your critical strike chance by 20% for 15 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/warrior_talent_icon_innerrage.jpg',
    class: 'warrior',
    spec: 'fury',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 90,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Odyn\'s Fury',
    spell_id: '205545',
    description: 'Unleash Odyn\'s fury, dealing weapon damage to all enemies within 8 yards over 4 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_1h_artifactvigfus_d_01.jpg',
    class: 'warrior',
    spec: 'fury',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 45,
    range: 8,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Siegebreaker',
    spell_id: '280772',
    description: 'Shatters the target\'s armor, dealing weapon damage and increasing damage dealt to the target by 30% for 10 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_mace_101.jpg',
    class: 'warrior',
    spec: 'fury',
    hero_talent: null,
    ability_type: 'spec',
    cooldown: 45,
    range: 5,
    cost: 'Rage',
    cost_amount: 20
  },
  {
    name: 'Berserker Stance',
    spell_id: '2458',
    description: 'An aggressive combat stance that increases damage dealt by 3% and reduces armor by 10%.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_racial_avatar.jpg',
    class: 'warrior',
    spec: 'fury',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Enraged Regeneration',
    spell_id: '184364',
    description: 'Instantly heal for 30% of your maximum health and for an additional 30% over 5 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_focusedrage.jpg',
    class: 'warrior',
    spec: 'fury',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Onslaught',
    spell_id: '315720',
    description: 'Charge to an enemy, dealing weapon damage and stunning them for 1.5 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_trauma.jpg',
    class: 'warrior',
    spec: 'fury',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 45,
    range: 25,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Bladestorm',
    spell_id: '46924',
    description: 'Instantly whirl around, attacking all enemies within 8 yards for weapon damage every 1 sec for 4 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_bladestorm.jpg',
    class: 'warrior',
    spec: 'fury',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 90,
    range: 8,
    cost: 'Rage',
    cost_amount: 25
  },
  // Protection spec actives
  {
    name: 'Revenge',
    spell_id: '6572',
    description: 'Take revenge on the enemies that have attacked you, dealing weapon damage to up to 2 enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_revenge.jpg',
    class: 'warrior',
    spec: 'protection',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Rage',
    cost_amount: 30
  },
  {
    name: 'Devastate',
    spell_id: '20243',
    description: 'Sunder the target\'s armor, dealing weapon damage and applying Sunder Armor.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_11.jpg',
    class: 'warrior',
    spec: 'protection',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Rage',
    cost_amount: 15
  },
  {
    name: 'Shield Wall',
    spell_id: '871',
    description: 'Reduces all damage you take by 40% for 12 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_shieldwall.jpg',
    class: 'warrior',
    spec: 'protection',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 240,
    range: 0,
    cost: 'Rage',
    cost_amount: 30
  },
  {
    name: 'Last Stand',
    spell_id: '12975',
    description: 'Temporarily increases your maximum health by 30% for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_ashestoashes.jpg',
    class: 'warrior',
    spec: 'protection',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 180,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Shield Charge',
    spell_id: '385952',
    description: 'Charge to an enemy, dealing weapon damage and stunning them for 1.5 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_shieldcharge.jpg',
    class: 'warrior',
    spec: 'protection',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 45,
    range: 25,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Ignore Pain',
    spell_id: '190456',
    description: 'Ignore the next 30% of damage you take for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_renewedvigor.jpg',
    class: 'warrior',
    spec: 'protection',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'Rage',
    cost_amount: 40
  },
  {
    name: 'Disrupting Shout',
    spell_id: '386071',
    description: 'Let out a shout that interrupts and silences all enemies within 10 yards for 3 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_bullrush.jpg',
    class: 'warrior',
    spec: 'protection',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 40,
    range: 10,
    cost: 'Rage',
    cost_amount: 20
  },
  {
    name: 'Battle Stance',
    spell_id: '2457',
    description: 'A balanced combat stance.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_offensivestance.jpg',
    class: 'warrior',
    spec: 'protection',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Demoralizing Shout',
    spell_id: '1160',
    description: 'Reduces the attack power of all enemies within 10 yards by 5 for 30 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
    class: 'warrior',
    spec: 'protection',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 22,
    cooldown: 0,
    range: 10,
    cost: 'Rage',
    cost_amount: 10
  },
  {
    name: 'Demolish',
    spell_id: '383916',
    description: 'Demolish the target, dealing weapon damage and reducing their armor by 20% for 10 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_ability_colossuswarrior_demolish.jpg',
    class: 'warrior',
    spec: null,
    hero_talent: 'colossus',
    ability_type: 'hero_talent',
    level_required: 0,
    cooldown: 45,
    range: 5,
    cost: 'Rage',
    cost_amount: 30
  }
];

async function seedWarriorAbilities() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(Config.databaseURI);
    console.log('Connected.');

    // Get all versions created before 11.2.0
    const version1120 = await Version.findOne({ game_version: '11.2.0' });
    let versions;

    if (version1120) {
      versions = await Version.find({ createdAt: { $lt: version1120.createdAt } });
    } else {
      versions = await Version.find();
    }

    if (!versions.length) {
      console.error('No versions found before 11.2.0!');
      return;
    }

    // Delete all warrior abilities for all versions
    const del = await Ability.deleteMany({ class: 'warrior' });
    console.log(`Deleted ${del.deletedCount} warrior abilities.`);

    let created = 0;
    for (const version of versions) {
      // --- Seed core/class abilities once per version (available to all specs) ---
      for (const ability of coreAbilities) {
        await Ability.create({ ...ability, spec: null, game_version: version._id });
        created++;
      }

      // --- Seed spec-specific abilities ---
      const specs = ['arms', 'fury', 'protection'];
      for (const spec of specs) {
        // Check for spec-level replacements
        for (const ability of coreAbilities) {
          const specReplaced = specAndHeroActives.find(a =>
            a.replaces === ability.name &&
            a.spec === spec &&
            a.hero_talent === null
          );

          // Check for hero talent replacements (for all hero talents of this spec)
          const heroTalentReplaced = specAndHeroActives.find(a =>
            a.replaces === ability.name &&
            a.spec === spec &&
            a.hero_talent !== null
          );

          if (specReplaced || heroTalentReplaced) continue;
          // Don't create core abilities again for individual specs
        }
      }
      // --- Seed spec/hero actives, handling replacements ---
      for (const ability of specAndHeroActives) {
        await Ability.create({ ...ability, game_version: version._id });
        created++;
      }
    }
    console.log(`Seeded ${created} warrior abilities for ${versions.length} versions.`);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedWarriorAbilities();
}

export default seedWarriorAbilities;
