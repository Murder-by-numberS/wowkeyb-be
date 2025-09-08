const specAbilities = {
  arcane: {
    abilities: [
      {
        id: 1, spellId: 30451, name: 'Arcane Blast', description: 'Blasts the target with energy, dealing Arcane damage. Each time you cast Arcane Blast, the damage of subsequent Arcane Blasts is increased by 15% and mana cost is increased by 200%.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_blast.jpg'
      },
      {
        id: 2, spellId: 44425, name: 'Arcane Barrage', description: 'Launches several missiles at the enemy target, causing Arcane damage.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanebarrage.jpg'
      },
      {
        id: 3, spellId: 12042, name: 'Arcane Power', description: 'Increases your damage by 20% and mana cost by 20% for 15 sec.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_lightning.jpg'
      },
      {
        id: 4, spellId: 205025, name: 'Presence of Mind', description: 'Your next spell with a cast time less than 10 sec becomes an instant cast spell.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_enchantarmor.jpg'
      },
      {
        id: 5, spellId: 12051, name: 'Evocation', description: 'Regenerates 60% of your total mana over 6 sec.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_purge.jpg'
      },
      {
        id: 6, spellId: 5143, name: 'Arcane Missiles', description: 'Launches magical missiles at an enemy, causing Arcane damage.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_starfall.jpg'
      }
    ],
    'spellslinger': [],
    'sunfury': []
  },
  fire: {
    abilities: [
      {
        id: 1, spellId: 133, name: 'Fireball', description: 'Launches a fiery ball that causes Fire damage.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_flamebolt.jpg'
      },
      {
        id: 2, spellId: 2136, name: 'Fire Blast', description: 'Instantly blasts an enemy for Fire damage.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fireball.jpg'
      },
      {
        id: 3, spellId: 190319, name: 'Combustion', description: 'Engulfs you in flames for 10 sec, increasing your critical strike chance by 100% and allowing your Fire damage over time effects to critically strike.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_sealoffire.jpg'
      },
      {
        id: 4, spellId: 31661, name: 'Dragon\'s Breath', description: 'Blasts targets in front of you with a cone of flame, causing Fire damage and disorienting them for 4 sec.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_head_dragon_01.jpg'
      },
      {
        id: 5, spellId: 194466, name: 'Phoenix Flames', description: 'Hurls a Phoenix that deals Fire damage to the target and reduces the cooldown of Fire Blast.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_summerfest_firespirit.jpg'
      },
      {
        id: 6, spellId: 44457, name: 'Living Bomb', description: 'The target becomes a Living Bomb, taking Fire damage over 12 sec. When Living Bomb expires or is dispelled, the target explodes dealing Fire damage to nearby enemies.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_mage_livingbomb.jpg'
      },
      {
        id: 7, spellId: 153561, name: 'Meteor', description: 'Calls down a meteor that lands at the target location after 3 sec, dealing Fire damage to all enemies within 8 yards.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_mage_meteor.jpg'
      }
    ],
    'frostfire': [],
    'sunfury': []
  },
  frost: {
    abilities: [
      {
        id: 1, spellId: 116, name: 'Frostbolt', description: 'Launches a bolt of frost at the enemy, causing Frost damage and slowing movement speed.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostbolt02.jpg'
      },
      {
        id: 2, spellId: 30455, name: 'Ice Lance', description: 'Quickly fling a shard of ice at the target, dealing Frost damage.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostblast.jpg'
      },
      {
        id: 3, spellId: 84714, name: 'Frozen Orb', description: 'Launches an orb of swirling ice up to 40 yards forward which deals Frost damage to enemies it passes through.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frozenorb.jpg'
      },
      {
        id: 4, spellId: 12472, name: 'Icy Veins', description: 'Increases your haste by 30% for 20 sec.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_coldhearted.jpg'
      },
      {
        id: 5, spellId: 10, name: 'Blizzard', description: 'Ice shards pelt the target area, dealing Frost damage over 8 sec and slowing movement by 50%.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_icestorm.jpg'
      },
      {
        id: 6, spellId: 120, name: 'Cone of Cold', description: 'Targets in a cone in front of you take Frost damage and have their movement speed reduced by 50% for 8 sec.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_glacier.jpg'
      },
      {
        id: 7, spellId: 122, name: 'Frost Nova', description: 'Blasts enemies within 10 yards for Frost damage and freezes them in place for 8 sec.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostnova.jpg'
      },
      {
        id: 8, spellId: 11426, name: 'Ice Barrier', description: 'Shields you with ice, absorbing damage for 1 min.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_ice_lament.jpg'
      }
    ],
    'frostfire': [],
    'spellslinger': []
  }
}

//class abilities
const abilities = [
  {
    id: 1, spellId: 1459, name: 'Arcane Intellect', description: 'Increases the target\'s Intellect by 5 for 1 hour.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg'
  },
  {
    id: 2, spellId: 2136, name: 'Fire Blast', description: 'Instantly blasts an enemy for Fire damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fireball.jpg'
  },
  {
    id: 3, spellId: 116, name: 'Frostbolt', description: 'Launches a bolt of frost at the enemy, causing Frost damage and slowing movement speed.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostbolt02.jpg'
  },
  {
    id: 4, spellId: 1449, name: 'Arcane Explosion', description: 'Causes an explosion of arcane magic around the caster, dealing Arcane damage to all nearby enemies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_wispsplode.jpg'
  },
  {
    id: 5, spellId: 118, name: 'Polymorph', description: 'Transforms the enemy into a sheep, forcing them to wander around for up to 50 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_polymorph.jpg'
  },
  {
    id: 6, spellId: 42955, name: 'Conjure Refreshment', description: 'Conjures 5 pieces of food and 5 bottles of water that can be consumed to restore health and mana.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_food_11.jpg'
  },
  {
    id: 7, spellId: 1953, name: 'Blink', description: 'Teleports you 20 yards forward in the direction you are facing.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_blink.jpg'
  },
  {
    id: 8, spellId: 2139, name: 'Counterspell', description: 'Counters an enemy\'s spellcast, preventing any spell in that school from being cast for 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_iceshock.jpg'
  },
  {
    id: 9, spellId: 475, name: 'Remove Curse', description: 'Removes 1 Curse from a friendly target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_removecurse.jpg'
  },
  {
    id: 10, spellId: 3561, name: 'Teleport', description: 'Teleports you to a major city.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_teleportstormwind.jpg'
  },
  {
    id: 11, spellId: 10059, name: 'Portal', description: 'Creates a portal, teleporting group members that use it to a major city.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_portalstormwind.jpg'
  },
  {
    id: 12, spellId: 66, name: 'Invisibility', description: 'Makes you invisible for 20 sec, reducing threat each second.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_mage_invisibility.jpg'
  },
  {
    id: 13, spellId: 30449, name: 'Spellsteal', description: 'Steals a beneficial magic effect from the target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcane02.jpg'
  },
  {
    id: 14, spellId: 80353, name: 'Time Warp', description: 'Increases haste by 30% for all party and raid members for 40 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_mage_timewarp.jpg'
  },
  {
    id: 15, spellId: 120, name: 'Cone of Cold', description: 'Targets in a cone in front of you take Frost damage and have their movement speed reduced by 50% for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_glacier.jpg'
  }
];

export default { specAbilities, abilities }
