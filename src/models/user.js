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
  confirmCode: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  resetCode: {
    type: String,
  },
  resetPassword: {
    type: Boolean,
  },
  resetTime: {
    type: Date,
  },
  encryptedPassword: {
    type: String,
  },
  accessLevel: {
    type: Number,
    default: 1,
    // 1-user
    // 2-
    // 3-
    // 4-
  }
}, {
  timestamps: true
}
);

const User = mongoose.model('User', userSchema);
export default User;
