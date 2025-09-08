import mongoose from 'mongoose';
import Ability from '../../../models/ability.js';
import Version from '../../../models/version.js';
import Config from '../../../config/config.js';

// Core/class mage abilities
const coreAbilities = [
  {
    name: 'Arcane Intellect',
    spell_id: '1459',
    description: 'Increases the target\'s Intellect by 5 for 1 hour.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 1,
    cooldown: 0,
    range: 30,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Arcane Explosion',
    spell_id: '1449',
    description: 'Causes an explosion of arcane magic around the caster, dealing Arcane damage to all nearby enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_wispsplode.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 1,
    cooldown: 0,
    range: 10,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Polymorph',
    spell_id: '118',
    description: 'Transforms the enemy into a sheep, forcing them to wander around for up to 50 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_polymorph.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 8,
    cooldown: 0,
    range: 30,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Conjure Refreshment',
    spell_id: '42955',
    description: 'Conjures 5 pieces of food and 5 bottles of water that can be consumed to restore health and mana.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_food_73cinnamonroll.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 0,
    range: 0,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Blink',
    spell_id: '1953',
    description: 'Teleports you 20 yards forward in the direction you are facing.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_blink.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 20,
    cooldown: 15,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Counterspell',
    spell_id: '2139',
    description: 'Counters an enemy\'s spellcast, preventing any spell in that school from being cast for 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_iceshock.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 24,
    cooldown: 24,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Remove Curse',
    spell_id: '475',
    description: 'Removes 1 Curse from a friendly target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_removecurse.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 28,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Teleport',
    spell_id: '3561',
    description: 'Teleports you to a major city.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_teleportstormwind.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 30,
    cooldown: 0,
    range: 0,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Portal',
    spell_id: '10059',
    description: 'Creates a portal, teleporting group members that use it to a major city.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_portalstormwind.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 40,
    cooldown: 0,
    range: 0,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Invisibility',
    spell_id: '66',
    description: 'Makes you invisible for 20 sec, reducing threat each second.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_mage_invisibility.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 40,
    cooldown: 300,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Spellsteal',
    spell_id: '30449',
    description: 'Steals a beneficial magic effect from the target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcane02.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 50,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Time Warp',
    spell_id: '80353',
    description: 'Increases haste by 30% for all party and raid members for 40 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_mage_timewarp.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 60,
    cooldown: 300,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Cone of Cold',
    spell_id: '120',
    description: 'Targets in a cone in front of you take Frost damage and have their movement speed reduced by 50% for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_glacier.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 12,
    range: 12,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Frost Nova',
    spell_id: '122',
    description: 'Blasts enemies within 10 yards for Frost damage and freezes them in place for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostnova.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 30,
    range: 10,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Ice Nova',
    spell_id: '157997',
    description: 'Causes an explosion of ice around the target, dealing Frost damage to all enemies within 8 yards and freezing them in place for 2 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_mage_icenova.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 25,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Greater Invisibility',
    spell_id: '110959',
    description: 'Makes you invisible for 20 sec, reducing threat each second. While invisible, you are untargetable by enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_mage_greaterinvisibility.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Ice Cold',
    spell_id: '414658',
    description: 'Your blood runs cold, reducing all damage you take by 70% for 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_bluefire.jpg',
    class: 'mage',
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
    name: 'Mass Barrier',
    spell_id: '414660',
    description: 'Creates a barrier that absorbs damage for all party and raid members within 30 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_racial_magicalresistance.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 180,
    range: 30,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Mirror Image',
    spell_id: '55342',
    description: 'Creates 3 copies of yourself nearby for 40 sec, which cast spells and attack your enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_magic_managain.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Shifting Power',
    spell_id: '382440',
    description: 'Draw power from the Ley Lines beneath you, dealing Arcane damage to enemies within 8 yards over 4 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_ardenweald_mage.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 60,
    range: 8,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Shimmer',
    spell_id: '212653',
    description: 'Teleports you 20 yards forward in the direction you are facing.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_massdispel.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 20,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Slow Fall',
    spell_id: '130',
    description: 'Allows you to fall slowly for 30 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_magic_featherfall.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Mass Polymorph',
    spell_id: '383121',
    description: 'Transforms all enemies within 8 yards into sheep, forcing them to wander around for up to 50 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_doublepolymorph1.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 8,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Slow',
    spell_id: '31589',
    description: 'Reduces the target\'s movement speed by 50% for 15 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_slow.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Blast Wave',
    spell_id: '157981',
    description: 'Causes an explosion of arcane energy around you, dealing Arcane damage to all nearby enemies and knocking them back.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_excorcism_02.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 25,
    range: 10,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Displacement',
    spell_id: '389713',
    description: 'Teleports you back to your previous location.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_displacement.jpg',
    class: 'mage',
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
    name: 'Supernova',
    spell_id: '157980',
    description: 'Causes an explosion of arcane energy around the target, dealing Arcane damage to all enemies within 8 yards and knocking them back.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_mage_supernova.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 25,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Alter Time',
    spell_id: '342245',
    description: 'Alters the flow of time, returning your health, mana, and position to where they were 10 sec ago.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_mage_altertime.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Ring of Frost',
    spell_id: '113724',
    description: 'Creates a ring of ice at the target location that freezes enemies for 10 sec when they enter it.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_ring-of-frost.jpg',
    class: 'mage',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 45,
    range: 30,
    cost: 'Mana',
    cost_amount: 0
  }
];

