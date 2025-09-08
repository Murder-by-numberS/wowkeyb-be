const abilities = [
  {
    id: 1,
    spellId: 17,
    name: 'Power Word: Shield',
    description: 'Shields an ally, absorbing damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg'
  },
  {
    id: 2,
    spellId: 585,
    name: 'Smite',
    description: 'Smites an enemy, dealing Holy damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_holysmite.jpg'
  },
  {
    id: 3,
    spellId: 139,
    name: 'Renew',
    description: 'Heals the target over time.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_renew.jpg'
  },
  {
    id: 4,
    spellId: 2061,
    name: 'Flash Heal',
    description: 'A quick, efficient heal.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg'
  },
  {
    id: 5,
    spellId: 8122,
    name: 'Psychic Scream',
    description: 'Causes enemies within 8 yards to flee in fear.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_psychicscream.jpg'
  },
  {
    id: 6,
    spellId: 2006,
    name: 'Resurrection',
    description: 'Brings a dead ally back to life with health and mana.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_resurrection.jpg'
  },
  {
    id: 7,
    spellId: 586,
    name: 'Fade',
    description: 'Reduces your threat, making you less likely to be attacked.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_magic_lesserinvisibilty.jpg'
  },
  {
    id: 8,
    spellId: 1706,
    name: 'Levitate',
    description: 'Allows the target to levitate, reducing fall damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_layonhands.jpg'
  }
];

const archonAbilities = [
  {
    id: 1,
    name: 'Archon\'s Halo',
    description: 'Enhances healing abilities and makes Halo an extremely potent healing cooldown.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_archon.jpg'
  },
  {
    id: 2,
    name: 'Surge of Light',
    description: 'Improves triage healing capabilities with stronger Surge of Light procs.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_surgeoflight.jpg'
  },
  {
    id: 3,
    name: 'Holy Word: Salvation',
    description: 'Additional healing after Holy Word: Salvation and during Apotheosis.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_salvation.jpg'
  },
  {
    id: 1,
    name: 'Voidheart',
    description: 'Increases your Atonement healing massively.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_voidheart.jpg'
  },
  {
    id: 2,
    name: 'Dark Energy',
    description: 'Increases your movement speed while a rift is active.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_darkenergy.jpg'
  },
  {
    id: 3,
    name: 'Entropic Rift',
    description: 'Every Mind Blast opens an Entropic Rift that deals damage and provides buffs.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_entropicrift.jpg'
  },
  {
    id: 1,
    name: 'Void Eruption',
    description: 'Unleashes an eruption of void energy, dealing Shadow damage to all enemies within 10 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_voideruption.jpg'
  },
  {
    id: 2,
    name: 'Dark Ascension',
    description: 'Ascend into darkness, increasing your Shadow damage dealt for a short duration.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_darkascension.jpg'
  },
  {
    id: 3,
    name: 'Mind Spike: Insanity',
    description: 'Empowers your Mind Spike, causing it to deal significantly more damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindspike.jpg'
  }
];

const oracleAbilities = [
  {
    id: 1,
    name: 'Future Sight',
    description: 'Grants insights into the future to protect and empower allies.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_futuresight.jpg'
  },
  {
    id: 2,
    name: 'Blessings of the Oracle',
    description: 'Bestows unique blessings and benefits upon allies before they are needed.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingsoftheoracle.jpg'
  },
  {
    id: 1,
    name: 'Embrace the Shadow',
    description: 'Gives you additional damage reduction to all magic damage and heals you when struck by shadow damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_embracetheshadow.jpg'
  },
  {
    id: 2,
    name: 'Darkening Horizon',
    description: 'Provides significant buffs and benefits, making it the default choice for many situations.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_darkeninghorizon.jpg'
  }
];
const voidweaverAbilities = [
  {
    id: 1,
    name: 'Void Torrent',
    description: 'Channels a torrent of void energy, dealing massive Shadow damage over time.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_voidtorrent.jpg'
  },
  {
    id: 2,
    name: 'Shadow Crash',
    description: 'Hurls a bolt of slow-moving Shadow energy at the destination, dealing Shadow damage to all enemies within 8 yards.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowcrash.jpg'
  },
  {
    id: 3,
    name: 'Surrender to Madness',
    description: 'Surrender to the Old Gods, increasing your damage dealt but causing you to take increased damage.',
    icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_surrendertomadness.jpg'
  }
];

const specAbilities = {
  holy: {
    abilities: [
      {
        id: 1,
        spellId: 2060,
        name: 'Heal',
        description: 'A slow but powerful heal that restores a large amount of health.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_heal.jpg'
      },
      {
        id: 2,
        spellId: 139,
        name: 'Renew',
        description: 'Heals the target over time.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_renew.jpg'
      },
      {
        id: 3,
        spellId: 34861,
        name: 'Circle of Healing',
        description: 'Heals up to 5 friendly party or raid members within 30 yards of the target.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_circleofrenewal.jpg'
      },
      {
        id: 4,
        spellId: 64843,
        name: 'Divine Hymn',
        description: 'Heals all party or raid members within 40 yards for a significant amount over 8 seconds.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_divinehymn.jpg'
      },
      {
        id: 5,
        spellId: 47788,
        name: 'Guardian Spirit',
        description: 'Calls upon a guardian spirit to watch over the friendly target, increasing healing received and preventing death by sacrificing itself.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_guardianspirit.jpg'
      }
    ],
    'archon': archonAbilities,
    'oracle': oracleAbilities
  },
  discipline: {
    abilities: [
      {
        id: 1,
        spellId: 17,
        name: 'Power Word: Shield',
        description: 'Shields an ally, absorbing damage.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg'
      },
      {
        id: 2,
        spellId: 47540,
        name: 'Penance',
        description: 'Launches a volley of holy light at the target, healing an ally or damaging an enemy.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_penance.jpg'
      },
      {
        id: 3,
        spellId: 585,
        name: 'Smite',
        description: 'Smites an enemy, dealing Holy damage.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_holysmite.jpg'
      },
      {
        id: 4,
        spellId: 33206,
        name: 'Pain Suppression',
        description: 'Reduces damage taken by a friendly target.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_painsupression.jpg'
      }
    ],
    'oracle': oracleAbilities,
    'voidweaver': voidweaverAbilities
  },
  shadow: {
    abilities: [
      {
        id: 1,
        spellId: 8092,
        name: 'Mind Blast',
        description: 'Blasts the target\'s mind for Shadow damage.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_unholyfrenzy.jpg'
      },
      {
        id: 2,
        spellId: 15407,
        name: 'Mind Flay',
        description: 'Assaults the target\'s mind with Shadow energy, causing Shadow damage over time.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_siphonmana.jpg'
      },
      {
        id: 3,
        spellId: 34914,
        name: 'Vampiric Touch',
        description: 'A touch of darkness that causes Shadow damage over time and heals the caster.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_blackplague.jpg'
      },
      {
        id: 4,
        spellId: 589,
        name: 'Shadow Word: Pain',
        description: 'A word of darkness that causes Shadow damage over time.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowwordpain.jpg'
      },
      {
        id: 5,
        spellId: 232698,
        name: 'Shadowform',
        description: 'Assume a Shadowform, increasing your Shadow damage dealt.',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowform.jpg'
      }
    ],
    'archon': archonAbilities,
    'voidweaver': voidweaverAbilities
  }

}



export default { specAbilities, abilities }
