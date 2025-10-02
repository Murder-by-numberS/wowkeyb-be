import mongoose from 'mongoose';

const iconSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  keywords: [{
    type: String
  }],
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: {
    type: Date
  },
  s3Path: {
    type: String,
    required: false
  },
  cloudfrontUrl: {
    type: String,
    required: false
  },
  originalFileName: {
    type: String,
    required: false
  },
  fdid: {
    type: Number,
    required: false
  }
}, {
  timestamps: true
});

// Indexes for better performance
iconSchema.index({ name: 1 });
iconSchema.index({ keywords: 1 });
iconSchema.index({ usageCount: -1 });
iconSchema.index({ s3Path: 1 });
iconSchema.index({ originalFileName: 1 });
iconSchema.index({ fdid: 1 });


// Static method to search icons
iconSchema.statics.searchIcons = function (searchTerm, limit = 50) {
  const regex = new RegExp(searchTerm, 'i');

  // Check if searchTerm is a number (potential FDID)
  const isNumeric = /^\d+$/.test(searchTerm);

  const searchConditions = [
    { name: regex },
    { keywords: regex },
    { originalFileName: regex }
  ];

  // If it's a number, also search by FDID
  if (isNumeric) {
    searchConditions.push({ fdid: parseInt(searchTerm) });
  }

  return this.find({
    $or: searchConditions
  }).limit(limit);
};

// Static method to get popular icons
iconSchema.statics.getPopularIcons = function (limit = 20) {
  return this.find({})
    .sort({ usageCount: -1 })
    .limit(limit);
};

// Static method to find icon by original filename
iconSchema.statics.findByOriginalFileName = function (fileName) {
  return this.findOne({ originalFileName: fileName });
};

// Static method to find icon by fdid
iconSchema.statics.findByFdid = function (fdid) {
  return this.findOne({ fdid: fdid });
};

// Instance method to increment usage
iconSchema.methods.incrementUsage = function () {
  this.usageCount += 1;
  this.lastUsed = new Date();
  return this.save();
};

const Icon = mongoose.model('Icon', iconSchema);

export default Icon;
