const specAbilities = {
  holy: {
    abilities: [
      {
        id: 1, spellId: 212056, name: 'Absolution', description: 'Returns all dead party members to life with 35% of maximum health and mana. Cannot be cast when in combat.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 2, spellId: 31821, name: 'Aura Mastery', description: 'Empowers your chosen aura for 8 sec.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 3, spellId: 148039, name: 'Barrier of Faith', description: 'Imbue a friendly target with a Barrier of Faith, absorbing damage for 12 sec. For the next 24 sec, Barrier of Faith accumulates 20% of effective healing from your Flash of Light, Holy Light, or Holy Shock spells. Every 6 sec, the accumulated healing becomes an absorb shield.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 4, spellId: 156910, name: 'Beacon of Faith', description: 'Mark a second target as a Beacon, mimicking the effects of Beacon of Light. Your heals will now heal both of your Beacons but at 30% reduced effectiveness',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 5, spellId: 200025, name: 'Beacon of Virtue', description: 'Apply a Beacon of Light to your target and 4 injured allies within 30 yds for 8 sec.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 6, spellId: 388007, name: 'Blessing of Summer', description: 'Bless an ally for 30 sec, causing 12% of all healing to be converted into damage onto a nearby enemy and 12% of all damage to be converted into healing onto an injured ally within 40 yds.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 7, spellId: 4987, name: 'Cleanse', description: 'Cleans a friendly target removing all Poison, Disease, and Magic effects.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 8, spellId: 498, name: 'Divine Protection', description: 'Reduces all damage you take by 20% for 8 sec. Usable while stunned.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 9, spellId: 414273, name: 'Hand of Divinity', description: 'Call upon the Light to empower your spells, causing your next 2 Holy Lights to heal 30% more, cost 50% less mana, and be instant cast.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 10, spellId: 82326, name: 'Holy Light', description: 'A powerful but expensive spell, healing a friendly target.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 11, spellId: 114165, name: 'Holy Prism', description: 'Fires a beam of light that scatters to strike a clump of targets.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 12, spellId: 20473, name: 'Holy Shock', description: 'Triggers a burst of Light on the target, dealing holy damage to an enemy or healing to an ally.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 13, spellId: 85222, name: 'Light of Dawn', description: 'Unleashes a wave of Holy energy, healing up to 5 injured allies within a frontal cone.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 14, spellId: 200652, name: 'Tyr\'s Deliverance', description: 'Releases the Light within yourself, healing 5 injured allies instantly and an injured ally every 0.8 sec for 20 sec within 40 yds.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 15, spellId: 415091, name: 'Shield of the Righteous', description: 'Slams enemies in front of you with your shield, causing Holy damage, and reducing the cooldown of Crusader Strike.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      }
    ],
    'herald-of-the-sun': [],
    'lightsmith': []
  },
  protection: {
    abilities: [
      {
        id: 1, spellId: 31850, name: 'Ardent Defender', description: 'Reduces all damage you take by 20% for 8 sec.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 2, spellId: 31935, name: 'Avenger\'s Shield', description: 'Hurls your shield at an enemy target, dealing Holy damage, interrupting and silencing the non-Player target for 3 sec, and then jumping to 2 additional nearby enemies. Shields you for 8 sec, absorbing 60% as much damage as it dealt. Deals additional damage to all enemies within 5 yds of each target hit.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 3, spellId: 204019, name: 'Blessed Hammer', description: 'Throws a Blessed Hammer that spirals outward, dealing Holy damage to enemies and reducing the next damage they deal to you.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 4, spellId: 213644, name: 'Cleanse Toxins', description: 'Cleanses a friendly target, removing all Poison and Disease effects.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 5, spellId: 86659, name: 'Guardian of Ancient Kings', description: 'Empowers you with the spirit of ancient kings, reducing all damage you take by 50% for 8 sec.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 6, spellId: 53600, name: 'Shield of the Righteous', description: 'Slams enemies in front of you with your shield, causing Holy damage, and increasing your armor.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_paladin_shieldofvengeance.jpg'
      }
    ],
    'lightsmith': [],
    'templar': []
  },
  retribution: {
    abilities: [
      {
        id: 1, spellId: 184575, name: 'Blade of Justice', description: 'Pierce enemies with a blade of light, dealing Holy damage to your target, and Holy damage to nearby enemies.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 2, spellId: 213644, name: 'Cleanse Toxins', description: 'Cleanses a friendly target, removing all Poison and Disease effects.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 3, spellId: 498, name: 'Divine Protection', description: 'Reduces all damage you take by 20% for 8 sec. Usable while stunned.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 4, spellId: 53385, name: 'Divine Storm', description: 'Unleashes a whirl of divine energy, dealing Holy damage to all nearby enemies.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 5, spellId: 383328, name: 'Final Verdict', description: 'Unleashes a powerful weapon strike that deals Holy damage to an enemy target.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 6, spellId: 255937, name: 'Wake of Ashes', description: 'Lash out at your enemies, dealing Radiant damage to all enemies within 14 yds in front of you, and applying Truth\'s Wake, burning the targets for an additional damage over 9 sec.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 7, spellId: 198034, name: 'Divine Hammer', description: 'Divine Hammers spin around you consuming a Holy Power to strike enemies within 8 yds for Holy damage every 1.7 sec.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 8, spellId: 198034, name: 'Divine Hammer', description: 'Divine Hammers spin around you consuming a Holy Power to strike enemies within 8 yds for Holy damage every 1.7 sec.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 9, spellId: 215661, name: 'Justicar\'s Vengeance', description: 'Focuses Holy energy to deliver a powerful weapon strike that deals Holy damage, and restores 3% of your maximum health.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 10, spellId: 215661, name: 'Shield of Vengeance', description: 'Creates a barrier of holy light that absorbs damage for 10 sec.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 11, spellId: 343721, name: 'Final Reckoning', description: 'Call down a blast of heavenly energy, dealing Holy damage to all targets in the area and causing them to take 30% increased damage from your single target Holy Power abilities, and 15% increased damage from other Holy Power abilities for 12 sec.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 12, spellId: 343527, name: 'Execution Sentence', description: 'A hammer slowly falls from the sky upon the target, after 8 sec, they suffer 20% of the damage taken from your abilities as Holy damage during that time.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
      {
        id: 13, spellId: 53600, name: 'Shield of the Righteous', description: 'Slams enemies in front of you with your shield, causing Holy damage, and increasing your armor.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_paladin_shieldofvengeance.jpg'
      }
    ],
    'herald-of-the-sun': [],
    'templar': []
  }
}

const abilities = [
  {
    id: 1, spellId: 31884, name: 'Avenging Wrath', description: 'Call upon the Light to become an avatar of retribution, allowing Hammer of Wrath to be used on any target, increasing your damage, healing and critical strike chance by 15% for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 2, spellId: 1044, name: 'Blessing of Freedom', description: 'Blesses a party or raid member, granting immunity to movement impairing effects for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 3, spellId: 1022, name: 'Blessing of Protection', description: 'Blesses a party or raid member, granting immunity to Physical damage and harmful effects for 10 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 4, spellId: 6940, name: 'Blessing of Sacrifice', description: 'Blesses a party or raid member, reducing their damage taken by 30%, but you suffer 100% of the damage prevented.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 5, spellId: 115750, name: 'Blinding Light', description: 'Emits dazzling light in all directions, blinding enemies within 10 yds, causing them to wander disoriented for 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 6, spellId: 26573, name: 'Consecration', description: 'Consecrates the land beneath you, causing Holy damage over 12 sec to enemies who enter the area. Limit 1',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 7, spellId: 35395, name: 'Crusader Strike', description: 'Strike the target for Physical damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 8, spellId: 642, name: 'Divine Shield', description: 'Grants Immunity to all damage, harmful effects, knockbacks and forced movement effects for 8 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 9, spellId: 190784, name: 'Divine Steed', description: 'Leap atop your Charger for 3 sec, increasing movement speed by 100%. Usable while indoors or in combat',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 10, spellId: 375576, name: 'Divine Toll', description: '',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 11, spellId: 19750, name: 'Flash of Light', description: 'Quickly heal a friendly target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 12, spellId: 853, name: 'Hammer of Justice', description: 'Stuns the target for 6 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 13, spellId: 24275, name: 'Hammer of Wrath', description: 'Hurls a divine hammer that strikes an enemy for Holy damage. Only usable on enemies that have less than 20% health, or during Avenging Wrath.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 14, spellId: 62124, name: 'Hand of Reckoning', description: 'Commands the attention of an enemy target, forcing them to attack you.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 15, spellId: 391054, name: 'Intercession', description: 'Petition the Light on the behalf of a fallen ally, restoring spirit to body and allowing them to reenter battle with 60% health and at least 20% mana.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 16, spellId: 275773, name: 'Judgment', description: 'Judges the target, dealing Holy damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 17, spellId: 633, name: 'Lay on Hands', description: 'Heals a friendly target for an amount equal to 100% of your maximum health.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 18, spellId: 96231, name: 'Rebuke', description: 'Interrupts spellcasting and prevents any spell in that school from being cast for 3 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 19, spellId: 7328, name: 'Redemption', description: 'Brings a dead ally back to life with 35% maximum health and mana. Cannot be cast when in combat.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 20, spellId: 20066, name: 'Repentance', description: 'Forces an enemy to meditate, incapacitating them for 1 min.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 21, spellId: 10326, name: 'Turn Evil', description: 'The power of the Light compels an Undead, Aberration, or Demon target to flee for up to 40 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
  {
    id: 22, spellId: 85673, name: 'Word of Glory', description: 'Calls down the Light to heal a friendly target.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
];

export default { specAbilities, abilities }
