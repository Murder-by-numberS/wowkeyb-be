import mongoose from 'mongoose';
import Ability from '../../../models/ability.js';
import Version from '../../../models/version.js';
import Config from '../../../config/config.js';

// Core/class evoker abilities
const coreAbilities = [
  {
    name: 'Azure Strike',
    spell_id: '362969',
    description: 'Deals Arcane damage to an enemy and grants Essence Burst.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_azurestrike.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 1,
    cooldown: 0,
    range: 25,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Blessing of Bronze',
    spell_id: '364342',
    description: 'Blesses an ally with the power of Bronze, reducing their cooldown recovery rate by 20% for 1 hour.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_blessingofthebronze.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 10,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Deep Breath',
    spell_id: '357210',
    description: 'Take a deep breath and fly high, then breathe fire in a line below you, dealing Fire damage to enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_deepbreath.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 15,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Disintegrate',
    spell_id: '356995',
    description: 'Channel a beam of pure magic at an enemy, dealing Arcane damage over 2.5 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_disintegrate.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 1,
    cooldown: 0,
    range: 25,
    cost: 'Essence',
    cost_amount: 3
  },


  {
    name: 'Fire Breath',
    spell_id: '382266',
    description: 'Breathe fire at enemies in a cone in front of you, dealing Fire damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_firebreath.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 1,
    cooldown: 0,
    range: 0,
    cost: 'Essence',
    cost_amount: 3
  },
  {
    name: 'Hover',
    spell_id: '358267',
    description: 'Hover in the air, allowing you to cast while moving for 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_hover.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 35,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Landslide',
    spell_id: '358385',
    description: 'Call forth a landslide that deals Physical damage to enemies and knocks them back.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_earthen_pillar.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 60,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Oppressing Roar',
    spell_id: '372048',
    description: 'Let out a terrifying roar, fearing enemies within 10 yards for 4 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_oppressingroar.jpg',
    class: 'evoker',
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
    name: 'Rescue',
    spell_id: '370665',
    description: 'Fly to an ally and carry them to your location.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_rescue.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 60,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Sleep Walk',
    spell_id: '360806',
    description: 'Walk while sleeping, allowing you to move while channeling spells.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_xavius_dreamsimulacrum.jpg',
    class: 'evoker',
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
    name: 'Source of Magic',
    spell_id: '369459',
    description: 'Grant an ally the ability to restore mana when they cast spells.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_blue_01.jpg',
    class: 'evoker',
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
    name: 'Wing Buffet',
    spell_id: '357214',
    description: 'Beat your wings, dealing Physical damage to enemies in front of you and knocking them back.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_racial_wingbuffet.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 45,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Zephyr',
    spell_id: '374227',
    description: 'Surround yourself with a gentle breeze, reducing damage taken by 20% and increasing movement speed by 30% for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_hoverblack.jpg',
    class: 'evoker',
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
    name: 'Obsidian Scales',
    spell_id: '363916',
    description: 'Cover yourself with obsidian scales, reducing damage taken by 20% for 12 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_artifact_dragonscales.jpg',
    class: 'evoker',
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
    name: 'Expunge',
    spell_id: '365585',
    description: 'Remove all harmful magic effects from yourself.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_fontofmagic_green.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'Essence',
    cost_amount: 1
  },
  {
    name: 'Verdant Embrace',
    spell_id: '360995',
    description: 'Embrace an ally with verdant energy, healing them for a large amount over 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_rescue.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Essence',
    cost_amount: 3
  },
  {
    name: 'Quell',
    spell_id: '351338',
    description: 'Interrupt the target\'s spellcasting and prevent any spell in that school from being cast for 4 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_quell.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 40,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Cauterizing Flame',
    spell_id: '374251',
    description: 'Breathe a cauterizing flame that removes harmful magic effects from allies and deals Fire damage to enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_fontofmagic_red.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'Essence',
    cost_amount: 2
  },
  {
    name: 'Tip the Scales',
    spell_id: '370553',
    description: 'Tip the scales in your favor, making your next spell instant cast.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_tipthescales.jpg',
    class: 'evoker',
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
    name: 'Renewing Blaze',
    spell_id: '374348',
    description: 'Create a blaze of renewing fire that heals allies and damages enemies over 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_masterylifebinder_red.jpg',
    class: 'evoker',
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
    name: 'Unravel',
    spell_id: '368432',
    description: 'Unravel the magic around an enemy, removing beneficial magic effects.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_unravel.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'Essence',
    cost_amount: 1
  },
  {
    name: 'Spatial Paradox',
    spell_id: '374227',
    description: 'Create a spatial paradox that allows you to instantly teleport to a target location.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_spatialparadox.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 120,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Time Spiral',
    spell_id: '374968',
    description: 'Create a spiral of time that reduces the cooldown of abilities for all party and raid members.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_timespiral.jpg',
    class: 'evoker',
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
    name: 'Emerald Blossom',
    spell_id: '355936',
    description: 'Create an emerald blossom that heals allies in the area over time.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_emeraldblossom.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Essence',
    cost_amount: 2
  },
  {
    name: 'Return',
    spell_id: '374227',
    description: 'Return to your previous location, teleporting instantly.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_return.jpg',
    class: 'evoker',
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
    name: 'Chrono Flames',
    spell_id: '374251',
    description: 'Breathe flames that manipulate time, dealing Fire damage and reducing cooldowns.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_ability_chronowardenevoker_chronoflame.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'Essence',
    cost_amount: 2
  },
  {
    name: 'Fury of the Aspects',
    spell_id: '390163',
    description: 'Channel the fury of all dragon aspects, increasing your damage and healing done by 25% for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_furyoftheaspects.jpg',
    class: 'evoker',
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
    name: 'Tail Swipe',
    spell_id: '368970',
    description: 'Swipe your tail, dealing Physical damage to enemies behind you and knocking them back.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_racial_tailswipe.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 45,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Sense Power',
    spell_id: '374227',
    description: 'Sense the magical power around you, revealing hidden enemies and magical effects.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_aspectoftheviper.jpg',
    class: 'evoker',
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
  // Devastation spec actives
  {
    name: 'Dragonrage',
    spell_id: '375087',
    description: 'Enter a state of pure destruction for 20 sec, increasing your damage done by 25% and reducing the cooldown of your major abilities.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_dragonrage.jpg',
    class: 'evoker',
    spec: 'devastation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Eternity Surge',
    spell_id: '382411',
    description: 'Unleash a surge of pure magic, dealing Arcane damage to enemies in a line.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_eternitysurge.jpg',
    class: 'evoker',
    spec: 'devastation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 30,
    range: 25,
    cost: 'Essence',
    cost_amount: 3
  },
  {
    name: 'Firestorm',
    spell_id: '368847',
    description: 'Call down a storm of fire that deals Fire damage to enemies in the target area over 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_firestorm.jpg',
    class: 'evoker',
    spec: 'devastation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 20,
    range: 40,
    cost: 'Essence',
    cost_amount: 2
  },
  {
    name: 'Pyre',
    spell_id: '393568',
    description: 'Hurl a ball of fire at an enemy, dealing Fire damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_pyre.jpg',
    class: 'evoker',
    spec: 'devastation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 25,
    cost: 'Essence',
    cost_amount: 2
  },
  {
    name: 'Shattering Star',
    spell_id: '370452',
    description: 'Hurl a star at an enemy that explodes on impact, dealing Arcane damage to the target and nearby enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_chargedblast.jpg',
    class: 'evoker',
    spec: 'devastation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 15,
    range: 25,
    cost: 'None',
    cost_amount: 0
  },
  // Preservation spec actives
  {
    name: 'Dream Breath',
    spell_id: '355936',
    description: 'Breathe a dream mist that heals allies in a cone in front of you.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_dreambreath.jpg',
    class: 'evoker',
    spec: 'preservation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'Essence',
    cost_amount: 3
  },
  {
    name: 'Life-Bind',
    spell_id: '373270',
    description: 'Bind your life force to an ally, sharing damage taken between you.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_hoverred.jpg',
    class: 'evoker',
    spec: 'preservation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Naturalize',
    spell_id: '360823',
    description: 'Remove all harmful magic effects from a friendly target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_fontofmagic_green.jpg',
    class: 'evoker',
    spec: 'preservation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Essence',
    cost_amount: 1
  },
  {
    name: 'Reversion',
    spell_id: '366155',
    description: 'Reverse time on an ally, healing them for a moderate amount and increasing healing received by 25% for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_reversion.jpg',
    class: 'evoker',
    spec: 'preservation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Essence',
    cost_amount: 2
  },
  {
    name: 'Rewind',
    spell_id: '374227',
    description: 'Rewind time for all party and raid members, healing them for damage taken in the last 5 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_rewind.jpg',
    class: 'evoker',
    spec: 'preservation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 180,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Stasis',
    spell_id: '370537',
    description: 'Store healing energy for 30 sec, then release it to heal allies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_stasis.jpg',
    class: 'evoker',
    spec: 'preservation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 90,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Emerald Communion',
    spell_id: '370960',
    description: 'Channel the power of the Emerald Dream, healing yourself for a large amount over 5 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_green_01.jpg',
    class: 'evoker',
    spec: 'preservation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 180,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Echo',
    spell_id: '364343',
    description: 'Echo a friendly target, healing them for a moderate amount.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_echo.jpg',
    class: 'evoker',
    spec: 'preservation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Essence',
    cost_amount: 2
  },
  {
    name: 'Mass Return',
    spell_id: '374227',
    description: 'Return all party and raid members to their previous location.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_return2.jpg',
    class: 'evoker',
    spec: 'preservation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 300,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Time Dilation',
    spell_id: '374227',
    description: 'Dilate time around an ally, reducing damage taken by 30% for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_timedilation.jpg',
    class: 'evoker',
    spec: 'preservation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 40,
    cost: 'Essence',
    cost_amount: 2
  },
  {
    name: 'Spiritbloom',
    spell_id: '382731',
    description: 'Bloom with spiritual energy, healing allies in a large area around you.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_spiritbloom.jpg',
    class: 'evoker',
    spec: 'preservation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 90,
    range: 0,
    cost: 'Essence',
    cost_amount: 3
  },
  {
    name: 'Temporal Anomaly',
    spell_id: '374227',
    description: 'Create a temporal anomaly that heals allies and damages enemies over time.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_temporalanomaly.jpg',
    class: 'evoker',
    spec: 'preservation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 45,
    range: 30,
    cost: 'Essence',
    cost_amount: 1
  },
  {
    name: 'Dream Flight',
    spell_id: '355936',
    description: 'Take flight and soar through the Emerald Dream, healing allies you pass over.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_dreamflight.jpg',
    class: 'evoker',
    spec: 'preservation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  // Augmentation spec actives
  {
    name: 'Blistering Scales',
    spell_id: '360827',
    description: 'Cover an ally with blistering scales that deal Fire damage to attackers.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_blisteringscales.jpg',
    class: 'evoker',
    spec: 'augmentation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'Essence',
    cost_amount: 2
  },
  {
    name: 'Breath of Eons',
    spell_id: '403631',
    description: 'Breathe the power of time itself, increasing the damage and healing done by allies for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_breathofeons.jpg',
    class: 'evoker',
    spec: 'augmentation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Ebon Might',
    spell_id: '395152',
    description: 'Grant an ally the might of the black dragonflight, increasing their primary stat by 10% for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_ebonmight.jpg',
    class: 'evoker',
    spec: 'augmentation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'Essence',
    cost_amount: 2
  },
  {
    name: 'Prescience',
    spell_id: '409311',
    description: 'Grant an ally prescience, increasing their critical strike chance by 15% for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_prescience.jpg',
    class: 'evoker',
    spec: 'augmentation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'Essence',
    cost_amount: 2
  },
  {
    name: 'Eruption',
    spell_id: '374227',
    description: 'Create a volcanic eruption that deals Fire damage to enemies and empowers allies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_eruption.jpg',
    class: 'evoker',
    spec: 'augmentation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 30,
    cost: 'Essence',
    cost_amount: 2
  },
  {
    name: 'Upheaval',
    spell_id: '374227',
    description: 'Cause the ground to upheave, dealing Physical damage and knocking enemies back.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_upheaval.jpg',
    class: 'evoker',
    spec: 'augmentation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 45,
    range: 25,
    cost: 'Essence',
    cost_amount: 1
  },
  {
    name: 'Timelessness',
    spell_id: '374227',
    description: 'Grant an ally timelessness, making them immune to crowd control effects for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_timelessness.jpg',
    class: 'evoker',
    spec: 'augmentation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 90,
    range: 30,
    cost: 'Essence',
    cost_amount: 2
  },
  {
    name: 'Bestow Weyrnstone',
    spell_id: '374227',
    description: 'Bestow a weyrnstone upon an ally, granting them powerful defensive abilities.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_bestowweyrnstone.jpg',
    class: 'evoker',
    spec: 'augmentation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Time Skip',
    spell_id: '374227',
    description: 'Skip forward in time, instantly completing the cooldown of your next ability.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_timeskip.jpg',
    class: 'evoker',
    spec: 'augmentation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 0,
    cost: 'Essence',
    cost_amount: 1
  },
  {
    name: 'Black Attunement',
    spell_id: '374227',
    description: 'Attune to the power of the black dragonflight, enhancing your defensive abilities.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_blackattunement.jpg',
    class: 'evoker',
    spec: 'augmentation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'Essence',
    cost_amount: 2
  },
  {
    name: 'Bronze Attunement',
    spell_id: '374227',
    description: 'Attune to the power of the bronze dragonflight, enhancing your temporal abilities.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_bronzeattunement.jpg',
    class: 'evoker',
    spec: 'augmentation',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'Essence',
    cost_amount: 2
  },
  // Hero talent actives
  {
    name: 'Chronoward',
    spell_id: '408083',
    description: 'Ward an ally with temporal energy, reducing damage taken by 15% for 10 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_chronoward.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: 'chronoward',
    ability_type: 'hero_talent',
    level_required: 0,
    cooldown: 60,
    range: 30,
    cost: 'Essence',
    cost_amount: 1
  },
  {
    name: 'Temporal Compression',
    spell_id: '362877',
    description: 'Compress time around an ally, reducing their cooldown recovery rate by 30% for 15 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_evoker_temporalcompression.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: 'temporal',
    ability_type: 'hero_talent',
    level_required: 0,
    cooldown: 90,
    range: 30,
    cost: 'Essence',
    cost_amount: 2
  },
  {
    name: 'Engulf',
    spell_id: '374227',
    description: 'Engulf enemies in flames, dealing Fire damage over time and spreading to nearby targets.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_ability_flameshaperevoker_engulf.jpg',
    class: 'evoker',
    spec: null,
    hero_talent: 'flameshaper',
    ability_type: 'hero_talent',
    level_required: 0,
    cooldown: 45,
    range: 25,
    cost: 'Essence',
    cost_amount: 2
  }
];

async function seedEvokerAbilities() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(Config.databaseURI);
    console.log('Connected.');

    const versions = await Version.find();
    if (!versions.length) {
      console.error('No versions found!');
      return;
    }

    // Delete all evoker abilities for all versions
    const del = await Ability.deleteMany({ class: 'evoker' });
    console.log(`Deleted ${del.deletedCount} evoker abilities.`);

    let created = 0;
    for (const version of versions) {
      // For each spec (including null for class abilities)
      const specs = [null, 'devastation', 'preservation', 'augmentation'];
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
        // For hero talents, create them as-is (spec: null, hero_talent: 'chronoward')
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
    console.log(`Seeded ${created} evoker abilities for ${versions.length} versions.`);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedEvokerAbilities();
}

export default seedEvokerAbilities;
