import mongoose from 'mongoose';
const { Schema } = mongoose;

// Enum definitions for classes (reusing from ability model)
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

// Enum definitions for specializations (reusing from ability model)
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

const macroSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  class: {
    type: String,
    required: false,
    enum: [...CLASS_ENUM, null],
    lowercase: true,
    default: null
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
  game_version: {
    type: Schema.Types.ObjectId,
    ref: 'Version',
    required: true
  },
  ability: {
    type: Schema.Types.ObjectId,
    ref: 'Ability',
    default: null
  },
  show_tooltip: {
    type: Boolean,
    default: false
  },
  macro_text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255 // WoW macro character limit
  },
  icon: {
    type: Schema.Types.ObjectId,
    ref: 'Icon',
    default: null // Reference to Icon model
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 50
  }],
  is_active: {
    type: Boolean,
    default: true
  },
  is_public: {
    type: Boolean,
    default: false
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  file_id: {
    type: Schema.Types.ObjectId,
    ref: 'File',
    default: null
  },
  usage_count: {
    type: Number,
    default: 0
  },
  deletedAt: {
    type: Date,
    default: null
  },
}, {
  timestamps: true
});

// Add a pre-find middleware to exclude inactive and soft-deleted macros
macroSchema.pre(/^find/, function (next) {
  const query = this.getQuery();
  // Only apply this filter if we're not explicitly looking for inactive or deleted macros
  if (!query.includeInactive && !query.includeDeleted) {
    this.where({
      is_active: true,
      deletedAt: null
    });
  }
  // Remove these flags from query so MongoDB doesn't try to match them as fields
  delete query.includeInactive;
  delete query.includeDeleted;
  next();
});

// Custom validation for class when ability is specified
macroSchema.pre('validate', function (next) {
  if (this.ability && !this.class) {
    return next(new Error('Class is required when specifying an ability'));
  }
  next();
});

// Custom validation for spec based on selected class
macroSchema.path('spec').validate(function (value) {
  if (!value) return true; // Allow empty spec for class-wide macros
  if (!this.class) return true; // Skip validation if no class is specified
  const classSpecs = SPEC_ENUM[this.class];
  return classSpecs && classSpecs.includes(value);
}, 'Invalid spec for the selected class');

// Custom validation for macro text length (WoW has a 255 character limit)
macroSchema.path('macro_text').validate(function (value) {
  return value && value.length <= 255;
}, 'Macro text cannot exceed 255 characters');

// Indexes for efficient queries
macroSchema.index({ class: 1, spec: 1, game_version: 1, is_active: 1, deletedAt: 1 }); // For class-specific queries
macroSchema.index({ game_version: 1, is_active: 1, deletedAt: 1 }); // For general queries without class
macroSchema.index({ hero_talent: 1, game_version: 1, is_active: 1, deletedAt: 1 }); // For hero talent queries
macroSchema.index({ ability: 1, game_version: 1, is_active: 1, deletedAt: 1 }); // For ability-specific queries
macroSchema.index({ tags: 1, game_version: 1, is_active: 1, deletedAt: 1 }); // For tag-based queries
macroSchema.index({ is_public: 1, game_version: 1, is_active: 1, deletedAt: 1 }); // For public macro queries
macroSchema.index({ user_id: 1, game_version: 1, deletedAt: 1 }); // For user-specific queries
macroSchema.index({ file_id: 1 }); // For file-specific queries
macroSchema.index({ usage_count: -1, game_version: 1, deletedAt: 1 }); // For popular macros
macroSchema.index({ name: 'text', description: 'text', macro_text: 'text' }); // For text search
macroSchema.index({ deletedAt: 1 }); // For soft delete queries

// Virtual for formatted class name
macroSchema.virtual('formatted_class').get(function () {
  if (!this.class) return null;
  return this.class.charAt(0).toUpperCase() + this.class.slice(1);
});

// Virtual for formatted spec name
macroSchema.virtual('formatted_spec').get(function () {
  if (!this.spec) return null;
  return this.spec.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
});

// Method to increment usage count
macroSchema.methods.incrementUsage = function () {
  this.usage_count += 1;
  return this.save();
};

// Method to add a tag
macroSchema.methods.addTag = function (tag) {
  if (!this.tags.includes(tag.toLowerCase())) {
    this.tags.push(tag.toLowerCase());
  }
  return this.save();
};

// Method to remove a tag
macroSchema.methods.removeTag = function (tag) {
  this.tags = this.tags.filter(t => t !== tag.toLowerCase());
  return this.save();
};

// Method to soft delete a macro
macroSchema.methods.softDelete = function () {
  this.is_active = false;
  this.deletedAt = new Date();
  return this.save();
};

// Method to restore a soft-deleted macro
macroSchema.methods.restore = function () {
  this.is_active = true;
  this.deletedAt = null;
  return this.save();
};

// Static method to find popular macros
macroSchema.statics.findPopular = function (gameVersion, limit = 10) {
  const query = {
    is_active: true,
    is_public: true
  };

  // Only filter by game_version if provided
  if (gameVersion) {
    query.game_version = gameVersion;
  }

  return this.find(query)
    .sort({ usage_count: -1 })
    .limit(limit)
    .populate('game_version', 'game_version')
    .populate('user_id', 'username')
    .populate('icon', '_id name cloudfrontUrl keywords')
    .populate('ability', 'name icon description');
};

// Static method to find macros by tags
macroSchema.statics.findByTags = function (tags, gameVersion, limit = 20) {
  return this.find({
    tags: { $in: tags.map(tag => tag.toLowerCase()) },
    game_version: gameVersion,
    is_active: true
  })
    .sort({ usage_count: -1 })
    .limit(limit)
    .populate('game_version', 'game_version')
    .populate('user_id', 'username');
};

// Static method to find macros by ability
macroSchema.statics.findByAbility = function (abilityId, gameVersion, limit = 20) {
  return this.find({
    ability: abilityId,
    game_version: gameVersion,
    is_active: true
  })
    .sort({ usage_count: -1 })
    .limit(limit)
    .populate('game_version', 'game_version')
    .populate('ability', 'name icon description')
    .populate('user_id', 'username');
};

const Macro = mongoose.model('Macro', macroSchema);
export default Macro;
