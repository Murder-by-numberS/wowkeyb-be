import mongoose from 'mongoose';
import Ability from '../../../models/ability.js';
import Version from '../../../models/version.js';
import Config from '../../../config/config.js';

// Core/class death knight abilities
const coreAbilities = [
  {
    name: 'Death Coil',
    spell_id: '47541',
    description: 'Unleashes a blast of unholy energy at the target, causing 1 Shadow damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_deathcoil.jpg',
    class: 'deathknight',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'Runic Power',
    cost_amount: 40
  },
  {
    name: 'Death Grip',
    spell_id: '49576',
    description: 'Harnesses the energy that surrounds and binds all matter, drawing the target toward the death knight and forcing the enemy to attack the death knight for 3 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_strangulate.jpg',
    class: 'deathknight',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 25,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Death Strike',
    spell_id: '49998',
    description: 'Focuses dark energy into a strike that deals 1 Physical damage and heals the death knight for 25% of damage taken in the last 5 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_butcher2.jpg',
    class: 'deathknight',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Plague Strike',
    spell_id: '45462',
    description: 'A vicious strike that deals 1 Physical damage and infects the target with Blood Plague.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_empowerruneblade2.jpg',
    class: 'deathknight',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Icy Touch',
    spell_id: '45477',
    description: 'Chills the target for 1 Frost damage and reduces their attack speed by 14% for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_icetouch.jpg',
    class: 'deathknight',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 20,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Blood Strike',
    spell_id: '45902',
    description: 'A strike that deals 1 Physical damage and causes the target to bleed for 1 Physical damage over 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_deathstrike.jpg',
    class: 'deathknight',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Abomination Limb',
    spell_id: '315443',
    description: 'Sprout an additional limb, granting you an extra attack every 1.5 sec for 12 sec. Each attack deals 1 Physical damage and generates 1 Rune.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_maldraxxus_deathknight.jpg',
    class: 'deathknight',
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
    name: 'Dark Command',
    spell_id: '56222',
    description: 'Commands the target to attack you, but has no effect if the target is already attacking you.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_shamanrage.jpg',
    class: 'deathknight',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 8,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Death\'s Advance',
    spell_id: '96268',
    description: 'For 8 sec, your movement speed is increased by 30%, you cannot be slowed below 100% of normal movement speed, and you are immune to forced movement effects and knockbacks.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_demonicempathy.jpg',
    class: 'deathknight',
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
    name: 'Wraith Walk',
    spell_id: '212552',
    description: 'Embrace the power of the Shadowlands, removing all root effects and increasing your movement speed by 70% for 4 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_helm_plate_raiddeathknight_k_01.jpg',
    class: 'deathknight',
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
    name: 'Anti-Magic Shell',
    spell_id: '48707',
    description: 'Surrounds the death knight in an Anti-Magic Shell for 5 sec, absorbing harmful magical effects and converting each absorbed spell into Runic Power.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_antimagicshell.jpg',
    class: 'deathknight',
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
    name: 'Mind Freeze',
    spell_id: '47528',
    description: 'Smash the target\'s mind with cold, interrupting spellcasting and preventing any spell in that school from being cast for 3 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_mindfreeze.jpg',
    class: 'deathknight',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 15,
    range: 10,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Death Pact',
    spell_id: '48743',
    description: 'Sacrifices your ghoul to heal you for 50% of your maximum health.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_deathpact.jpg',
    class: 'deathknight',
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
    name: 'Death and Decay',
    spell_id: '43265',
    description: 'Corrupts the ground at the target location, causing 1 Shadow damage every 1 sec for 10 sec to enemies within the area.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_deathanddecay.jpg',
    class: 'deathknight',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 30,
    range: 30,
    cost: 'Runes',
    cost_amount: 1
  },

  {
    name: 'Icebound Fortitude',
    spell_id: '48792',
    description: 'Your blood freezes, granting immunity to Stun effects and reducing all damage you take by 20% for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_iceboundfortitude.jpg',
    class: 'deathknight',
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
    name: 'Blinding Sleet',
    spell_id: '207167',
    description: 'Targets in a cone in front of you are blinded, causing them to wander disoriented for 5 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_chillingblast.jpg',
    class: 'deathknight',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 60,
    range: 15,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Sacrificial Pact',
    spell_id: '327574',
    description: 'Sacrifices your ghoul to heal you for 25% of your maximum health.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_deathpact.jpg',
    class: 'deathknight',
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
    name: 'Anti-Magic Zone',
    spell_id: '51052',
    description: 'Places an Anti-Magic Zone that reduces spell damage taken by party or raid members by 20%.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_antimagiczone.jpg',
    class: 'deathknight',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'Runic Power',
    cost_amount: 40
  },
  {
    name: 'Asphyxiate',
    spell_id: '108194',
    description: 'Lifts the enemy target off the ground, crushing their throat with dark energy and stunning them for 5 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_deathknight_asphixiate.jpg',
    class: 'deathknight',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 45,
    range: 20,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Abomination Limb',
    spell_id: '315443',
    description: 'Sprout an additional limb, dealing 1 Shadow damage to an enemy and pulling them to you.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_maldraxxus_deathknight.jpg',
    class: 'deathknight',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 120,
    range: 20,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Death Gate',
    spell_id: '50977',
    description: 'Opens a portal to the Ebon Hold.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_teleportundercity.jpg',
    class: 'deathknight',
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
    name: 'Path of Frost',
    spell_id: '3714',
    description: 'Allows you to walk on water for 10 min.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_pathoffrost.jpg',
    class: 'deathknight',
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
    name: 'Raise Ally',
    spell_id: '61999',
    description: 'Raises a dead ally to life with 35% health.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_deathpact.jpg',
    class: 'deathknight',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 600,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Chains of Ice',
    spell_id: '45524',
    description: 'Freezes the target in place for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_frostemblem_01.jpg',
    class: 'deathknight',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 20,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Runeforging',
    spell_id: '53428',
    description: 'Allows you to enchant your weapon with a rune.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_62.jpg',
    class: 'deathknight',
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
    name: 'Soul Reaper',
    spell_id: '343294',
    description: 'Strike the target for 1 Shadow damage and afflict them with Soul Reaper. After 5 sec, if the target is below 35% health this effect will explode dealing 1 Shadow damage to the target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_deathknight_soulreaper.jpg',
    class: 'deathknight',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 6,
    range: 5,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Lichborne',
    spell_id: '49039',
    description: 'Draw upon unholy energy to become undead for 10 sec, increasing your armor by 10% and making you immune to Charm, Fear and Sleep effects.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_raisedead.jpg',
    class: 'deathknight',
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
    name: 'Control Undead',
    spell_id: '111673',
    description: 'Dominate the target undead, forcing it to do your bidding for 5 min.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowworddominate.jpg',
    class: 'deathknight',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Raise Dead',
    spell_id: '46584',
    description: 'Raises a ghoul to fight by your side. You can have a maximum of one ghoul at a time.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_animatedead.jpg',
    class: 'deathknight',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 60,
    range: 30,
    cost: 'None',
    cost_amount: 0
  }
];

