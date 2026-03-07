const CLASS_SPEC_HERO_CATALOG = [
  {
    value: 'deathknight',
    label: 'Death Knight',
    specs: [
      { value: 'blood', label: 'Blood', spec_id: 250 },
      { value: 'frost', label: 'Frost', spec_id: 251 },
      { value: 'unholy', label: 'Unholy', spec_id: 252 },
    ],
    hero_talents: [
      { value: 'deathbringer', label: 'Deathbringer' },
      { value: 'san-layn', label: "San'layn" },
      { value: 'rider-of-the-apocalypse', label: 'Rider of the Apocalypse' },
    ],
  },
  {
    value: 'demonhunter',
    label: 'Demon Hunter',
    specs: [
      { value: 'havoc', label: 'Havoc', spec_id: 577 },
      { value: 'vengeance', label: 'Vengeance', spec_id: 581 },
    ],
    hero_talents: [
      { value: 'aldrachi-reaver', label: 'Aldrachi Reaver' },
      { value: 'fel-scarred', label: 'Fel-Scarred' },
    ],
  },
  {
    value: 'druid',
    label: 'Druid',
    specs: [
      { value: 'balance', label: 'Balance', spec_id: 102 },
      { value: 'feral', label: 'Feral', spec_id: 103 },
      { value: 'guardian', label: 'Guardian', spec_id: 104 },
      { value: 'restoration', label: 'Restoration', spec_id: 105 },
    ],
    hero_talents: [
      { value: 'elunes-chosen', label: "Elune's Chosen" },
      { value: 'keeper-of-the-grove', label: 'Keeper of the Grove' },
      { value: 'druid-of-the-claw', label: 'Druid of the Claw' },
      { value: 'wildstalker', label: 'Wildstalker' },
    ],
  },
  {
    value: 'evoker',
    label: 'Evoker',
    specs: [
      { value: 'devastation', label: 'Devastation', spec_id: 1467 },
      { value: 'preservation', label: 'Preservation', spec_id: 1468 },
      { value: 'augmentation', label: 'Augmentation', spec_id: 1473 },
    ],
    hero_talents: [
      { value: 'flameshaper', label: 'Flameshaper' },
      { value: 'scalecommander', label: 'Scalecommander' },
      { value: 'chronowarden', label: 'Chronowarden' },
    ],
  },
  {
    value: 'hunter',
    label: 'Hunter',
    specs: [
      { value: 'beast-mastery', label: 'Beast Mastery', spec_id: 253 },
      { value: 'marksmanship', label: 'Marksmanship', spec_id: 254 },
      { value: 'survival', label: 'Survival', spec_id: 255 },
    ],
    hero_talents: [
      { value: 'dark-ranger', label: 'Dark Ranger' },
      { value: 'pack-leader', label: 'Pack Leader' },
      { value: 'sentinel', label: 'Sentinel' },
    ],
  },
  {
    value: 'mage',
    label: 'Mage',
    specs: [
      { value: 'arcane', label: 'Arcane', spec_id: 62 },
      { value: 'fire', label: 'Fire', spec_id: 63 },
      { value: 'frost', label: 'Frost', spec_id: 64 },
    ],
    hero_talents: [
      { value: 'spellslinger', label: 'Spellslinger' },
      { value: 'sunfury', label: 'Sunfury' },
      { value: 'frostfire', label: 'Frostfire' },
    ],
  },
  {
    value: 'monk',
    label: 'Monk',
    specs: [
      { value: 'brewmaster', label: 'Brewmaster', spec_id: 268 },
      { value: 'mistweaver', label: 'Mistweaver', spec_id: 270 },
      { value: 'windwalker', label: 'Windwalker', spec_id: 269 },
    ],
    hero_talents: [
      { value: 'master-of-harmony', label: 'Master of Harmony' },
      { value: 'shado-pan', label: 'Shado-Pan' },
      { value: 'conduit-of-the-celestials', label: 'Conduit of the Celestials' },
    ],
  },
  {
    value: 'paladin',
    label: 'Paladin',
    specs: [
      { value: 'holy', label: 'Holy', spec_id: 65 },
      { value: 'protection', label: 'Protection', spec_id: 66 },
      { value: 'retribution', label: 'Retribution', spec_id: 70 },
    ],
    hero_talents: [
      { value: 'herald-of-the-sun', label: 'Herald of the Sun' },
      { value: 'lightsmith', label: 'Lightsmith' },
      { value: 'templar', label: 'Templar' },
    ],
  },
  {
    value: 'priest',
    label: 'Priest',
    specs: [
      { value: 'discipline', label: 'Discipline', spec_id: 256 },
      { value: 'holy', label: 'Holy', spec_id: 257 },
      { value: 'shadow', label: 'Shadow', spec_id: 258 },
    ],
    hero_talents: [
      { value: 'archon', label: 'Archon' },
      { value: 'oracle', label: 'Oracle' },
      { value: 'voidweaver', label: 'Voidweaver' },
    ],
  },
  {
    value: 'rogue',
    label: 'Rogue',
    specs: [
      { value: 'assassination', label: 'Assassination', spec_id: 259 },
      { value: 'outlaw', label: 'Outlaw', spec_id: 260 },
      { value: 'subtlety', label: 'Subtlety', spec_id: 261 },
    ],
    hero_talents: [
      { value: 'deathstalker', label: 'Deathstalker' },
      { value: 'fatebound', label: 'Fatebound' },
      { value: 'trickster', label: 'Trickster' },
    ],
  },
  {
    value: 'shaman',
    label: 'Shaman',
    specs: [
      { value: 'elemental', label: 'Elemental', spec_id: 262 },
      { value: 'enhancement', label: 'Enhancement', spec_id: 263 },
      { value: 'restoration', label: 'Restoration', spec_id: 264 },
    ],
    hero_talents: [
      { value: 'farseer', label: 'Farseer' },
      { value: 'stormbringer', label: 'Stormbringer' },
      { value: 'totemic', label: 'Totemic' },
    ],
  },
  {
    value: 'warlock',
    label: 'Warlock',
    specs: [
      { value: 'affliction', label: 'Affliction', spec_id: 265 },
      { value: 'demonology', label: 'Demonology', spec_id: 266 },
      { value: 'destruction', label: 'Destruction', spec_id: 267 },
    ],
    hero_talents: [
      { value: 'hellcaller', label: 'Hellcaller' },
      { value: 'soul-harvester', label: 'Soul Harvester' },
      { value: 'diabolist', label: 'Diabolist' },
    ],
  },
  {
    value: 'warrior',
    label: 'Warrior',
    specs: [
      { value: 'arms', label: 'Arms', spec_id: 71 },
      { value: 'fury', label: 'Fury', spec_id: 72 },
      { value: 'protection', label: 'Protection', spec_id: 73 },
    ],
    hero_talents: [
      { value: 'colossus', label: 'Colossus' },
      { value: 'slayer', label: 'Slayer' },
      { value: 'mountain-thane', label: 'Mountain Thane' },
    ],
  },
];

