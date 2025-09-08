import mongoose from 'mongoose';
const { Schema } = mongoose;

const versionSchema = new Schema({
  game_version: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

// Add index for efficient latest version queries
versionSchema.index({ createdAt: -1 }); // For sorting by creation date

const Version = mongoose.model('Version', versionSchema);
export default Version;