// Spec/hero talent actives and replacements
const specAndHeroActives = [
  // Blood spec actives
  {
    name: 'Blood Boil',
    spell_id: '50842',
    description: 'Causes all enemies within 10 yards to suffer 1 Shadow damage and infects them with Blood Plague.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_bloodboil.jpg',
    class: 'deathknight',
    spec: 'blood',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 10,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Heart Strike',
    spell_id: '206930',
    description: 'Instantly strike the target and 1 additional nearby enemy, causing 1 Physical damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_weapon_shortblade_40.jpg',
    class: 'deathknight',
    spec: 'blood',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Marrowrend',
    spell_id: '195182',
    description: 'Shatter the target\'s armor, dealing 1 Physical damage and generating 3 Bone Shield charges.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_deathknight_marrowrend.jpg',
    class: 'deathknight',
    spec: 'blood',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Runes',
    cost_amount: 2
  },
  {
    name: 'Vampiric Blood',
    spell_id: '55233',
    description: 'Embrace your undeath, increasing your maximum health by 30% and increasing all healing received by 30% for 10 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_lifedrain02.jpg',
    class: 'deathknight',
    spec: 'blood',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 90,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Dancing Rune Weapon',
    spell_id: '49028',
    description: 'Empowers your rune weapon with a portion of your consciousness, allowing it to assist you in combat for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_07.jpg',
    class: 'deathknight',
    spec: 'blood',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Bone Storm',
    spell_id: '194844',
    description: 'A whirlwind of bone that strikes all enemies within 8 yards for 1 Physical damage every 1 sec for 4 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/achievement_boss_lordmarrowgar.jpg',
    class: 'deathknight',
    spec: 'blood',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 90,
    range: 8,
    cost: 'Runic Power',
    cost_amount: 30
  },
  {
    name: 'Consumption',
    spell_id: '274156',
    description: 'Strike all enemies in front of you for 1 Physical damage and heal for 150% of the damage dealt.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_axe_2h_artifactmaw_d_01.jpg',
    class: 'deathknight',
    spec: 'blood',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 45,
    range: 8,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Tombstone',
    spell_id: '219809',
    description: 'Consume up to 5 Bone Shield charges. For each charge consumed, you gain 6 Runic Power and the cooldown of Dancing Rune Weapon is reduced by 5 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_fiegndead.jpg',
    class: 'deathknight',
    spec: 'blood',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Rune Tap',
    spell_id: '194679',
    description: 'Consume a Rune to instantly heal yourself for 15% of your maximum health.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_runetap.jpg',
    class: 'deathknight',
    spec: 'blood',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 25,
    range: 0,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Gorefiend\'s Grasp',
    spell_id: '108199',
    description: 'Shadowy tendrils coil around all enemies within 8 yards of a target, pulling them to the target\'s location.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_deathknight_aoedeathgrip.jpg',
    class: 'deathknight',
    spec: 'blood',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 20,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Blood Tap',
    spell_id: '221699',
    description: 'Consume a charge of Bone Shield to gain 1 Rune.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_bloodtap.jpg',
    class: 'deathknight',
    spec: 'blood',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Mark of Blood',
    spell_id: '206940',
    description: 'Marks a target with a debuff that causes them to bleed for 1 Physical damage over 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_rapidkilling.jpg',
    class: 'deathknight',
    spec: 'blood',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 6,
    range: 30,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Blooddrinker',
    spell_id: '206931',
    description: 'Channel a stream of blood at the target, dealing 1 Physical damage every 0.5 sec for 3 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_animusdraw.jpg',
    class: 'deathknight',
    spec: 'blood',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 20,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Death\'s Caress',
    spell_id: '195292',
    description: 'Deals 1 Shadow damage to the target and applies Blood Plague.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_deathknight_deathscaress.jpg',
    class: 'deathknight',
    spec: 'blood',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 20,
    cost: 'Runes',
    cost_amount: 1
  },
  // Frost spec actives
  {
    name: 'Frost Strike',
    spell_id: '49143',
    description: 'A brutal instant attack that deals 1 Frost damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_empowerruneblade.jpg',
    class: 'deathknight',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Runic Power',
    cost_amount: 30
  },
  {
    name: 'Obliterate',
    spell_id: '49020',
    description: 'A brutal attack that deals 1 Physical damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_classicon.jpg',
    class: 'deathknight',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Runes',
    cost_amount: 2
  },
  {
    name: 'Howling Blast',
    spell_id: '49184',
    description: 'Blast the target with a frigid wind, dealing 1 Frost damage to the target and 1 Frost damage to all other enemies within 10 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_arcticwinds.jpg',
    class: 'deathknight',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Remorseless Winter',
    spell_id: '196770',
    description: 'Drain the warmth of life from all nearby enemies within 8 yards, dealing 1 Frost damage every 1 sec for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_deathknight_remorselesswinters2.jpg',
    class: 'deathknight',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 20,
    range: 8,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Frostscythe',
    spell_id: '207230',
    description: 'A sweeping attack that strikes all enemies in front of you for 1 Frost damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_2h_farmscythe_a_01.jpg',
    class: 'deathknight',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 8,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Glacial Advance',
    spell_id: '194913',
    description: 'Summon glacial spikes from the ground that advance forward, each dealing 1 Frost damage to enemies they pass through.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_glacialtrap.jpg',
    class: 'deathknight',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 30,
    cost: 'Runes',
    cost_amount: 2
  },
  {
    name: 'Breath of Sindragosa',
    spell_id: '152279',
    description: 'Continuously deal 1 Frost damage every 1 sec to enemies in a cone in front of you, until your Runic Power is exhausted.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_breathofsindragosa.jpg',
    class: 'deathknight',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 10,
    cost: 'Runic Power',
    cost_amount: 16
  },
  {
    name: 'Frostwyrm\'s Fury',
    spell_id: '279302',
    description: 'Summon a frostwyrm who breathes on all enemies within 40 yards in front of you, dealing 1 Frost damage and slowing them by 50% for 10 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/achievement_boss_sindragosa.jpg',
    class: 'deathknight',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 180,
    range: 40,
    cost: 'Runes',
    cost_amount: 2
  },
  {
    name: 'Chill Streak',
    spell_id: '305392',
    description: 'Deal 1 Frost damage to the target and reduce their movement speed by 50% for 3 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_chillingbolt.jpg',
    class: 'deathknight',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 20,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Empower Rune Weapon',
    spell_id: '47568',
    description: 'Empowers your rune weapon, immediately activating 2 runes and increasing your maximum Runic Power by 20 for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_62.jpg',
    class: 'deathknight',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Pillar of Frost',
    spell_id: '51271',
    description: 'The power of frost increases your Strength by 20% for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_122.jpg',
    class: 'deathknight',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Horn of Winter',
    spell_id: '57330',
    description: 'Blows the Horn of Winter, granting 10 Runic Power and increasing Strength by 155 for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_horn_01.jpg',
    class: 'deathknight',
    spec: 'frost',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 20,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  // Unholy spec actives
  {
    name: 'Defile',
    spell_id: '152280',
    description: 'Defiles the ground targeted, causing 1 Shadow damage every 1 sec for 10 sec to enemies within the area.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_defile.jpg',
    class: 'deathknight',
    spec: 'unholy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 30,
    range: 30,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Apocalypse',
    spell_id: '275699',
    description: 'Unleash the Apocalypse, causing all Festering Wounds on the target to burst and summon ghouls for each wound burst.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/artifactability_unholydeathknight_deathsembrace.jpg',
    class: 'deathknight',
    spec: 'unholy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 90,
    range: 5,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Clawing Shadows',
    spell_id: '207311',
    description: 'Deals 1 Shadow damage and causes 1 Festering Wound to burst.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/warlock_curse_shadow.jpg',
    class: 'deathknight',
    spec: 'unholy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Vile Contagion',
    spell_id: '390163',
    description: 'Infects the target with a vile contagion, dealing 1 Shadow damage over 6 sec and spreading to nearby enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_plaguecloud.jpg',
    class: 'deathknight',
    spec: 'unholy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 45,
    range: 30,
    cost: 'Runes',
    cost_amount: 1
  },
  {
    name: 'Army of the Dead',
    spell_id: '42650',
    description: 'Summons an army of ghouls that swarms your enemies, dealing 1 Physical damage to all enemies within 10 yards every 1 sec for 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_deathknight_armyofthedead.jpg',
    class: 'deathknight',
    spec: 'unholy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 480,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Summon Gargoyle',
    spell_id: '49206',
    description: 'Summons a gargoyle to fight by your side for 30 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_deathknight_summongargoyle.jpg',
    class: 'deathknight',
    spec: 'unholy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 180,
    range: 30,
    cost: 'Runic Power',
    cost_amount: 60
  },
  {
    name: 'Raise Abomination',
    spell_id: '315341',
    description: 'Raises an abomination to fight by your side for 30 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/achievement_boss_patchwerk.jpg',
    class: 'deathknight',
    spec: 'unholy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 30,
    cost: 'Runes',
    cost_amount: 2
  },
  {
    name: 'Unholy Assault',
    spell_id: '194844',
    description: 'Unleash an unholy assault, dealing 1 Shadow damage to the target and increasing your damage by 20% for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_unholyfrenzy.jpg',
    class: 'deathknight',
    spec: 'unholy',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 5,
    cost: 'Runes',
    cost_amount: 2
  },

  {
    name: 'Reaper\'s Mark',
    spell_id: '377427',
    description: 'Marks the target with the Reaper\'s Mark, increasing damage taken by 10% for 30 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_ability_deathbringerdeathknight_reapersmark.jpg',
    class: 'deathknight',
    spec: null,
    hero_talent: 'deathbringer',
    ability_type: 'hero_talent',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'Runes',
    cost_amount: 1
  }
];

async function seedDeathKnightAbilities() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(Config.databaseURI);
    console.log('Connected.');

    const versions = await Version.find();
    if (!versions.length) {
      console.error('No versions found!');
      return;
    }

    // Delete all death knight abilities for all versions
    const del = await Ability.deleteMany({ class: 'deathknight' });
    console.log(`Deleted ${del.deletedCount} death knight abilities.`);

    let created = 0;
    for (const version of versions) {
      // --- Seed core/class abilities once per version (available to all specs) ---
      for (const ability of coreAbilities) {
        await Ability.create({ ...ability, spec: null, game_version: version._id });
        created++;
      }

      // --- Seed spec-specific abilities ---
      const specs = ['blood', 'frost', 'unholy'];
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
    console.log(`Seeded ${created} death knight abilities for ${versions.length} versions.`);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedDeathKnightAbilities();
}

export default seedDeathKnightAbilities;
