import mongoose from 'mongoose';
import Ability from '../../../models/ability.js';
import Version from '../../../models/version.js';
import Config from '../../../config/config.js';

// Core/class rogue abilities (with .jpg icons)
const coreAbilities = [
  {
    name: 'Blind',
    spell_id: '2094',
    description: 'Blinds the target, causing it to wander disoriented for 1 min.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindsteal.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 18,
    cooldown: 120,
    range: 10,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Cheap Shot',
    spell_id: '1833',
    description: 'Stuns the target for 4 sec. Must be stealthed.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_cheapshot.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 30,
    cooldown: 0,
    range: 5,
    cost: 'Energy',
    cost_amount: 40
  },
  {
    name: 'Cold Blood',
    spell_id: '14177',
    description: 'When activated, increases the critical strike chance of your next offensive ability by 100%.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_ice_lament.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 180,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Cloak of Shadows',
    spell_id: '31224',
    description: 'Provides a brief immunity to all magical damage and harmful effects.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_nethercloak.jpg',
    class: 'rogue',
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
    name: 'Crimson Vial',
    spell_id: '185311',
    description: 'Drink from your crimson vial, healing you for 30% of your maximum health over 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_crimsonvial.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 30,
    range: 0,
    cost: 'Energy',
    cost_amount: 30
  },
  {
    name: 'Dismantle',
    spell_id: '207777',
    description: 'Disarm the target\'s weapons and shield for 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_dismantle.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 45,
    range: 5,
    cost: 'Energy',
    cost_amount: 30
  },
  {
    name: 'Distract',
    spell_id: '1725',
    description: 'Distract the target, causing it to turn around.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_distract.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 22,
    cooldown: 30,
    range: 20,
    cost: 'Energy',
    cost_amount: 30
  },
  {
    name: 'Eviscerate',
    spell_id: '196819',
    description: 'Finishing move that causes Physical damage per combo point.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_eviscerate.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 3,
    cooldown: 0,
    range: 5,
    cost: 'Combo Points',
    cost_amount: 1
  },
  {
    name: 'Evasion',
    spell_id: '5277',
    description: 'Increases your dodge chance by 100% for 10 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowward.jpg',
    class: 'rogue',
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
    name: 'Expose Armor',
    spell_id: '8647',
    description: 'Finishing move that reduces the target\'s armor by 20% for 30 sec per combo point.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_riposte.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 40,
    cooldown: 0,
    range: 5,
    cost: 'Combo Points',
    cost_amount: 1
  },
  {
    name: 'Feint',
    spell_id: '1966',
    description: 'Reduces the area damage you take by 30% for 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_feint.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 28,
    cooldown: 15,
    range: 0,
    cost: 'Energy',
    cost_amount: 35
  },
  {
    name: 'Gouge',
    spell_id: '1776',
    description: 'Gouge the target, stunning them for 4 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_gouge.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 0,
    range: 5,
    cost: 'Energy',
    cost_amount: 25
  },
  {
    name: 'Kidney Shot',
    spell_id: '408',
    description: 'Finishing move that stuns the target for 1 sec per combo point.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_kidneyshot.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 38,
    cooldown: 0,
    range: 5,
    cost: 'Combo Points',
    cost_amount: 1
  },
  {
    name: 'Kick',
    spell_id: '1766',
    description: 'A quick kick that interrupts spellcasting and prevents any spell in that school from being cast for 3 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_kick.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 16,
    cooldown: 15,
    range: 5,
    cost: 'Energy',
    cost_amount: 25
  },
  {
    name: 'Numbing Poison',
    spell_id: '5761',
    description: 'Coats your weapons with a poison that lasts for 1 hour. Each strike has a 30% chance of poisoning the enemy for 12 sec, reducing their damage by 10%.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_creature_poison_03.jpg',
    class: 'rogue',
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
    name: 'Atrophic Poison',
    spell_id: '2818',
    description: 'Coats your weapons with a poison that lasts for 1 hour. Each strike has a 30% chance of poisoning the enemy for 12 sec, reducing their healing received by 10%.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_creature_poison_06.jpg',
    class: 'rogue',
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
    name: 'Pick Lock',
    spell_id: '1804',
    description: 'Attempt to pick the lock on a locked object.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_moonkey.jpg',
    class: 'rogue',
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
    name: 'Pick Pocket',
    spell_id: '921',
    description: 'Steal from the target, taking a small amount of money.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_11.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 6,
    cooldown: 0.5,
    range: 5,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Sap',
    spell_id: '6770',
    description: 'Incapacitates the target for up to 1 min. Only works on Humanoids, Beasts, and Dragonkin that are not in combat.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_sap.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 8,
    cooldown: 0,
    range: 5,
    cost: 'Energy',
    cost_amount: 35
  },
  {
    name: 'Shadowstep',
    spell_id: '36554',
    description: 'Step through the shadows to appear behind your target and increase movement speed by 70% for 2 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_shadowstep.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 20,
    range: 25,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Shiv',
    spell_id: '5938',
    description: 'Attack with your off-hand, causing Physical damage and applying a poison effect.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_throwingknife_04.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 25,
    range: 5,
    cost: 'Energy',
    cost_amount: 20
  },
  {
    name: 'Shroud of Concealment',
    spell_id: '114018',
    description: 'Conceals you and your party members within 10 yards in shadows for 15 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_shroudofconcealment.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 120,
    range: 10,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Sinister Strike',
    spell_id: '193315',
    description: 'An instant strike that causes Physical damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 1,
    cooldown: 0,
    range: 5,
    cost: 'Energy',
    cost_amount: 45
  },
  {
    name: 'Slice and Dice',
    spell_id: '315341',
    description: 'Finishing move that increases attack speed by 40% for 12 sec per combo point.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_slicedice.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 36,
    cooldown: 0,
    range: 0,
    cost: 'Combo Points',
    cost_amount: 1
  },
  {
    name: 'Sprint',
    spell_id: '2983',
    description: 'Increases your movement speed by 70% for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
    class: 'rogue',
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
    name: 'Stealth',
    spell_id: '1784',
    description: 'Conceals you in the shadows until cancelled, allowing you to stalk enemies without being seen.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 4,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Thistle Tea',
    spell_id: '9512',
    description: 'Drink thistle tea, restoring 100 Energy over 10 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_drink_milk_05.jpg',
    class: 'rogue',
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
    name: 'Tricks of the Trade',
    spell_id: '57934',
    description: 'Redirects all threat you cause to the targeted party or raid member, beginning with your next damaging attack within 30 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_tricksofthetrade.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 30,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Vanish',
    spell_id: '1856',
    description: 'Allows you to vanish from sight, entering an improved stealth mode.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_vanish.jpg',
    class: 'rogue',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 24,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  }
];