const CLASS_ENUM = CLASS_SPEC_HERO_CATALOG.map((entry) => entry.value);
const SPEC_BY_CLASS = Object.fromEntries(
  CLASS_SPEC_HERO_CATALOG.map((entry) => [entry.value, entry.specs.map((spec) => spec.value)])
);
const HERO_TALENTS_BY_CLASS = Object.fromEntries(
  CLASS_SPEC_HERO_CATALOG.map((entry) => [entry.value, entry.hero_talents.map((hero) => hero.value)])
);
const SPEC_ENUM_FLAT = Object.values(SPEC_BY_CLASS).flat();
const HERO_TALENTS_ENUM_FLAT = Object.values(HERO_TALENTS_BY_CLASS).flat();

const CLASS_LABEL_BY_VALUE = {};
const SPEC_LABEL_BY_VALUE = {};
const HERO_LABEL_BY_VALUE = {};
for (const classEntry of CLASS_SPEC_HERO_CATALOG) {
  CLASS_LABEL_BY_VALUE[classEntry.value] = classEntry.label;
  for (const spec of classEntry.specs) {
    SPEC_LABEL_BY_VALUE[spec.value] = spec.label;
  }
  for (const hero of classEntry.hero_talents) {
    HERO_LABEL_BY_VALUE[hero.value] = hero.label;
  }
}

function slugForMatch(value, compact = false) {
  if (!value && value !== 0) return null;
  let normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/['`]/g, '')
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  if (!normalized) return null;
  if (compact) {
    normalized = normalized.replace(/-/g, '');
  }
  return normalized || null;
}

function normalizeClassValue(value) {
  const compact = slugForMatch(value, true);
  if (!compact) return null;
  if (CLASS_ENUM.includes(compact)) return compact;

  const alias = {
    dk: 'deathknight',
    dh: 'demonhunter',
  };
  return alias[compact] || compact;
}

function normalizeSpecValue(value) {
  const slug = slugForMatch(value);
  if (!slug) return null;
  const alias = {
    beastmastery: 'beast-mastery',
    'beast-mastery': 'beast-mastery',
  };
  return alias[slug] || alias[slug.replace(/-/g, '')] || slug;
}

function normalizeHeroTalentValue(value) {
  const slug = slugForMatch(value);
  if (!slug) return null;
  const compact = slug.replace(/-/g, '');
  const alias = {
    sanlayn: 'san-layn',
    rideroftheapocalypse: 'rider-of-the-apocalypse',
    eluneschosen: 'elunes-chosen',
    masterofharmony: 'master-of-harmony',
    shadopan: 'shado-pan',
    conduitofthecelestials: 'conduit-of-the-celestials',
    heraldofthesun: 'herald-of-the-sun',
    keeperofthegrove: 'keeper-of-the-grove',
    druidoftheclaw: 'druid-of-the-claw',
    darkranger: 'dark-ranger',
    packleader: 'pack-leader',
    soulharvester: 'soul-harvester',
    mountainthane: 'mountain-thane',
    aldrachireaver: 'aldrachi-reaver',
    felscarred: 'fel-scarred',
  };
  return alias[compact] || slug;
}

function getClassLabel(value) {
  const normalized = normalizeClassValue(value);
  return (normalized && CLASS_LABEL_BY_VALUE[normalized]) || value;
}

function getSpecLabel(value) {
  const normalized = normalizeSpecValue(value);
  return (normalized && SPEC_LABEL_BY_VALUE[normalized]) || value;
}

function getHeroTalentLabel(value) {
  const normalized = normalizeHeroTalentValue(value);
  return (normalized && HERO_LABEL_BY_VALUE[normalized]) || value;
}

export {
  CLASS_SPEC_HERO_CATALOG,
  CLASS_ENUM,
  SPEC_BY_CLASS,
  HERO_TALENTS_BY_CLASS,
  SPEC_ENUM_FLAT,
  HERO_TALENTS_ENUM_FLAT,
  normalizeClassValue,
  normalizeSpecValue,
  normalizeHeroTalentValue,
  getClassLabel,
  getSpecLabel,
  getHeroTalentLabel,
};
