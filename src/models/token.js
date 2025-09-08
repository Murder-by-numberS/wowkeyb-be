import mongoose from 'mongoose';
const { Schema } = mongoose;

const tokenSchema = Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  token: {
    type: String
  },
  token_type: {
    type: String,
    enum: ['verification', 'reset_password']
  }
}, {
  timestamps: true
});

const Token = mongoose.model('Token', tokenSchema);
export default Token;
