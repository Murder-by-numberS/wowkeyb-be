const specAbilities = {
  balance: {
    abilities: [
      {
        //EXAMPLE
        id: 1, spellId: 212056, name: 'Absolution', description: 'Returns all dead party members to life with 35% of maximum health and mana. Cannot be cast when in combat.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg'
      },
    ],
    'elunes-chosen': [],
    'keeper-of-the-grove': []
  },
  feral: {
    abilities: [
    ],
    'druid-of-the-claw': [],
    'wildstalker': []
  },
  guardian: {
    abilities: [
    ],
    'druid-of-the-claw': [],
    'elunes-chosen': []
  },
  restoration: {
    abilities: [
    ],
    'keeper-of-the-grove': [],
    'wildstalker': []
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
