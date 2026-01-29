import mongoose from 'mongoose';
import Ability from '../../../models/ability.js';
import Version from '../../../models/version.js';
import Config from '../../../config/config.js';

// Core/class priest abilities
const coreAbilities = [
  {
    name: 'Angelic Feather',
    spell_id: '121536',
    description: 'Places an angelic feather at the target location. When an ally walks through it, they gain 40% increased movement speed for 5 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_priest_angelicfeather.jpg',
    class: 'priest',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 300
  },
  {
    name: 'Desperate Prayer',
    spell_id: '19236',
    description: 'Instantly heals you for 25% of your maximum health.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_testoffaith.jpg',
    class: 'priest',
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
    name: 'Flash Heal',
    spell_id: '2061',
    description: 'A quick and efficient heal that restores a moderate amount of health.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
    class: 'priest',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 900
  },
  {
    name: 'Divine Star',
    spell_id: '110744',
    description: 'Throws a Divine Star forward 24 yds, healing allies and damaging enemies in its path.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_priest_divinestar.jpg',
    class: 'priest',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 15,
    range: 24,
    cost: 'Mana',
    cost_amount: 800
  },
  {
    name: 'Dominate Mind',
    spell_id: '205364',
    description: 'Controls the mind of the target, making it fight for you for up to 30 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowworddominate.jpg',
    class: 'priest',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'Mana',
    cost_amount: 1000
  },
  {
    name: 'Halo',
    spell_id: '120517',
    description: 'Creates a ring of Holy energy around you that expands outward, healing allies and damaging enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_priest_halo.jpg',
    class: 'priest',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 40,
    range: 0,
    cost: 'Mana',
    cost_amount: 1200
  },
  {
    name: 'Holy Nova',
    spell_id: '132157',
    description: 'Causes an explosion of holy light around you, dealing Holy damage to enemies and healing allies within 12 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_holynova.jpg',
    class: 'priest',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 12,
    cost: 'Mana',
    cost_amount: 800
  },
  {
    name: 'Leap of Faith',
    spell_id: '73325',
    description: 'Pulls the target party or raid member to your location.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/priest_spell_leapoffaith_a.jpg',
    class: 'priest',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 90,
    range: 40,
    cost: 'Mana',
    cost_amount: 600
  },
  {
    name: 'Mass Dispel',
    spell_id: '32375',
    description: 'Dispels magic in a 15 yard radius, removing all harmful Magic effects from friendly targets and beneficial Magic effects from enemy targets.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_massdispel.jpg',
    class: 'priest',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 45,
    range: 30,
    cost: 'Mana',
    cost_amount: 2000
  },
  {
    name: 'Power Infusion',
    spell_id: '10060',
    description: 'Infuses you with power, increasing your spell haste by 25% for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerinfusion.jpg',
    class: 'priest',
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
    name: 'Power Word: Fortitude',
    spell_id: '21562',
    description: 'Increases the Stamina of party and raid members within 30 yards by 5% for 1 hour.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_wordfortitude.jpg',
    class: 'priest',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'Mana',
    cost_amount: 500
  },
  {
    name: 'Power Word: Life',
    spell_id: '204883',
    description: 'A word of power that heals the target for a moderate amount and has a chance to heal for a large amount if the target is below 35% health.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_priest_holywordlife.jpg',
    class: 'priest',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 1000
  },
  {
    name: 'Prayer of Mending',
    spell_id: '33076',
    description: 'A prayer that heals the target for a moderate amount and then jumps to heal the next most injured party or raid member within 20 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_prayerofmendingtga.jpg',
    class: 'priest',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 800
  },
  {
    name: 'Shadowfiend',
    spell_id: '34433',
    description: 'Summons a Shadowfiend to attack the target for 15 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowfiend.jpg',
    class: 'priest',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 180,
    range: 30,
    cost: 'Mana',
    cost_amount: 1000
  },
  {
    name: 'Smite',
    spell_id: '585',
    description: 'Smites an enemy, dealing Holy damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_holysmite.jpg',
    class: 'priest',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 1,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 500
  },
  {
    name: 'Vampiric Embrace',
    spell_id: '15286',
    description: 'Fills you with a vampiric fury that increases your healing done by 25% and causes your damage spells to heal you for 25% of the damage dealt.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_unsummonbuilding.jpg',
    class: 'priest',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'Mana',
    cost_amount: 800
  },
  {
    name: 'Void Shift',
    spell_id: '108968',
    description: 'Instantly swaps health percentages with the target party or raid member.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_priest_voidshift.jpg',
    class: 'priest',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 300,
    range: 40,
    cost: 'Mana',
    cost_amount: 1000
  },
  {
    name: 'Void Tendrils',
    spell_id: '108920',
    description: 'Summons void tendrils that slow and damage enemies within 8 yards for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_priest_voidtendrils.jpg',
    class: 'priest',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 60,
    range: 0,
    cost: 'Mana',
    cost_amount: 800
  }
];