// Spec/hero talent actives and replacements
const specAndHeroActives = [
  // Assassination spec actives
  {
    name: 'Ambush',
    spell_id: '8676',
    description: 'Ambush the target, causing Physical damage. Must be stealthed.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_ambush.jpg',
    class: 'rogue',
    spec: 'assassination',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 34,
    cooldown: 0,
    range: 5,
    cost: 'Energy',
    cost_amount: 50
  },
  {
    name: 'Amplifying Poison',
    spell_id: '381664',
    description: 'Coats your weapons with a poison that lasts for 1 hour. Each strike has a 30% chance of poisoning the enemy for 12 sec, increasing your damage dealt to them by 10%.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_herb_fellotus.jpg',
    class: 'rogue',
    spec: 'assassination',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Crimson Tempest',
    spell_id: '121411',
    description: 'Finishing move that deals Physical damage to all enemies within 8 yards and causes them to bleed for additional damage over 4 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_knife_1h_cataclysm_c_01.jpg',
    class: 'rogue',
    spec: 'assassination',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 8,
    cost: 'Combo Points',
    cost_amount: 1
  },
  {
    name: 'Deadly Poison',
    spell_id: '2823',
    description: 'Coats your weapons with a poison that lasts for 1 hour. Each strike has a 30% chance of poisoning the enemy for 12 sec, dealing Nature damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_dualweild.jpg',
    class: 'rogue',
    spec: 'assassination',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Deathmark',
    spell_id: '360194',
    description: 'Apply Deathmark to the target, dealing Shadow damage and applying your active poisons.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_deathmark.jpg',
    class: 'rogue',
    spec: 'assassination',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Envenom',
    spell_id: '32645',
    description: 'Finishing move that consumes your Deadly Poison on the target to instantly deal Nature damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_creature_poison_06.jpg',
    class: 'rogue',
    spec: 'assassination',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Combo Points',
    cost_amount: 1
  },
  {
    name: 'Fan of Knives',
    spell_id: '51723',
    description: 'Throw knives at all enemies within 8 yards, dealing Physical damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_fanofknives.jpg',
    class: 'rogue',
    spec: 'assassination',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 8,
    cost: 'Energy',
    cost_amount: 35
  },
  {
    name: 'Garrote',
    spell_id: '703',
    description: 'Garrote the target, causing Physical damage over 18 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_garrote.jpg',
    class: 'rogue',
    spec: 'assassination',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Energy',
    cost_amount: 45
  },
  {
    name: 'Kingsbane',
    spell_id: '385627',
    description: 'Unleash a deadly poison that deals Nature damage over 12 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_knife_1h_artifactgarona_d_01.jpg',
    class: 'rogue',
    spec: 'assassination',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Mutilate',
    spell_id: '1329',
    description: 'Instantly attack with both weapons for Physical damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_shadowstrikes.jpg',
    class: 'rogue',
    spec: 'assassination',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 0,
    range: 5,
    cost: 'Energy',
    cost_amount: 50
  },
  {
    name: 'Rupture',
    spell_id: '1943',
    description: 'Finishing move that causes Physical damage over time per combo point.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_rupture.jpg',
    class: 'rogue',
    spec: 'assassination',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Combo Points',
    cost_amount: 1
  },
  {
    name: 'Vendetta',
    spell_id: '79140',
    description: 'Marks an enemy for death, increasing all damage you deal to the target by 30% for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_deadliness.jpg',
    class: 'rogue',
    spec: 'assassination',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  // Outlaw spec actives
  {
    name: 'Ambush',
    spell_id: '8676',
    description: 'Ambush the target, causing Physical damage. Must be stealthed.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_ambush.jpg',
    class: 'rogue',
    spec: 'outlaw',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 34,
    cooldown: 0,
    range: 5,
    cost: 'Energy',
    cost_amount: 50
  },
  {
    name: 'Adrenaline Rush',
    spell_id: '13750',
    description: 'Increases your Energy regeneration rate by 100% and your attack speed by 20% for 15 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowworddominate.jpg',
    class: 'rogue',
    spec: 'outlaw',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 180,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Between the Eyes',
    spell_id: '315341',
    description: 'Strike the target\'s vulnerable pressure points for Physical damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_weapon_rifle_01.jpg',
    class: 'rogue',
    spec: 'outlaw',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Energy',
    cost_amount: 25
  },
  {
    name: 'Blade Flurry',
    spell_id: '13877',
    description: 'Strike up to 4 nearby enemies for Physical damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_punishingblow.jpg',
    class: 'rogue',
    spec: 'outlaw',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Energy',
    cost_amount: 15
  },
  {
    name: 'Blade Rush',
    spell_id: '271877',
    description: 'Rush to the target and perform a series of attacks, dealing Physical damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_arakkoa_spinning_blade.jpg',
    class: 'rogue',
    spec: 'outlaw',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 45,
    range: 20,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Dispatch',
    spell_id: '2098',
    description: 'Finishing move that causes Physical damage per combo point.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_weapon_shortblade_01.jpg',
    class: 'rogue',
    spec: 'outlaw',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Combo Points',
    cost_amount: 1
  },
  {
    name: 'Ghostly Strike',
    spell_id: '196937',
    description: 'Strike the target, dealing Physical damage and increasing your dodge chance by 100% for 2 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_creature_cursed_02.jpg',
    class: 'rogue',
    spec: 'outlaw',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 35,
    range: 5,
    cost: 'Energy',
    cost_amount: 30
  },
  {
    name: 'Keeping It Rolling',
    spell_id: '381989',
    description: 'Extend the duration of your current Roll the Bones buffs by 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_keepitrolling.jpg',
    class: 'rogue',
    spec: 'outlaw',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'Combo Points',
    cost_amount: 1
  },
  {
    name: 'Killing Spree',
    spell_id: '51690',
    description: 'Step through the shadows from enemy to enemy within 10 yards, attacking each for Physical damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_murderspree.jpg',
    class: 'rogue',
    spec: 'outlaw',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 10,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Pistol Shot',
    spell_id: '185763',
    description: 'Fire a pistol shot at the target for Physical damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_pistolshot.jpg',
    class: 'rogue',
    spec: 'outlaw',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 0,
    range: 20,
    cost: 'Energy',
    cost_amount: 40
  },
  {
    name: 'Roll the Bones',
    spell_id: '315508',
    description: 'Finishing move that grants you 1-6 random combat enhancements.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_rollthebones.jpg',
    class: 'rogue',
    spec: 'outlaw',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'Combo Points',
    cost_amount: 1
  },
  // Subtlety spec actives
  {
    name: 'Backstab',
    spell_id: '53',
    description: 'Stab the target, causing Physical damage. Must be behind the target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_backstab.jpg',
    class: 'rogue',
    spec: 'subtlety',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 12,
    cooldown: 0,
    range: 5,
    cost: 'Energy',
    cost_amount: 35
  },
  {
    name: 'Black Powder',
    spell_id: '319175',
    description: 'Finishing move that deals Physical damage to the target and all enemies within 8 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_priest_divinestar_shadow.jpg',
    class: 'rogue',
    spec: 'subtlety',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 8,
    cost: 'Combo Points',
    cost_amount: 1
  },
  {
    name: 'Flagellation',
    spell_id: '384631',
    description: 'Whip the target, dealing Physical damage and increasing your damage dealt by 5% for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_ability_rogue_flagellation.jpg',
    class: 'rogue',
    spec: 'subtlety',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 45,
    range: 5,
    cost: 'Energy',
    cost_amount: 30
  },
  {
    name: 'Gloomblade',
    spell_id: '200758',
    description: 'Stab the target, causing Physical damage. Must be behind the target. Replaces Backstab.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_ironmaidens_convulsiveshadows.jpg',
    class: 'rogue',
    spec: 'subtlety',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Energy',
    cost_amount: 35
  },
  {
    name: 'Goremaw\'s Bite',
    spell_id: '385827',
    description: 'Bite the target, dealing Physical damage and causing them to bleed for additional damage over 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_knife_1h_artifactfangs_d_01.jpg',
    class: 'rogue',
    spec: 'subtlety',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 20,
    range: 5,
    cost: 'Energy',
    cost_amount: 25
  },
  {
    name: 'Rupture',
    spell_id: '1943',
    description: 'Finishing move that causes Physical damage over time per combo point.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_rupture.jpg',
    class: 'rogue',
    spec: 'subtlety',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Combo Points',
    cost_amount: 1
  },
  {
    name: 'Nightblade',
    spell_id: '195452',
    description: 'Finishing move that applies a deadly poison to the target, dealing Physical damage over time per combo point.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_nightblade.jpg',
    class: 'rogue',
    spec: 'subtlety',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Combo Points',
    cost_amount: 1
  },
  {
    name: 'Secret Technique',
    spell_id: '280719',
    description: 'Finishing move that creates shadow clones of yourself. You and your shadow clones each perform a piercing attack on all enemies within 8 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sinistercalling.jpg',
    class: 'rogue',
    spec: 'subtlety',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 8,
    cost: 'Combo Points',
    cost_amount: 1
  },
  {
    name: 'Shadow Blades',
    spell_id: '121471',
    description: 'Draws upon surrounding shadows to empower your weapons, causing your combo point generating abilities to deal additional Shadow damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_knife_1h_grimbatolraid_d_01.jpg',
    class: 'rogue',
    spec: 'subtlety',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 180,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Shadowdance',
    spell_id: '185313',
    description: 'Enter the Shadowdance, allowing the use of Stealth abilities for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_shadowdance.jpg',
    class: 'rogue',
    spec: 'subtlety',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Shadowstrike',
    spell_id: '185438',
    description: 'Strike the target, causing Physical damage. Must be stealthed.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_shadowstrike.jpg',
    class: 'rogue',
    spec: 'subtlety',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 0,
    range: 5,
    cost: 'Energy',
    cost_amount: 40
  },
  {
    name: 'Shuriken Tornado',
    spell_id: '277925',
    description: 'Unleash a storm of shurikens, dealing Physical damage to all enemies within 8 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_throwingspecialization.jpg',
    class: 'rogue',
    spec: 'subtlety',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 8,
    cost: 'Energy',
    cost_amount: 60
  },
  {
    name: 'Symbols of Death',
    spell_id: '212283',
    description: 'Increases your attack power by 15% for 10 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_rune.jpg',
    class: 'rogue',
    spec: 'subtlety',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 30,
    range: 0,
    cost: 'None',
    cost_amount: 0
  }
];

async function seedRogueAbilities() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(Config.databaseURI);
    console.log('Connected.');

    const versions = await Version.find();
    if (!versions.length) {
      console.error('No versions found!');
      return;
    }

    // Delete all rogue abilities for all versions
    const del = await Ability.deleteMany({ class: 'rogue' });
    console.log(`Deleted ${del.deletedCount} rogue abilities.`);

    let created = 0;
    for (const version of versions) {
      // --- Seed core/class abilities once per version (available to all specs) ---
      for (const ability of coreAbilities) {
        await Ability.create({ ...ability, spec: null, game_version: version._id });
        created++;
      }

      // --- Seed spec-specific abilities ---
      const specs = ['assassination', 'outlaw', 'subtlety'];
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
    console.log(`Seeded ${created} rogue abilities for ${versions.length} versions.`);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedRogueAbilities();
}

export default seedRogueAbilities;
