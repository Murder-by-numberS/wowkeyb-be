import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = Schema({
  email: {
    type: String,
    required: 'true',
    unique: true, // Yes unique one
  },
  username: {
    type: String,
    required: 'true',
    unique: true
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  confirm_code: {
    type: String,
  },
  reset_code: {
    type: String,
  },
  reset_password: {
    type: Boolean,
  },
  reset_time: {
    type: Date,
  },
  encrypted_password: {
    type: String,
  },
  password_changed_at: {
    type: Date,
    default: null,
  },
  username_changes: {
    type: [Date],
    default: [],
  },
  description: {
    type: String,
    default: '',
    maxlength: 500,
  },
  favorite_class: {
    type: String,
    default: null,
  },
  access_level: {
    type: Number,
    default: 1,
    // 1-user
    // 2-
    // 3-
    // 4-
  },
  google_id: {
    type: String,
    default: null,
  },
  auth_provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  }
}, {
  timestamps: true
}
);

const User = mongoose.model('User', userSchema);
export default User;
