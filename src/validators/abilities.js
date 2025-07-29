import { param, query } from 'express-validator'

export const classes = {
  'deathknight': {
    specs: {
      blood: ['deathbringer', 'san-layn'],
      frost: ['deathbringer', 'rider-of-the-apocalypse'],
      unholy: ['rider-of-the-apocalypse', 'san-layn']
    }
  },
  'demonhunter': {
    specs: {
      havoc: ['aldrachi-reaver', 'fel-scarred'],
      vengeance: ['aldrachi-reaver', 'fel-scarred'],
    }
  },
  'druid': {
    specs: {
      balance: ['elunes-chosen', 'keeper-of-the-grove'],
      feral: ['druid-of-the-claw', 'wildstalker'],
      guardian: ['druid-of-the-claw', 'elunes-chosen'],
      restoration: ['keeper-of-the-grove', 'wildstalker']
    }
  },
  'evoker': {
    specs: {
      devastation: ['flameshaper', 'scalecommander'],
      preservation: ['chronowarden', 'flameshaper'],
      augmentation: ['chronowarden', 'scalecommander']
    }
  },
  'hunter': {
    specs: {
      "beast-mastery": ['dark-ranger', 'pack-leader'],
      marksmanship: ['dark-ranger', 'sentinel'],
      survival: ['pack-leader', 'sentinel']
    }
  },
  'mage': {
    specs: {
      arcane: ['spellslinger', 'sunfury'],
      fire: ['frostfire', 'sunfury'],
      frost: ['frostfire', 'spellslinger']
    }
  },
  'monk': {
    specs: {
      brewmaster: ['master-of-harmony', 'shado-pan'],
      mistweaver: ['conduit-of-the-celestials', 'master-of-harmony'],
      windwalker: ['conduit-of-the-celestials', 'shado-pan']
    }
  },
  'paladin': {
    specs: {
      holy: ['herald-of-the-sun', 'lightsmith'],
      protection: ['lightsmith', 'templar'],
      retribution: ['herald-of-the-sun', 'templar']
    }
  },
  'priest': {
    specs: {
      discipline: ['oracle', 'voidweaver'],
      holy: ['archon', 'oracle'],
      shadow: ['archon', 'voidweaver']
    }
  },
  'rogue': {
    specs: {
      assassination: ['deathstalker', 'fatebound'],
      outlaw: ['fatebound', 'trickster'],
      subtlety: ['deathstalker', 'trickster']
    }
  },
  'shaman': {
    specs: {
      elemental: ['farseer', 'stormbringer'],
      enhancement: ['stormbringer', 'totemic'],
      restoration: ['farseer', 'totemic']
    }
  },
  'warlock': {
    specs: {
      affliction: ['hellcaller', 'soul-harvester'],
      demonology: ['diabolist', 'soul-harvester'],
      destruction: ['diabolist', 'hellcaller']
    }
  },
  'warrior': {
    specs: {
      arms: ['colossus', 'slayer'],
      fury: ['mountain-thane', 'slayer'],
      protection: ['colossus', 'mountain-thane']
    }
  }
}

const validClasses = Object.keys(classes);

export const validateGetAbilitiesFlexible = [
  // Validate gameVersion (optional, defaults to 'latest')
  query('gameVersion')
    .optional()
    .custom((value) => {
      if (value === 'latest') {
        return true;
      }
      // Validate version format (e.g., 11.1.0, 10.2.5, etc.)
      const versionRegex = /^\d+\.\d+\.\d+$/;
      if (!versionRegex.test(value)) {
        throw new Error('Game version must be in format X.Y.Z (e.g., 11.1.0) or "latest"');
      }
      return true;
    }),

  // Validate class (optional)
  query('class')
    .optional()
    .isIn(validClasses).withMessage('Invalid class'),

  // Validate spec (optional, but if provided, class must also be provided)
  query('spec')
    .optional()
    .custom((value, { req }) => {
      const selectedClass = req.query.class;
      if (!selectedClass) {
        throw new Error('Class must be provided when spec is specified');
      }
      if (classes[selectedClass] && classes[selectedClass].specs[value]) {
        return true;
      }
      throw new Error('Invalid spec for the selected class');
    }),

  // Validate heroTalent (optional, but if provided, class must also be provided)
  query('heroTalent')
    .optional()
    .custom((value, { req }) => {
      const selectedClass = req.query.class;
      const selectedSpec = req.query.spec;

      if (!selectedClass) {
        throw new Error('Class must be provided when heroTalent is specified');
      }

      // If spec is provided, validate that the hero talent belongs to that spec
      if (selectedSpec) {
        if (classes[selectedClass] && classes[selectedClass].specs[selectedSpec] && classes[selectedClass].specs[selectedSpec].includes(value)) {
          return true;
        }
        throw new Error('Invalid hero talent for the selected spec');
      }

      // If no spec is provided, validate that the hero talent belongs to the class
      if (classes[selectedClass]) {
        const allHeroTalents = Object.values(classes[selectedClass].specs).flat();
        if (allHeroTalents.includes(value)) {
          return true;
        }
      }
      throw new Error('Invalid hero talent for the selected class');
    }),

  // Validate pagination parameters
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

export const validateGetAbilities = [
  param('wowClass').exists().withMessage('Class is required')
    .isIn(validClasses).withMessage('Invalid class'),
  // Validate spec
  param('spec')
    .exists().withMessage('Spec is required')
    .custom((value, { req }) => {
      const selectedClass = req.params.wowClass;
      if (classes[selectedClass] && classes[selectedClass].specs[value]) {
        return true;
      }
      throw new Error('Invalid spec for the selected class');
    }),

  // Validate heroTalent
  param('heroTalent')
    .exists().withMessage('Hero talent is required')
    .custom((value, { req }) => {
      const selectedClass = req.params.wowClass;
      const selectedSpec = req.params.spec;
      if (classes[selectedClass] && classes[selectedClass].specs[selectedSpec].includes(value)) {
        return true;
      }
      throw new Error('Invalid hero talent for the selected spec');
    }),

  // Validate gameVersion (optional for routes that include it)
  param('gameVersion')
    .optional()
    .custom((value) => {
      // Allow 'latest' or version format like '11.1.0'
      if (value === 'latest') {
        return true;
      }
      // Validate version format (e.g., 11.1.0, 10.2.5, etc.)
      const versionRegex = /^\d+\.\d+\.\d+$/;
      if (!versionRegex.test(value)) {
        throw new Error('Game version must be in format X.Y.Z (e.g., 11.1.0) or "latest"');
      }
      return true;
    })
];
