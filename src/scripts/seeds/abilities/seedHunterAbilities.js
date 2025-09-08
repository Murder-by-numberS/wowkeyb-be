import mongoose from 'mongoose';
import Ability from '../../../models/ability.js';
import Version from '../../../models/version.js';
import Config from '../../../config/config.js';

// Core/class hunter abilities
const coreAbilities = [
  {
    name: 'Aspect of the Cheetah',
    spell_id: '186257',
    description: 'Increases your movement speed by 90% for 3 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_mount_jungletiger.jpg',
    class: 'hunter',
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
    name: 'Aspect of the Turtle',
    spell_id: '186265',
    description: 'Reduces all damage taken by 30% for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_pet_turtle.jpg',
    class: 'hunter',
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
    name: 'Binding Shot',
    spell_id: '109248',
    description: 'Fires a magical projectile, tethering the enemy and any other enemies within 5 yards together for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_corrosivebreath.jpg',
    class: 'hunter',
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
    name: 'Call Pet',
    spell_id: '982',
    description: 'Calls your pet to your side.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
    class: 'hunter',
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
    name: 'Counter Shot',
    spell_id: '147362',
    description: 'A quick shot that interrupts the enemy\'s spellcasting and prevents any spell in that school from being cast for 3 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_ammo_arrow_03.jpg',
    class: 'hunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 24,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Disengage',
    spell_id: '781',
    description: 'Leap backwards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_feint.jpg',
    class: 'hunter',
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
    name: 'Exhilaration',
    spell_id: '109304',
    description: 'Instantly heals you for 30% of maximum health and your pet for 100% of its maximum health.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_onewithnature.jpg',
    class: 'hunter',
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
    name: 'Explosive Shot',
    spell_id: '212431',
    description: 'You fire an explosive charge into the enemy target, dealing Fire damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_explosiveshot.jpg',
    class: 'hunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 30,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Feign Death',
    spell_id: '5384',
    description: 'Feign death, causing enemies to ignore you for 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_feigndeath.jpg',
    class: 'hunter',
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
    name: 'Flare',
    spell_id: '1543',
    description: 'Reveals stealthed enemies within 10 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_flare.jpg',
    class: 'hunter',
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
    name: 'Freezing Shot',
    spell_id: '187650',
    description: 'A powerful shot that deals Frost damage and has a chance to freeze the target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_chainsofice.jpg',
    class: 'hunter',
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
    name: 'Hunter\'s Mark',
    spell_id: '257284',
    description: 'Marks a target, increasing your damage against it by 5%.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_snipershot.jpg',
    class: 'hunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 0,
    range: 100,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Camouflage',
    spell_id: '199483',
    description: 'You and your pet blend into the surroundings and gain stealth for 1 min.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
    class: 'hunter',
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
    name: 'Bursting Shot',
    spell_id: '186387',
    description: 'Fires a shot that explodes on impact, dealing Physical damage and knocking back enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_burstingshot.jpg',
    class: 'hunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 30,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Scatter Shot',
    spell_id: '213691',
    description: 'A short-range shot that deals Physical damage and disorients the target for 4 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_golemstormbolt.jpg',
    class: 'hunter',
    spec: null,
    hero_talent: null,
    ability_type: 'class',
    level_required: 0,
    cooldown: 30,
    range: 20,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Roar of Sacrifice',
    spell_id: '53480',
    description: 'Your pet lets out a roar, transferring 30% of damage taken by the hunter to the pet for 12 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_fervor.jpg',
    class: 'hunter',
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
    name: 'Scare Beast',
    spell_id: '1513',
    description: 'Scares a beast, causing it to run in fear for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_druid_cower.jpg',
    class: 'hunter',
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
    name: 'Concussive Shot',
    spell_id: '5116',
    description: 'Dazes the target, slowing movement speed by 50% for 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_stun.jpg',
    class: 'hunter',
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
    name: 'Tranquilizing Shot',
    spell_id: '19801',
    description: 'Removes 1 Enrage and 1 Magic effect from an enemy target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_drowsy.jpg',
    class: 'hunter',
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
    name: 'Primal Rage',
    spell_id: '264667',
    description: 'Increases the attack power of all party and raid members within 100 yards by 10% for 40 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_unholyfrenzy.jpg',
    class: 'hunter',
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
    name: 'Tar Trap',
    spell_id: '187650',
    description: 'Places a tar trap that slows enemies by 50% for 30 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_yorsahj_bloodboil_black.jpg',
    class: 'hunter',
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
    name: 'Survival of the Fittest',
    spell_id: '264735',
    description: 'Reduces all damage you take by 20% for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_spiritarmor.jpg',
    class: 'hunter',
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
    name: 'Wing Clip',
    spell_id: '195645',
    description: 'A vicious attack that deals Physical damage and reduces the target\'s movement speed by 50% for 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_trip.jpg',
    class: 'hunter',
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
    name: 'Kill Command',
    spell_id: '34026',
    description: 'Orders your pet to attack, causing it to deal Physical damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_killcommand.jpg',
    class: 'hunter',
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
    name: 'Implosive Trap',
    spell_id: '238469',
    description: 'Hurls a trap to the target location that explodes when an enemy approaches, dealing Fire damage and pulling enemies to the trap.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/6bf_explosive_shard.jpg',
    class: 'hunter',
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
  // Beast Mastery spec actives
  {
    name: 'Barbed Shot',
    spell_id: '217200',
    description: 'Fires a shot that deals Physical damage and causes your pet to attack 50% faster for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_barbedshot.jpg',
    class: 'hunter',
    spec: 'beast-mastery',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Bestial Wrath',
    spell_id: '19574',
    description: 'Sends you and your pet into a rage, increasing all damage you both deal by 25% for 15 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_druid_ferociousbite.jpg',
    class: 'hunter',
    spec: 'beast-mastery',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 90,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Cobra Shot',
    spell_id: '193455',
    description: 'A quick shot that deals Nature damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_cobrashot.jpg',
    class: 'hunter',
    spec: 'beast-mastery',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },

  {
    name: 'Multi-Shot',
    spell_id: '2643',
    description: 'Fires a volley of shots at up to 3 enemies within 8 yards of each other.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_upgrademoonglaive.jpg',
    class: 'hunter',
    spec: 'beast-mastery',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Stampede',
    spell_id: '201430',
    description: 'Summons all of your pets to fight for you for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_bestialdiscipline.jpg',
    class: 'hunter',
    spec: 'beast-mastery',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Dire Beast',
    spell_id: '120679',
    description: 'Summons a powerful wild beast that attacks your target for 15 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_longevity.jpg',
    class: 'hunter',
    spec: 'beast-mastery',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Bloodshed',
    spell_id: '321530',
    description: 'Command your pet to tear into the target, causing your target to bleed for Physical damage over 18 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_druid_primaltenacity.jpg',
    class: 'hunter',
    spec: 'beast-mastery',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Call of the Wild',
    spell_id: '359844',
    description: 'Summons all of your pets to fight for you for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_callofthewild.jpg',
    class: 'hunter',
    spec: 'beast-mastery',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  // Marksmanship spec actives
  {
    name: 'Aimed Shot',
    spell_id: '19434',
    description: 'A powerful shot that deals Physical damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_spear_07.jpg',
    class: 'hunter',
    spec: 'marksmanship',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Rapid Fire',
    spell_id: '3045',
    description: 'Increases your attack speed by 40% for 15 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_runningshot.jpg',
    class: 'hunter',
    spec: 'marksmanship',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Trueshot',
    spell_id: '193526',
    description: 'Increases your attack power by 25% for 15 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_trueshot.jpg',
    class: 'hunter',
    spec: 'marksmanship',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Volley',
    spell_id: '260243',
    description: 'Rain a volley of arrows down over 6 sec, dealing Physical damage to all enemies within the area.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_rapidkilling.jpg',
    class: 'hunter',
    spec: 'marksmanship',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 45,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Eagle Eye',
    spell_id: '6197',
    description: 'Allows you to see through the eyes of your pet.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_eagleeye.jpg',
    class: 'hunter',
    spec: 'marksmanship',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Harrier\'s Cry',
    spell_id: '375891',
    description: 'Let out a cry that increases your attack power and that of your pet by 15% for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_111_hunter_ability_harrierscall.jpg',
    class: 'hunter',
    spec: 'marksmanship',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 90,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Steady Shot',
    spell_id: '56641',
    description: 'A steady shot that deals Physical damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_steadyshot.jpg',
    class: 'hunter',
    spec: 'marksmanship',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Arcane Shot',
    spell_id: '185358',
    description: 'A quick shot that deals Arcane damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_impalingbolt.jpg',
    class: 'hunter',
    spec: 'marksmanship',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Kill Shot',
    spell_id: '320976',
    description: 'A powerful shot that deals Physical damage to enemies below 20% health.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_assassinate2.jpg',
    class: 'hunter',
    spec: 'marksmanship',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Misdirection',
    spell_id: '34477',
    description: 'Redirects all threat you cause to the targeted party or raid member for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_misdirection.jpg',
    class: 'hunter',
    spec: 'marksmanship',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 30,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Intimidation',
    spell_id: '19577',
    description: 'Command your pet to intimidate the target, causing a high amount of threat and stunning the target for 3 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_devour.jpg',
    class: 'hunter',
    spec: 'marksmanship',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'High Explosive Trap',
    spell_id: '236776',
    description: 'Hurls a fire trap to the target location that explodes when an enemy approaches, dealing Fire damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_selfdestruct.jpg',
    class: 'hunter',
    spec: 'marksmanship',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 30,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },

  // Survival spec actives
  {
    name: 'Aspect of the Eagle',
    spell_id: '186289',
    description: 'Increases your range by 20 yards for 10 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_hunter_aspectoftheironhawk.jpg',
    class: 'hunter',
    spec: 'survival',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Eyes of the Beast',
    spell_id: '321297',
    description: 'Allows you to see through the eyes of your pet.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_eagleeye.jpg',
    class: 'hunter',
    spec: 'survival',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Butchery',
    spell_id: '212436',
    description: 'A brutal attack that deals Physical damage to all enemies in front of you.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_butcher_cleave.jpg',
    class: 'hunter',
    spec: 'survival',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Coordinated Assault',
    spell_id: '266779',
    description: 'You and your pet charge your enemy, dealing Physical damage and increasing your damage by 20% for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_coordinatedassault.jpg',
    class: 'hunter',
    spec: 'survival',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 120,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Harpoon',
    spell_id: '190925',
    description: 'Hurls a harpoon at an enemy, pulling you to them and dealing Physical damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_harpoon.jpg',
    class: 'hunter',
    spec: 'survival',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 30,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Raptor Strike',
    spell_id: '186270',
    description: 'A vicious attack that deals Physical damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_raptorstrike.jpg',
    class: 'hunter',
    spec: 'survival',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Wildfire Bomb',
    spell_id: '259495',
    description: 'Hurls a bomb at the target location that explodes, dealing Fire damage to all enemies within 8 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_wildfirebomb.jpg',
    class: 'hunter',
    spec: 'survival',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },

  {
    name: 'Mongoose Bite',
    spell_id: '259387',
    description: 'A brutal attack that deals Physical damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_mongoosebite.jpg',
    class: 'hunter',
    spec: 'survival',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 0,
    range: 5,
    cost: 'None',
    cost_amount: 0
  },

  {
    name: 'Flanking Strike',
    spell_id: '269751',
    description: 'You and your pet leap to the target and strike it as one, dealing Physical damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_invigeration.jpg',
    class: 'hunter',
    spec: 'survival',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 30,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Fury of the Eagle',
    spell_id: '203415',
    description: 'Unleash the fury of an eagle, dealing Physical damage to all enemies in front of you.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_polearm_2h_artifacteagle_d_01.jpg',
    class: 'hunter',
    spec: 'survival',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 0,
    cost: 'None',
    cost_amount: 0
  },
  {
    name: 'Spearhead',
    spell_id: '376079',
    description: 'Throw a spear at your target, dealing Physical damage and marking them for increased damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_spearhead.jpg',
    class: 'hunter',
    spec: 'survival',
    hero_talent: null,
    ability_type: 'spec',
    level_required: 0,
    cooldown: 60,
    range: 40,
    cost: 'None',
    cost_amount: 0
  },
];

async function seedHunterAbilities() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(Config.databaseURI);
    console.log('Connected.');

    const versions = await Version.find();
    if (!versions.length) {
      console.error('No versions found!');
      return;
    }

    // Delete all hunter abilities for all versions
    const del = await Ability.deleteMany({ class: 'hunter' });
    console.log(`Deleted ${del.deletedCount} hunter abilities.`);

    let created = 0;
    for (const version of versions) {
      // --- Seed core/class abilities once per version (available to all specs) ---
      for (const ability of coreAbilities) {
        await Ability.create({ ...ability, spec: null, game_version: version._id });
        created++;
      }

      // --- Seed spec-specific abilities ---
      const specs = ['beast-mastery', 'marksmanship', 'survival'];
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
        // For hero talents, create them as-is (spec: null, hero_talent: 'death_chakram')
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
    console.log(`Seeded ${created} hunter abilities for ${versions.length} versions.`);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedHunterAbilities();
}

export default seedHunterAbilities;
