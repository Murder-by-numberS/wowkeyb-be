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
    name: 'Crackling Jade Lightning',
    spell_id: '117952',
    description: 'Channel lightning at an enemy, dealing Nature damage over time.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_cracklingjadelightning.jpg',
    class: 'monk',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 25,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Expel Harm',
    spell_id: '115072',
    description: 'Expel negative chi from your body, healing yourself for a moderate amount.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_expelharm.jpg',
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
    name: 'Fortifying Brew',
    spell_id: '115203',
    description: 'Fortifies your body, increasing your maximum health by 20% for 15 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_fortifyingelixir.jpg',
    class: 'monk',
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
    name: 'Resuscitate',
    spell_id: '115178',
    description: 'Resurrects a dead target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_druid_lunarguidance.jpg',
    class: 'monk',
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
    name: 'Ring of Peace',
    spell_id: '116844',
    description: 'Creates a ring of peace that knocks back enemies who enter it.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_monk_ringofpeace.jpg',
    class: 'monk',
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
    name: 'Spinning Crane Kick',
    spell_id: '101546',
    description: 'Spin while kicking in all directions, dealing Physical damage to all nearby enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_cranekick_new.jpg',
    class: 'monk',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'Chi',
    cost_amount: 2
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
    name: 'Tiger\'s Lust',
    spell_id: '116841',
    description: 'Increases movement speed by 70% for 6 sec and removes all movement impairing effects.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_tigerslust.jpg',
    class: 'monk',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 30,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Touch of Death',
    spell_id: '115080',
    description: 'Touch of Death can now be used on targets with less than 15% health remaining, instantly killing them.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_touchofdeath.jpg',
    class: 'monk',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 120,
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
  },
  {
    name: 'Vivify',
    spell_id: '116670',
    description: 'Heals the target and up to 2 nearby injured allies for a moderate amount.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_vivify.jpg',
    class: 'monk',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Chi',
    cost_amount: 2
  },
  {
    name: 'Zen Flight',
    spell_id: '125883',
    description: 'Allows you to fly at 150% movement speed.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_zenflight.jpg',
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
    name: 'Zen Pilgrimage',
    spell_id: '126892',
    description: 'Return to your faction\'s capital city.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_monk_zenpilgrimage.jpg',
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
    name: 'Disable',
    spell_id: '116095',
    description: 'Reduces the target\'s movement speed by 50% for 15 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_shockwave.jpg',
    class: 'monk',
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
    name: 'Soothing Mist',
    spell_id: '115175',
    description: 'Heals the target for a moderate amount over 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_soothingmists.jpg',
    class: 'monk',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Chi Torpedo',
    spell_id: '115008',
    description: 'Torpedo yourself through the air, dealing Physical damage to enemies in your path.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_quitornado.jpg',
    class: 'monk',
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
    name: 'Song of Chi-Ji',
    spell_id: '198898',
    description: 'Increases the healing of your next healing spell by 100%.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_chaos_orb.jpg',
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
    name: 'Diffuse Magic',
    spell_id: '122783',
    description: 'Reduces magic damage taken by 60% for 6 sec and transfers all harmful magical effects on you back to their original caster.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_monk_diffusemagic.jpg',
    class: 'monk',
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
    name: 'Summon Jade Serpent Statue',
    spell_id: '115313',
    description: 'Summons a Jade Serpent Statue at the target location for 30 min.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_summonserpentstatue.jpg',
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
    name: 'Clash',
    spell_id: '122057',
    description: 'Charges to an enemy, dealing Physical damage and stunning them for 1 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_clashingoxcharge.jpg',
    class: 'monk',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 30,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Chi Burst',
    spell_id: '123986',
    description: 'Hurls a torrent of Chi energy up to 40 yards forward, dealing Nature damage to enemies and healing allies in its path.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
    class: 'monk',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 30,
    range: 40,
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
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_chibrew.jpg',
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
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_chibrew.jpg',
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
    name: 'Exploding Keg',
    spell_id: '214326',
    description: 'Throw a keg that explodes on impact, dealing Fire damage to all enemies within 8 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/archaeology_5_0_emptykegofbrewfatherxinwoyin.jpg',
    class: 'monk',
    spec: 'brewmaster',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Invoke Niuzao, the Black Ox',
    spell_id: '132578',
    description: 'Summons an image of Niuzao, the Black Ox for 24 sec. Niuzao attacks your target and provides 10% increased armor to all party and raid members.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_monk_brewmaster_spec.jpg',
    class: 'monk',
    spec: 'brewmaster',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 180,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Keg Smash',
    spell_id: '121253',
    description: 'Smash a keg of brew on the target, dealing Physical damage and applying Brewmaster\'s Balance.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/achievement_brewery_2.jpg',
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
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_beer_06.jpg',
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
    name: 'Rushing Jade Wind',
    spell_id: '116847',
    description: 'Surrounds you with whirling jade wind, dealing Nature damage to nearby enemies and healing nearby allies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_rushingjadewind.jpg',
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
    name: 'Weapons of Order',
    spell_id: '387184',
    description: 'Increases your damage and healing by 25% for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_bastion_monk.jpg',
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
    name: 'Zen Meditation',
    spell_id: '115176',
    description: 'Reduces all damage taken by 90% for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_zenmeditation.jpg',
    class: 'monk',
    spec: 'brewmaster',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 300,
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
    name: 'Slicing Winds',
    spell_id: '388847',
    description: 'Unleash slicing winds that deal Physical damage to all enemies in front of you.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_skyreach_wind_wall.jpg',
    class: 'monk',
    spec: 'windwalker',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'Chi',
    cost_amount: 2
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
    name: 'Strike of the Windlord',
    spell_id: '220357',
    description: 'A powerful strike that deals Physical damage and has a chance to trigger additional attacks.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_hand_1h_artifactskywall_d_01.jpg',
    class: 'monk',
    spec: 'windwalker',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Chi',
    cost_amount: 2
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
    name: 'Detox',
    spell_id: '115450',
    description: 'Removes all harmful magic effects from a friendly target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_imrovedrecuperate.jpg',
    class: 'monk',
    spec: 'mistweaver',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 6,
    cooldown: 0,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Enveloping Mist',
    spell_id: '124682',
    description: 'Wraps the target in healing mists, healing them for a moderate amount over 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_monk_envelopingmist.jpg',
    class: 'monk',
    spec: 'mistweaver',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'Chi',
    cost_amount: 3
  },
  {
    name: 'Invoke "Chi-ji, the Red Crane"',
    spell_id: '325197',
    description: 'Summons an effigy of Chi-Ji, the Red Crane for 45 sec. While active, your healing spells have a chance to trigger a burst of healing.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_pet_crane.jpg',
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
    name: 'Jadefire Stomp',
    spell_id: '388193',
    description: 'Stomp the ground, creating jadefire that damages enemies and heals allies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_ability_monk_jadefirestomp.jpg',
    class: 'monk',
    spec: 'mistweaver',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Life Cocoon',
    spell_id: '116849',
    description: 'Encases the target in a cocoon of Chi energy for 12 sec, absorbing damage and healing them over time.',
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
    name: 'Mana Tea',
    spell_id: '115294',
    description: 'Consume stacks of Mana Tea to restore mana.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_drink_01.jpg',
    class: 'monk',
    spec: 'mistweaver',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Reawaken',
    spell_id: '212051',
    description: 'Resurrects a dead target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_chiswirl.jpg',
    class: 'monk',
    spec: 'mistweaver',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Renewing Mist',
    spell_id: '115151',
    description: 'Surrounds the target with healing mists that heal them for a moderate amount over 20 sec.',
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
    name: 'Revival',
    spell_id: '115310',
    description: 'Instantly heals all party and raid members within 100 yards for a moderate amount and removes all harmful magic effects.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_monk_revival.jpg',
    class: 'monk',
    spec: 'mistweaver',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 180,
    range: 100,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Sheilun\'s Gift',
    spell_id: '399491',
    description: 'Unleash the power of Sheilun\'s Gift, healing the target for a large amount.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_staff_2h_artifactshaohao_d_01.jpg',
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
    name: 'Rushing Wind Kick',
    spell_id: '116847',
    description: 'A powerful kick that deals Physical damage and knocks the target back.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_ridethewind.jpg',
    class: 'monk',
    spec: 'mistweaver',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'Chi',
    cost_amount: 2
  },
  {
    name: 'Thunder Focus Tea',
    spell_id: '116680',
    description: 'Focus your energy, enhancing your next spell cast.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_thunderfocustea.jpg',
    class: 'monk',
    spec: 'mistweaver',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 30,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  // Hero talent actives
  {
    name: 'Celestial Conduit',
    spell_id: '440507',
    description: 'Creates a conduit of celestial energy that enhances your healing abilities.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_ability_conduitofthecelestialsmonk_celestialconduit.jpg',
    class: 'monk',
    spec: null,
    hero_talent: 'Conduit Of The Celestials',
    ability_type: 'hero_talent',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },

  {
    name: 'Touch of Karma',
    spell_id: '122470',
    description: 'Transfers 50% of damage taken to the target for 10 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_touchofkarma.jpg',
    class: 'monk',
    spec: 'windwalker',
    hero_talent: null,
    ability_type: 'spec',
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
      // --- Seed core/class abilities once per version (available to all specs) ---
      for (const ability of coreAbilities) {
        await Ability.create({ ...ability, spec: null, game_version: version._id });
        created++;
      }

      // --- Seed spec-specific abilities ---
      const specs = ['brewmaster', 'windwalker', 'mistweaver'];
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
