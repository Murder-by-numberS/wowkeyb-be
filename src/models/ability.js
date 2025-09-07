import mongoose from 'mongoose';
const { Schema } = mongoose;

// Enum definitions for classes
const CLASS_ENUM = [
  'deathknight',
  'demonhunter',
  'druid',
  'evoker',
  'hunter',
  'mage',
  'monk',
  'paladin',
  'priest',
  'rogue',
  'shaman',
  'warlock',
  'warrior'
];

// Enum definitions for specializations
const SPEC_ENUM = {
  paladin: ['holy', 'protection', 'retribution'],
  deathknight: ['blood', 'frost', 'unholy'],
  demonhunter: ['havoc', 'vengeance'],
  druid: ['balance', 'feral', 'guardian', 'restoration'],
  evoker: ['devastation', 'preservation', 'augmentation'],
  hunter: ['beast-mastery', 'marksmanship', 'survival'],
  mage: ['arcane', 'fire', 'frost'],
  monk: ['brewmaster', 'mistweaver', 'windwalker'],
  priest: ['discipline', 'holy', 'shadow'],
  rogue: ['assassination', 'outlaw', 'subtlety'],
  shaman: ['elemental', 'enhancement', 'restoration'],
  warlock: ['affliction', 'demonology', 'destruction'],
  warrior: ['arms', 'fury', 'protection']
};

// Flatten spec array for mongoose enum
const SPEC_ENUM_FLAT = Object.values(SPEC_ENUM).flat();

// Enum for ability types
const ABILITY_TYPE_ENUM = ['class', 'spec', 'hero_talent'];

const abilitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  spell_id: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true,
    enum: CLASS_ENUM,
    lowercase: true
  },
  spec: {
    type: String,
    enum: [...SPEC_ENUM_FLAT, null],
    lowercase: true,
    default: null
  },
  hero_talent: {
    type: String,
    lowercase: true,
    default: null
  },
  ability_type: {
    type: String,
    required: true,
    enum: ABILITY_TYPE_ENUM,
    default: 'class'
  },
  game_version: {
    type: Schema.Types.ObjectId,
    ref: 'Version',
    required: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  level_required: {
    type: Number,
    default: 1
  },
  cooldown: {
    type: Number, // in seconds
    default: 0
  },
  range: {
    type: Number, // in yards
    default: 0
  },
  cost: {
    type: String, // e.g., "Mana", "Holy Power", "Rage", etc.
    default: null
  },
  cost_amount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add a pre-find middleware to exclude inactive abilities
abilitySchema.pre(/^find/, function (next) {
  // Only apply this filter if we're not explicitly looking for inactive abilities
  if (!this.getQuery().includeInactive) {
    this.where({ is_active: true });
  }
  next();
});

// Custom validation for spec based on selected class
abilitySchema.path('spec').validate(function (value) {
  if (!value) return true; // Allow empty spec for class abilities
  const classSpecs = SPEC_ENUM[this.class];
  return classSpecs && classSpecs.includes(value);
}, 'Invalid spec for the selected class');

// Index for efficient queries
abilitySchema.index({ class: 1, spec: 1, game_version: 1, is_active: 1 });
abilitySchema.index({ spell_id: 1, game_version: 1 });
abilitySchema.index({ class: 1, game_version: 1, is_active: 1 }); // For class-only queries
abilitySchema.index({ hero_talent: 1, game_version: 1, is_active: 1 }); // For hero talent queries
abilitySchema.index({ ability_type: 1, class: 1, game_version: 1 }); // For ability type queries

const Ability = mongoose.model('Ability', abilitySchema);
export default Ability;
