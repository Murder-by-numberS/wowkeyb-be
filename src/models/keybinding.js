import mongoose from 'mongoose';
const { Schema } = mongoose;

// Enum definitions
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

const SPEC_ENUM = {
  deathknight: ['blood', 'frost', 'unholy'],
  demonhunter: ['havoc', 'vengeance'],
  druid: ['balance', 'feral', 'guardian', 'restoration'],
  evoker: ['devastation', 'preservation', 'augmentation'],
  hunter: ['beast-mastery', 'marksmanship', 'survival'],
  mage: ['arcane', 'fire', 'frost'],
  monk: ['brewmaster', 'mistweaver', 'windwalker'],
  paladin: ['holy', 'protection', 'retribution'],
  priest: ['discipline', 'holy', 'shadow'],
  rogue: ['assassination', 'outlaw', 'subtlety'],
  shaman: ['elemental', 'enhancement', 'restoration'],
  warlock: ['affliction', 'demonology', 'destruction'],
  warrior: ['arms', 'fury', 'protection']
};

// Flatten spec array for mongoose enum
const SPEC_ENUM_FLAT = Object.values(SPEC_ENUM).flat();

const HERO_TALENTS_ENUM = {
  deathknight: ['deathbringer', 'san-layn', 'rider-of-the-apocalypse'],
  demonhunter: ['aldrachi-reaver', 'fel-scarred'],
  druid: ['elunes-chosen', 'keeper-of-the-grove', 'druid-of-the-claw', 'wildstalker'],
  evoker: ['flameshaper', 'scalecommander', 'chronowarden'],
  hunter: ['dark-ranger', 'pack-leader', 'sentinel'],
  mage: ['spellslinger', 'sunfury', 'frostfire'],
  monk: ['master-of-harmony', 'shado-pan', 'conduit-of-the-celestials'],
  paladin: ['herald-of-the-sun', 'lightsmith', 'templar'],
  priest: ['archon', 'oracle', 'voidweaver'],
  rogue: ['deathstalker', 'fatebound', 'trickster'],
  shaman: ['farseer', 'stormbringer', 'totemic'],
  warlock: ['hellcaller', 'soul-harvester', 'diabolist'],
  warrior: ['colossus', 'slayer', 'mountain-thane']
};

// Flatten hero talents array for mongoose enum
const HERO_TALENTS_ENUM_FLAT = Object.values(HERO_TALENTS_ENUM).flat();

// Rest of the schemas remain the same
const spellSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  spell_id: {
    type: String,
    required: true
  }
});

const keybindSchema = new Schema({
  key: {
    type: String,
    required: true
  },
  spell: {
    type: spellSchema,
    required: true
  },
  bar_id: {
    type: String,
    default: null
  },
  slot_index: {
    type: Number,
    default: null
  }
});

// Action bar layout schema (Phase 2)
const barPositionSchema = new Schema({
  anchor: {
    type: String,
    enum: ['bottom', 'top', 'left', 'right', 'center'],
    default: 'bottom'
  },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 }
}, { _id: false });

const actionBarSchema = new Schema({
  id: { type: String, required: true },
  slots: { type: Number, default: 12 },
  position: { type: barPositionSchema, default: () => ({}) },
  orientation: {
    type: String,
    enum: ['horizontal', 'vertical'],
    default: 'horizontal'
  },
  scale: { type: Number, default: 1 }
}, { _id: false });

const layoutSchema = new Schema({
  bars: [actionBarSchema],
  screen_width: { type: Number, default: 2560 },
  screen_height: { type: Number, default: 1440 },
  bar_gap: { type: Number, default: 16 }
}, { _id: false });

const keybindingSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
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
    enum: [...HERO_TALENTS_ENUM_FLAT, null],
    lowercase: true,
    default: null
  },
  version: {
    type: Schema.Types.ObjectId,
    ref: 'Version',
    required: true
  },
  keybinds: [{
    type: keybindSchema,
    default: []
  }],
  layout: {
    type: layoutSchema,
    default: null
  },
  is_public: {
    type: Boolean,
    default: true
  },
  duplication_count: {
    type: Number,
    default: 0
  },
  deleted_at: {
    type: Date,
    default: null
  },
  // Links keybindings that are versions of the same build together
  // All versions of a keybinding share the same keybinding_group_id
  // Only counts as 1 toward the user's keybinding limit
  keybinding_group_id: {
    type: Schema.Types.ObjectId,
    ref: 'Keybinding',
    default: null
  }
}, {
  timestamps: true
});

// Custom validation for spec based on selected class
keybindingSchema.path('spec').validate(function (value) {
  if (!value) return true; // Allow empty spec
  const classSpecs = SPEC_ENUM[this.class];
  return classSpecs && classSpecs.includes(value);
}, 'Invalid spec for the selected class');

// Add custom validation for hero_talent based on selected class
keybindingSchema.path('hero_talent').validate(function (value) {
  if (!value) return true; // Allow empty hero_talent
  const classHeroTalents = HERO_TALENTS_ENUM[this.class];
  return classHeroTalents && classHeroTalents.includes(value);
}, 'Invalid hero talent for the selected class');

// Add a pre-find middleware to exclude soft-deleted documents
keybindingSchema.pre(/^find/, function (next) {
  const query = this.getQuery();
  // Only apply this filter if we're not explicitly looking for deleted documents
  if (!query.includeDeleted) {
    this.where({ deleted_at: null });
  }
  // Remove includeDeleted from query so MongoDB doesn't try to match it as a field
  delete query.includeDeleted;
  next();
});

// Add database indexes for performance optimization
keybindingSchema.index({ user_id: 1, deleted_at: 1 }); // For user keybindings queries
keybindingSchema.index({ is_public: 1, class: 1 }); // For home page queries
keybindingSchema.index({ version: 1, class: 1, spec: 1 }); // For version-specific queries
keybindingSchema.index({ deleted_at: 1 }); // For soft delete queries
keybindingSchema.index({ name: 1, user_id: 1 }); // For duplicate name queries
keybindingSchema.index({ duplication_count: -1 }); // For popular keybindings sorting

const Keybinding = mongoose.model('Keybinding', keybindingSchema);
export default Keybinding;
