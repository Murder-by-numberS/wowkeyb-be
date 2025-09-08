import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSettingSchema = Schema({
  scheme: {
    type: String,
    default: "light",
  },
  theme: {
    type: String,
    default: "theme-default",
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },
}, {
  timestamps: true
});

const UserSetting = mongoose.model('UserSetting', userSettingSchema);
export default UserSetting;