// Spec/hero talent actives and replacements
const specAndHeroActives = [
  // Arcane spec actives
  {
    name: 'Arcane Blast',
    spell_id: '30451',
    description: 'Blasts the target with energy, dealing Arcane damage. Each time you cast Arcane Blast, the damage of subsequent Arcane Blasts is increased by 15% and mana cost is increased by 200%.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_blast.jpg',
    class: 'mage',
    spec: 'arcane',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Arcane Barrage',
    spell_id: '44425',
    description: 'Launches several missiles at the enemy target, causing Arcane damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_mage_arcanebarrage.jpg',
    class: 'mage',
    spec: 'arcane',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Arcane Power',
    spell_id: '12042',
    description: 'Increases your damage by 20% and mana cost by 20% for 15 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_lightning.jpg',
    class: 'mage',
    spec: 'arcane',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Presence of Mind',
    spell_id: '205025',
    description: 'Your next spell with a cast time less than 10 sec becomes an instant cast spell.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_enchantarmor.jpg',
    class: 'mage',
    spec: 'arcane',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Evocation',
    spell_id: '12051',
    description: 'Increases your mana regeneration by 1500% for 3 sec and grants Clearcasting.\n\nWhile channeling Evocation, your Intellect is increased by 2% every 0.5 sec. Lasts 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_purge.jpg',
    class: 'mage',
    spec: 'arcane',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 240,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Arcane Missiles',
    spell_id: '5143',
    description: 'Launches magical missiles at an enemy, causing Arcane damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_starfall.jpg',
    class: 'mage',
    spec: 'arcane',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Arcane Orb',
    spell_id: '153626',
    description: 'Launches an orb of pure arcane energy at the target, dealing Arcane damage to the target and all enemies it passes through.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_mage_arcaneorb.jpg',
    class: 'mage',
    spec: 'arcane',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Prismatic Barrier',
    spell_id: '235450',
    description: 'Shields you with arcane energy, absorbing damage and reflecting some damage back to attackers.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_magearmor.jpg',
    class: 'mage',
    spec: 'arcane',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 25,
    range: 0,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Arcane Surge',
    spell_id: '365350',
    description: 'Unleashes pure arcane energy, dealing massive Arcane damage to the target and increasing your damage by 25% for 15 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_mage_arcanesurge.jpg',
    class: 'mage',
    spec: 'arcane',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 90,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Touch of the Magi',
    spell_id: '321507',
    description: 'Marks the target with Arcane energy for 8 sec. When the mark expires, it explodes for Arcane damage to the target and all nearby enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_mage_netherwindpresence.jpg',
    class: 'mage',
    spec: 'arcane',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Fireball',
    spell_id: '133',
    description: 'Launches a fiery ball that causes Fire damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_flamebolt.jpg',
    class: 'mage',
    spec: 'fire',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Fire Blast',
    spell_id: '2136',
    description: 'Blasts the enemy for Fire damage.\n\nAnd castable while casting other spells. Always deals a critical strike.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fireball.jpg',
    class: 'mage',
    spec: 'fire',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 0,
    range: 30,
    cost: 'Mana',
    cost_amount: 0
  },
  // Fire spec actives
  {
    name: 'Combustion',
    spell_id: '190319',
    description: 'Engulfs you in flames for 10 sec, increasing your critical strike chance by 100% and allowing your Fire damage over time effects to critically strike.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_sealoffire.jpg',
    class: 'mage',
    spec: 'fire',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Dragon\'s Breath',
    spell_id: '31661',
    description: 'Blasts targets in front of you with a cone of flame, causing Fire damage and disorienting them for 4 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_head_dragon_01.jpg',
    class: 'mage',
    spec: 'fire',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 20,
    range: 10,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Phoenix Flames',
    spell_id: '194466',
    description: 'Hurls a Phoenix that deals Fire damage to the target and reduces the cooldown of Fire Blast.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_summerfest_firespirit.jpg',
    class: 'mage',
    spec: 'fire',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 25,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Living Bomb',
    spell_id: '44457',
    description: 'The target becomes a Living Bomb, taking Fire damage over 12 sec. When Living Bomb expires or is dispelled, the target explodes dealing Fire damage to nearby enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_mage_livingbomb.jpg',
    class: 'mage',
    spec: 'fire',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Meteor',
    spell_id: '153561',
    description: 'Calls down a meteor that lands at the target location after 3 sec, dealing Fire damage to all enemies within 8 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_mage_meteor.jpg',
    class: 'mage',
    spec: 'fire',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 45,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Blazing Barrier',
    spell_id: '235313',
    description: 'Shields you with fire, absorbing damage and reflecting some damage back to attackers.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_mage_moltenarmor.jpg',
    class: 'mage',
    spec: 'fire',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 25,
    range: 0,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Flamestrike',
    spell_id: '2120',
    description: 'Calls down a pillar of fire at the target location, dealing Fire damage to all enemies within 8 yards over 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_selfdestruct.jpg',
    class: 'mage',
    spec: 'fire',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Pyroblast',
    spell_id: '11366',
    description: 'Hurls an immense fiery boulder that causes Fire damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fireball02.jpg',
    class: 'mage',
    spec: 'fire',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Scorch',
    spell_id: '2948',
    description: 'Scorches an enemy for Fire damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_soulburn.jpg',
    class: 'mage',
    spec: 'fire',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  // Frost spec actives
  {
    name: 'Frostbolt',
    spell_id: '116',
    description: 'Launches a bolt of frost at the enemy, causing Frost damage and slowing movement speed.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostbolt02.jpg',
    class: 'mage',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Ice Lance',
    spell_id: '30455',
    description: 'Quickly fling a shard of ice at the target, dealing Frost damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostblast.jpg',
    class: 'mage',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Frozen Orb',
    spell_id: '84714',
    description: 'Launches an orb of swirling ice up to 40 yards forward which deals Frost damage to enemies it passes through.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frozenorb.jpg',
    class: 'mage',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Icy Veins',
    spell_id: '12472',
    description: 'Increases your haste by 30% for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_coldhearted.jpg',
    class: 'mage',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 180,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Blizzard',
    spell_id: '10',
    description: 'Ice shards pelt the target area, dealing Frost damage over 8 sec and slowing movement by 50%.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_icestorm.jpg',
    class: 'mage',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Ice Barrier',
    spell_id: '11426',
    description: 'Shields you with ice, absorbing damage for 1 min.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_ice_lament.jpg',
    class: 'mage',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 25,
    range: 0,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Flurry',
    spell_id: '44614',
    description: 'Launches a volley of ice shards at the target, dealing Frost damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostbolt.jpg',
    class: 'mage',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Cold Snap',
    spell_id: '11958',
    description: 'Resets the cooldown of your Frost spells.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_wizardmark.jpg',
    class: 'mage',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 300,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Frostfire Bolt',
    spell_id: '44614',
    description: 'Launches a bolt of frostfire at the target, dealing Frost and Fire damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_ability_frostfiremage_frostfirebolt.jpg',
    class: 'mage',
    spec: null,
    hero_talent: 'frostfire',
    ability_type: 'hero_talent',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Comet Storm',
    spell_id: '153595',
    description: 'Calls down a series of icy comets on and around the target, dealing Frost damage to all enemies within 6 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_mage_cometstorm.jpg',
    class: 'mage',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Glacial Spike',
    spell_id: '199786',
    description: 'Launches a massive spike of ice at the target, dealing Frost damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_mage_glacialspike.jpg',
    class: 'mage',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Ray of Frost',
    spell_id: '205021',
    description: 'Channels a beam of frost at the target, dealing Frost damage over 5 sec and slowing their movement speed.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_mage_rayoffrost.jpg',
    class: 'mage',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Fire Blast',
    spell_id: '2136',
    description: 'Instantly blasts an enemy for Fire damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fireball.jpg',
    class: 'mage',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'Mana',
    cost_amount: 0
  }
];

async function seedMageAbilities() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(Config.databaseURI);
    console.log('Connected.');

    const versions = await Version.find();
    if (!versions.length) {
      console.error('No versions found!');
      return;
    }

    // Delete all mage abilities for all versions
    const del = await Ability.deleteMany({ class: 'mage' });
    console.log(`Deleted ${del.deletedCount} mage abilities.`);

    let created = 0;
    for (const version of versions) {
      // --- Seed core/class abilities once per version (available to all specs) ---
      for (const ability of coreAbilities) {
        await Ability.create({ ...ability, spec: null, game_version: version._id });
        created++;
      }

      // --- Seed spec-specific abilities ---
      const specs = ['arcane', 'fire', 'frost'];
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
        // For hero talents, create them as-is (spec: null, hero_talent: 'frostfire')
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
    console.log(`Seeded ${created} mage abilities for ${versions.length} versions.`);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedMageAbilities();
}

export default seedMageAbilities;
