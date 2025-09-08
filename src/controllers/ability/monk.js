const specAbilities = {
  brewmaster: {
    abilities: [
      {
        //EXAMPLE
        id: 1, spellId: 212056, name: 'Absolution', description: 'Returns all dead party members to life with 35% of maximum health and mana. Cannot be cast when in combat.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
    ],
    'master-of-harmony': [],
    'shado-pan': []
  },
  mistweaver: {
    abilities: [
    ],
    'conduit-of-the-celestials': [],
    'master-of-harmony': []
  },
  windwalker: {
    abilities: [
    ],
    'conduit-of-the-celestials': [],
    'shado-pan': []
  }
}

//class abilities
const abilities = [
  {
    //EXAMPLE
    id: 1, spellId: 31884, name: 'Avenging Wrath', description: 'Call upon the Light to become an avatar of retribution, allowing Hammer of Wrath to be used on any target, increasing your damage, healing and critical strike chance by 15% for 20 sec.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
  },
];

export default { specAbilities, abilities }
