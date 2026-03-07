import mongoose from 'mongoose';
import {
  CLASS_ENUM,
  SPEC_BY_CLASS,
  HERO_TALENTS_BY_CLASS,
  SPEC_ENUM_FLAT,
  HERO_TALENTS_ENUM_FLAT
} from '../utils/class-spec-hero-catalog.js';
const { Schema } = mongoose;

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
  slot_keys: [{ type: String }],
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
  bar_mode: {
    type: String,
    enum: ['blizzard', 'custom'],
    default: 'custom'
  },
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
  const classSpecs = SPEC_BY_CLASS[this.class];
  return classSpecs && classSpecs.includes(value);
}, 'Invalid spec for the selected class');

// Add custom validation for hero_talent based on selected class
keybindingSchema.path('hero_talent').validate(function (value) {
  if (!value) return true; // Allow empty hero_talent
  const classHeroTalents = HERO_TALENTS_BY_CLASS[this.class];
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