// Spec/hero talent actives and replacements
const specAndHeroActives = [
  // Holy spec actives
  {
    name: 'Apotheosis',
    spell_id: '200183',
    description: 'Ascend into a pure holy form, reducing the cooldown of Holy Word: Serenity and Holy Word: Sanctify.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_priest_ascension.jpg',
    class: 'priest',
    spec: 'holy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Divine Hymn',
    spell_id: '64843',
    description: 'Heals all party or raid members within 40 yards for a significant amount over 8 seconds.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_divinehymn.jpg',
    class: 'priest',
    spec: 'holy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 180,
    range: 40,
    cost: 'Mana',
    cost_amount: 2000
  },
  {
    name: 'Divine Word',
    spell_id: '372760',
    description: 'Speaks a divine word that enhances your next Holy Word spell.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_priest_chakra.jpg',
    class: 'priest',
    spec: 'holy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 0,
    cost: 'Mana',
    cost_amount: 800
  },
  {
    name: 'Guardian Spirit',
    spell_id: '47788',
    description: 'Calls upon a guardian spirit to watch over the friendly target, increasing healing received and preventing death by sacrificing itself.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_guardianspirit.jpg',
    class: 'priest',
    spec: 'holy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 180,
    range: 40,
    cost: 'Mana',
    cost_amount: 1500
  },
  {
    name: 'Heal',
    spell_id: '2060',
    description: 'A slow but powerful heal that restores a large amount of health.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_heal.jpg',
    class: 'priest',
    spec: 'holy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 1000
  },
  {
    name: 'Holy Fire',
    spell_id: '14914',
    description: 'Consumes the enemy in Holy flames, dealing Holy damage and additional damage over time.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_searinglight.jpg',
    class: 'priest',
    spec: 'holy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 10,
    range: 40,
    cost: 'Mana',
    cost_amount: 600
  },
  {
    name: 'Holy Word: Chastise',
    spell_id: '88625',
    description: 'Chastises the target for Holy damage and stuns them for 4 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_chastise.jpg',
    class: 'priest',
    spec: 'holy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 40,
    cost: 'Mana',
    cost_amount: 800
  },
  {
    name: 'Holy Word: Sanctify',
    spell_id: '34861',
    description: 'Creates a holy zone that heals all allies within 10 yards for 18 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_priest_sanctify.jpg',
    class: 'priest',
    spec: 'holy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 40,
    cost: 'Mana',
    cost_amount: 1000
  },
  {
    name: 'Holy Word: Serenity',
    spell_id: '2050',
    description: 'A powerful word of healing that instantly heals the target for a large amount.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_priest_serenity.jpg',
    class: 'priest',
    spec: 'holy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 40,
    cost: 'Mana',
    cost_amount: 800
  },
  {
    name: 'Lightwell',
    spell_id: '724',
    description: 'Creates a Holy Lightwell. Friendly players can click the Lightwell to restore health.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_summonlightwell.jpg',
    class: 'priest',
    spec: 'holy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 180,
    range: 40,
    cost: 'Mana',
    cost_amount: 1500
  },
  {
    name: 'Mass Resurrection',
    spell_id: '212036',
    description: 'Brings all dead party and raid members back to life with 35% health and mana. Cannot be cast when in combat.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/achievement_guildperk_massresurrection.jpg',
    class: 'priest',
    spec: 'holy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'Mana',
    cost_amount: 5000
  },
  {
    name: 'Purify',
    spell_id: '527',
    description: 'Removes all harmful Magic and Disease effects from a friendly target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_purify.jpg',
    class: 'priest',
    spec: 'holy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 8,
    range: 40,
    cost: 'Mana',
    cost_amount: 500
  },
  {
    name: 'Symbol of Hope',
    spell_id: '64901',
    description: 'Creates a symbol of hope that increases the mana regeneration of all party and raid members within 30 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_symbolofhope.jpg',
    class: 'priest',
    spec: 'holy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 300,
    range: 0,
    cost: 'Mana',
    cost_amount: 1000
  },
  // Discipline spec actives
  {
    name: 'Evangelism',
    spell_id: '246287',
    description: 'Increases the duration of Atonement on all targets by 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_divineillumination.jpg',
    class: 'priest',
    spec: 'discipline',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 90,
    range: 0,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Luminous Barrier',
    spell_id: '271466',
    description: 'Creates a luminous barrier that absorbs damage and converts it into healing for nearby allies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_priest_burningwill.jpg',
    class: 'priest',
    spec: 'discipline',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 40,
    cost: 'Mana',
    cost_amount: 1500
  },
  {
    name: 'Mind Blast',
    spell_id: '8092',
    description: 'Blasts the target\'s mind for Shadow damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_unholyfrenzy.jpg',
    class: 'priest',
    spec: 'discipline',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 800
  },
  {
    name: 'Mindbender',
    spell_id: '123040',
    description: 'Summons a Mindbender to attack the target for 15 sec. The Mindbender returns 1% of your maximum mana each time it attacks.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_soulleech_3.jpg',
    class: 'priest',
    spec: 'discipline',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 30,
    cost: 'Mana',
    cost_amount: 1000
  },
  {
    name: 'Pain Suppression',
    spell_id: '33206',
    description: 'Reduces damage taken by a friendly target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_painsupression.jpg',
    class: 'priest',
    spec: 'discipline',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 180,
    range: 40,
    cost: 'Mana',
    cost_amount: 1000
  },
  {
    name: 'Penance',
    spell_id: '47540',
    description: 'Launches a volley of holy light at the target, healing an ally or damaging an enemy.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_penance.jpg',
    class: 'priest',
    spec: 'discipline',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 10,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 800
  },
  {
    name: 'Power Word: Barrier',
    spell_id: '62618',
    description: 'Summons a holy barrier that reduces damage taken by all party and raid members within 10 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordbarrier.jpg',
    class: 'priest',
    spec: 'discipline',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 180,
    range: 40,
    cost: 'Mana',
    cost_amount: 1500
  },
  {
    name: 'Power Word: Radiance',
    spell_id: '194509',
    description: 'A powerful word of light that heals the target and applies Atonement to all nearby allies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_priest_power-word.jpg',
    class: 'priest',
    spec: 'discipline',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 1500
  },
  {
    name: 'Purify',
    spell_id: '527',
    description: 'Removes all harmful Magic and Disease effects from a friendly target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_purify.jpg',
    class: 'priest',
    spec: 'discipline',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 8,
    range: 40,
    cost: 'Mana',
    cost_amount: 500
  },
  {
    name: 'Ultimate Penitence',
    spell_id: '409631',
    description: 'Unleashes ultimate penitence, dealing massive damage to enemies and healing allies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_priest_ascendance.jpg',
    class: 'priest',
    spec: 'discipline',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 40,
    cost: 'Mana',
    cost_amount: 2000
  },
  // Shadow spec actives
  {
    name: 'Devouring Plague',
    spell_id: '335467',
    description: 'Afflicts the target with a disease that instantly causes Shadow damage plus additional damage over time. Heals you for 50% of damage dealt.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_devouringplague.jpg',
    class: 'priest',
    spec: 'shadow',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Insanity',
    cost_amount: 50
  },
  {
    name: 'Dispersion',
    spell_id: '47585',
    description: 'You disperse into pure Shadow energy, reducing all damage taken by 90% and regenerating 6% mana every 1 sec for 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_dispersion.jpg',
    class: 'priest',
    spec: 'shadow',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Dark Ascension',
    spell_id: '391109',
    description: 'Ascend into darkness, increasing your Shadow damage dealt for a short duration.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_priest_darkarchangel.jpg',
    class: 'priest',
    spec: 'shadow',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Mind Blast',
    spell_id: '8092',
    description: 'Blasts the target\'s mind for Shadow damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_unholyfrenzy.jpg',
    class: 'priest',
    spec: 'shadow',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 800
  },
  {
    name: 'Mind Flay',
    spell_id: '15407',
    description: 'Assaults the target\'s mind with Shadow energy, causing Shadow damage over time and slowing their movement speed.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_siphonmana.jpg',
    class: 'priest',
    spec: 'shadow',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 600
  },
  {
    name: 'Mind Spike',
    spell_id: '73510',
    description: 'Blasts the target with Shadow energy, dealing Shadow damage and consuming any Shadow Word: Pain on the target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_priest_mindspike.jpg',
    class: 'priest',
    spec: 'shadow',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 800
  },
  {
    name: 'Psychic Horror',
    spell_id: '64044',
    description: 'Horrifies the target, causing them to flee in terror for 3 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_psychichorrors.jpg',
    class: 'priest',
    spec: 'shadow',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 45,
    range: 30,
    cost: 'Mana',
    cost_amount: 600
  },
  {
    name: 'Mindbender',
    spell_id: '123040',
    description: 'Summons a Mindbender to attack the target for 15 sec. The Mindbender returns 1% of your maximum mana each time it attacks.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_soulleech_3.jpg',
    class: 'priest',
    spec: 'shadow',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 30,
    cost: 'Mana',
    cost_amount: 1000
  },
  {
    name: 'Shadow Word: Death',
    spell_id: '32379',
    description: 'A word of dark binding that inflicts Shadow damage to the target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_deathcoil.jpg',
    class: 'priest',
    spec: 'shadow',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 400
  },
  {
    name: 'Shadow Crash',
    spell_id: '205385',
    description: 'Hurls a bolt of slow-moving Shadow energy at the destination, dealing Shadow damage to all enemies within 8 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowfury.jpg',
    class: 'priest',
    spec: 'shadow',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 30,
    range: 40,
    cost: 'Mana',
    cost_amount: 600
  },
  {
    name: 'Silence',
    spell_id: '15487',
    description: 'Silences the target, preventing them from casting spells for 3 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_impphaseshift.jpg',
    class: 'priest',
    spec: 'shadow',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 45,
    range: 30,
    cost: 'Mana',
    cost_amount: 600
  },
  {
    name: 'Shadowform',
    spell_id: '232698',
    description: 'Assume a Shadowform, increasing your Shadow damage and allowing you to levitate.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowform.jpg',
    class: 'priest',
    spec: 'shadow',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'Mana',
    cost_amount: 0
  },
  {
    name: 'Vampiric Touch',
    spell_id: '34914',
    description: 'A touch of darkness that causes Shadow damage over time and heals you for a portion of the damage dealt.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_stoicism.jpg',
    class: 'priest',
    spec: 'shadow',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Mana',
    cost_amount: 800
  },
  {
    name: 'Void Eruption',
    spell_id: '228260',
    description: 'Unleashes an eruption of void energy, dealing Shadow damage to all enemies within 10 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_priest_void-blast.jpg',
    class: 'priest',
    spec: 'shadow',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 90,
    range: 10,
    cost: 'Mana',
    cost_amount: 1000
  },
  {
    name: 'Void Torrent',
    spell_id: '263165',
    description: 'Channels a torrent of void energy, dealing massive Shadow damage over time.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_priest_voidsear.jpg',
    class: 'priest',
    spec: 'shadow',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 45,
    range: 40,
    cost: 'Insanity',
    cost_amount: 50
  },
  // Hero talents
  {
    name: 'Premonition',
    spell_id: '409631',
    description: 'Grants you a vision of the future, allowing you to see incoming damage and react accordingly.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_ability_oraclepriest_premonitioninsight.jpg',
    class: 'priest',
    spec: null,
    hero_talent: 'oracle',
    ability_type: 'hero_talent',
    level_required: 0,
    cooldown: 45,
    range: 0,
    cost: 'Mana',
    cost_amount: 500
  }
];

async function seedPriestAbilities() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(Config.databaseURI);
    console.log('Connected.');

    const versions = await Version.find();
    if (!versions.length) {
      console.error('No versions found!');
      return;
    }

    // Delete all priest abilities for all versions
    const del = await Ability.deleteMany({ class: 'priest' });
    console.log(`Deleted ${del.deletedCount} priest abilities.`);

    let created = 0;
    for (const version of versions) {
      // --- Seed core/class abilities once per version (available to all specs) ---
      for (const ability of coreAbilities) {
        await Ability.create({ ...ability, spec: null, game_version: version._id });
        created++;
      }

      // --- Seed spec-specific abilities ---
      const specs = ['holy', 'discipline', 'shadow'];
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
    console.log(`Seeded ${created} priest abilities for ${versions.length} versions.`);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedPriestAbilities();
}

export default seedPriestAbilities;
